import React, { useEffect, useRef } from "react";
import { useState } from "react";
import "./BoardBar.scss";
import { Form, OverlayTrigger, Popover } from "react-bootstrap";
import {
  saveContentAfterPressEnter,
  selectAllInlineText,
} from "utilities/contentEditable";
import _ from "lodash";
import { updateMember, boardUpdate, getUserByEmail } from "actions/boardAction";
import { updateData } from "features/boardSlice";
import { openAlert } from "features/alertSlice";
import Drawer from "components/Common/Drawer/Drawer";

const BoardBar = ({ boardData, dispatch }) => {
  const [boardTitle, setBoardTitle] = useState("");
  const handleBoardTitleChange = (e) => setBoardTitle(e.target.value);

  const inviteEmailRef = useRef();
  const [inviteEmail, setInviteEmail] = useState("");
  const handleInviteEmailChange = (e) => setInviteEmail(e.target.value);

  const [toggleShowOverlay, setToggleShowOverlay] = useState(false);
  const handleToggleShowOverlay = () =>
    setToggleShowOverlay(!toggleShowOverlay);

  const [showDrawer, setShowDrawer] = useState(false);

  const handleCloseDrawer = () => setShowDrawer(false);
  const handleShowDrawer = () => setShowDrawer(true);

  useEffect(() => {
    setBoardTitle(boardData.title);
  }, [boardData.title]);

  const handleBoardTitleBlur = () => {
    if (boardTitle !== boardData.title) {
      const cloneBoard = _.cloneDeep(boardData);
      const newBoard = {
        ...cloneBoard,
        title: boardTitle,
      };
      dispatch(updateData(newBoard));
      boardUpdate(newBoard, dispatch);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail) {
      inviteEmailRef.current.focus();
      return;
    }
    const cloneBoard = _.cloneDeep(boardData);
    const foundedUser = await getUserByEmail(inviteEmail, dispatch);

    const existedUserInBoard = cloneBoard.members.find(
      (m) => m._id === foundedUser._id
    );

    if (existedUserInBoard) {
      dispatch(
        openAlert({
          message: "User already added to this board!",
          variant: "danger",
        })
      );
    } else {
      cloneBoard.members.push({
        _id: foundedUser._id,
        name: foundedUser.name,
        email: foundedUser.email,
        role: "member",
      });
      dispatch(updateData(cloneBoard));
      await updateMember(foundedUser._id, cloneBoard, true, dispatch);
    }
    setInviteEmail("");
    handleToggleShowOverlay();
  };

  return (
    <nav className="navbar-board">
      <OverlayTrigger
        show={toggleShowOverlay}
        trigger="click"
        placement="bottom"
        onEntered={() => {
          inviteEmailRef?.current?.focus();
          inviteEmailRef?.current?.select();
        }}
        rootClose={true}
        overlay={
          <Popover>
            <Popover.Header as="h3">Invite members</Popover.Header>
            <Popover.Body>
              <input
                style={{
                  padding: "5px",
                  marginRight: "5px",
                  borderRadius: "4px",
                  borderWidth: "1px",
                }}
                type="text"
                placeholder="Enter member's email"
                ref={inviteEmailRef}
                onChange={handleInviteEmailChange}
              />
              <button
                style={{
                  backgroundColor: "rgb(0, 145, 255)",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "4px",
                }}
                onClick={handleInviteMember}
              >
                Add
              </button>
            </Popover.Body>
          </Popover>
        }
      >
        <button onClick={handleToggleShowOverlay} className="btn-add-member">
          Add members
        </button>
      </OverlayTrigger>
      <div className="right-content">
        <Form.Control
          size="sm"
          type="text"
          className="trello-content-editable"
          value={boardTitle}
          onChange={handleBoardTitleChange}
          onBlur={handleBoardTitleBlur}
          onKeyDown={saveContentAfterPressEnter}
          onClick={selectAllInlineText}
          onMouseDown={(e) => e.preventDefault()}
          spellCheck="false"
        />
        <button className="btn-show-menu" onClick={handleShowDrawer}>
          Show Menu
        </button>
      </div>
      <Drawer
        dispatch={dispatch}
        boardData={boardData}
        showDrawer={showDrawer}
        handleCloseDrawer={handleCloseDrawer}
      />
    </nav>
  );
};

export default BoardBar;
