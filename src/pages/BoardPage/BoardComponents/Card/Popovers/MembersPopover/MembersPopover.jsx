import { updateCard } from "actions/boardAction";
import { selectBoard, updateColumnData, updateData } from "features/boardSlice";
import _ from "lodash";
import React from "react";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import "./MembersPopover.scss";
import { AiOutlineCheck } from "react-icons/ai";

const MembersPopover = ({ card, dispatch }) => {
  const boardData = useSelector(selectBoard);

  const handleToggleMemberToCard = async (member) => {
    const clonedCard = _.cloneDeep(card);
    const existedMemberIndex = clonedCard.members.findIndex(
      (item) => item._id === member._id
    );
    if (existedMemberIndex !== -1) {
      clonedCard.members.splice(existedMemberIndex, 1);
    } else {
      clonedCard.members.push({ _id: member._id, name: member.name });
    }
    const newBoard = _.cloneDeep(boardData);
    newBoard.columns.forEach((column) => {
      column.cards.forEach((card) => {
        if (card._id === clonedCard._id) card.members = clonedCard.members;
      });
    });
    dispatch(updateColumnData(newBoard.columns));
    updateCard(clonedCard, dispatch);
  };

  return (
    <div className="members-popover">
      <Form.Control type="text" size="sm" placeholder="Search members..." />
      <p>Board's members</p>
      <div className="members-popover-content">
        {boardData.members.map((m, index) => (
          <div
            key={index}
            className="members-popover-content-item"
            onClick={() => handleToggleMemberToCard(m)}
          >
            <div className="item">
              <div className="userbox">{m.name[0].toUpperCase()}</div>
              <p>{m.name}</p>
            </div>
            {card.members.findIndex((item) => item._id === m._id) !== -1 && (
              <AiOutlineCheck className="icon" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersPopover;
