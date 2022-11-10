import { updateCard } from "actions/boardAction";
import _ from "lodash";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import "./ChecklistPopover.scss";

const ChecklistPopover = ({ card, dispatch, setBasePopoverFlag }) => {
  const [addChecklistTitle, setAddChecklistTitle] = useState("");
  const handleChecklistTitleChange = (e) =>
    setAddChecklistTitle(e.target.value);

  const handleAddNewCheckList = async () => {
    if (addChecklistTitle === "") {
      setBasePopoverFlag(true);
      return;
    }
    const clonedCard = _.cloneDeep(card);
    clonedCard.checklist.push({ title: addChecklistTitle, items: [] });
    updateCard(clonedCard, dispatch);
    setAddChecklistTitle("");
    setBasePopoverFlag(false);
  };

  return (
    <div className="checklist-popover">
      <p>Title</p>
      <Form.Control
        type="text"
        size="sm"
        placeholder="Checklist's title"
        value={addChecklistTitle}
        onChange={handleChecklistTitleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddNewCheckList();
            e.preventDefault();
          }
        }}
        className="checklist-popover-input"
      />
      <button
        className="btn-add-new-checklist"
        onMouseDown={handleAddNewCheckList}
      >
        Add
      </button>
    </div>
  );
};

export default ChecklistPopover;
