import React, { useState } from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import "./Drawer.scss";
import { CloseButton, Offcanvas } from "react-bootstrap";
import Loading from "../Loading/Loading";
import ConfirmModal from "../ConfirmModal";
import { MODAL_ACTION_CONFIRM } from "utilities/constants";
import { boardUpdate, updateMember } from "actions/boardAction";
import { openAlert } from "features/alertSlice";
import { selectUser } from "features/userSlice";

const Drawer = ({ handleCloseDrawer, showDrawer, boardData, dispatch }) => {
  const { userInfo } = useSelector(selectUser);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const toggleConfirmModal = () => setShowConfirmModal(!showConfirmModal);

  const onConfirmModalAction = async (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      const cloneBoard = _.cloneDeep(boardData);
      const boardToDelete = {
        ...cloneBoard,
        _destroy: true,
      };
      const boardOwner = cloneBoard.members.find((m) => m._id === userInfo._id);
      if (boardOwner.role === "owner") {
        await boardUpdate(boardToDelete, dispatch);
      } else
        dispatch(
          openAlert({
            message: "Only board's owner can delete this board!",
            variant: "danger",
          })
        );
    }
    toggleConfirmModal();
  };

  const handleRemoveMember = async (member) => {
    const cloneBoard = _.cloneDeep(boardData);
    const memberIndex = cloneBoard.members.findIndex(
      (m) => m._id === member._id
    );
    cloneBoard.members.splice(memberIndex, 1);
    await updateMember(member._id, cloneBoard, false, dispatch);
    if (userInfo._id === member._id && member.role === "member")
      dispatch(
        openAlert({
          message: `You left ${cloneBoard.title}!`,
          variant: "success",
          delay: 1500,
          nextRoute: "/boards",
        })
      );
  };

  const renderCondition = (member) => {
    const cloneBoard = _.cloneDeep(boardData);
    const boardOwner = cloneBoard.members.find((m) => m._id === userInfo._id);
    if (
      member.role === "member" &&
      (boardOwner.role === "owner" || member._id === userInfo._id)
    ) {
      return <CloseButton onClick={() => handleRemoveMember(member)} />;
    }
    return null;
  };

  return (
    <>
      <Offcanvas show={showDrawer} onHide={handleCloseDrawer} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Board's members</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {boardData.members.length < 1 ? (
            <Loading />
          ) : (
            boardData.members.map((member, index) => (
              <div key={index} className="drawer-content">
                <div className="drawer-content-right">
                  <div className="userbox">{member.name[0].toUpperCase()}</div>
                  <p>{member.email}</p>
                  <span style={{ color: "red" }}>
                    <i>{member.role}</i>
                  </span>
                </div>
                {renderCondition(member)}
              </div>
            ))
          )}
          {boardData.members.find(
            (m) => m._id === userInfo._id && m.role === "owner"
          ) !== undefined ? (
            <button className="btn-del" onClick={toggleConfirmModal}>
              Delete this board
            </button>
          ) : null}
        </Offcanvas.Body>
      </Offcanvas>
      <ConfirmModal
        show={showConfirmModal}
        onAction={onConfirmModalAction}
        title="Delete Board"
        content={`Are you sure you want to delete <strong>${boardData.title}</strong>. <br/> All related contents will also be removed!`}
      />
    </>
  );
};

export default Drawer;
