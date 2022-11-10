import React, { useEffect, useState } from "react";
import "./Description.scss";
import { MdOutlineDescription } from "react-icons/md";
import { CloseButton, Form } from "react-bootstrap";
import { selectAllInlineText } from "utilities/contentEditable";
import _ from "lodash";
import { updateCard } from "actions/boardAction";

const Description = ({
  card,
  descriptionToggle,
  setDescriptionToggle,
  dispatch,
}) => {
  const [cardDescription, setCardDescription] = useState("");
  const handleCardDescriptionChange = (e) => setCardDescription(e.target.value);

  useEffect(() => {
    setCardDescription(card.description);
  }, [card.description]);

  const handleDescriptionSave = () => {
    if (cardDescription === card.description || cardDescription === "") {
      return;
    }
    const newCard = { ..._.cloneDeep(card), description: cardDescription };
    updateCard(newCard, dispatch);
    setDescriptionToggle(false);
  };

  return (
    <div className="description">
      <div className="description-head">
        <MdOutlineDescription className="card-icon" />
        <p>Description</p>
      </div>
      <div className="description-content">
        <Form.Control
          as="textarea"
          rows={descriptionToggle ? 5 : 1}
          className="trello-content-editable"
          value={cardDescription}
          onChange={handleCardDescriptionChange}
          onBlur={() => {
            setCardDescription(card.description);
            setDescriptionToggle(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleDescriptionSave();
              e.preventDefault();
              e.target.blur();
            }
          }}
          onClick={(e) => {
            selectAllInlineText(e);
            setDescriptionToggle(true);
          }}
          onMouseDown={(e) => e.preventDefault()}
          spellCheck="false"
          placeholder="Add description here"
        />
        {descriptionToggle && (
          <div className="description-content-actions">
            <button className="btn-save" onMouseDown={handleDescriptionSave}>
              Save
            </button>
            <CloseButton
              onClick={() => {
                setCardDescription("");
                setDescriptionToggle(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Description;
