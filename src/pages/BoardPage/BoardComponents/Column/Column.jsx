import Card from "../Card/Card";
import React, { useEffect, useRef, useState } from "react";
import "./Column.scss";
import { mapOrder } from "utilities/sorts";
import { Container, Draggable } from "react-smooth-dnd";
import { BsPlusLg } from "react-icons/bs";
import { IoTrash } from "react-icons/io5";
import { Button, Dropdown, Form } from "react-bootstrap";
import ConfirmModal from "components/Common/ConfirmModal";
import { MODAL_ACTION_CONFIRM } from "utilities/constants";
import {
  saveContentAfterPressEnter,
  selectAllInlineText,
} from "utilities/contentEditable";
import _ from "lodash";
import { createCard, updateColumn } from "actions/boardAction";
import { useDispatch } from "react-redux";

const Column = ({ column, onCardDrop }) => {
  const dispatch = useDispatch();
  const newColumns = _.cloneDeep(column);
  const cards = mapOrder(newColumns.cards, newColumns.cardOrder, "_id");

  const [columnTitle, setColumnTitle] = useState("");
  const handleColumnTitleChange = (e) => setColumnTitle(e.target.value);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const toggleConfirmModal = () => setShowConfirmModal(!showConfirmModal);

  const [openNewCardForm, setOpenNewCardForm] = useState(false);
  const toggleNewCardForm = () => setOpenNewCardForm(!openNewCardForm);

  const newCardTextareaRef = useRef(null);

  const [newCardTitle, setNewCardTitle] = useState("");
  const onNewCardTitleChange = (e) => setNewCardTitle(e.target.value);

  useEffect(() => {
    setColumnTitle(column.title);
  }, [column.title]);

  useEffect(() => {
    newCardTextareaRef?.current?.focus();
    newCardTextareaRef?.current?.select();
  }, [openNewCardForm]);

  const handleColumnTitleBlur = () => {
    if (columnTitle !== column.title) {
      const newColumn = {
        ...column,
        title: columnTitle,
      };
      updateColumn(newColumn, dispatch);
    }
  };

  const onConfirmModalAction = (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      const newColumn = {
        ...column,
        _destroy: true,
      };
      updateColumn(newColumn, dispatch);
    }
    toggleConfirmModal();
  };

  const addNewCard = () => {
    if (!newCardTitle) {
      newCardTextareaRef.current.focus();
      return;
    }
    const newCardToAdd = {
      boardId: column.boardId,
      columnId: column._id,
      title: newCardTitle.trim(),
    };

    createCard(newCardToAdd, dispatch);
    setNewCardTitle("");
    toggleNewCardForm();
  };

  return (
    <div className="column">
      <header className="column-drag-handle">
        <div className="column-title">
          <Form.Control
            size="sm"
            type="text"
            className="trello-content-editable"
            value={columnTitle}
            onChange={handleColumnTitleChange}
            onBlur={handleColumnTitleBlur}
            onKeyDown={saveContentAfterPressEnter}
            onClick={selectAllInlineText}
            onMouseDown={(e) => e.preventDefault()}
            spellCheck="false"
          />
        </div>
        <div className="column-dropdown-actions">
          <Dropdown>
            <Dropdown.Toggle
              id="dropdown-basic"
              size="sm"
              className="dropdown-btn"
            />

            <Dropdown.Menu>
              <Dropdown.Item onClick={toggleNewCardForm}>
                Add card...
              </Dropdown.Item>
              <Dropdown.Item onClick={toggleConfirmModal}>
                Remove column...
              </Dropdown.Item>
              <Dropdown.Item>
                Move all cards in this column (beta)...
              </Dropdown.Item>
              <Dropdown.Item>
                Archive all cards in this column (beta)...
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
      <div className="card-list">
        <Container
          groupName="col"
          onDrop={(dropResult) => onCardDrop(column._id, dropResult)}
          getChildPayload={(index) => cards[index]}
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: "card-drop-preview",
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {cards.map((card, index) => (
            <Draggable key={index}>
              <Card key={index} card={card} column={column}/>
            </Draggable>
          ))}
        </Container>
        {openNewCardForm && (
          <div className="add-new-card-area">
            <Form.Control
              size="sm"
              as="textarea"
              rows={3}
              placeholder="Enter a title for this card..."
              className="textarea-enter-new-card"
              ref={newCardTextareaRef}
              value={newCardTitle}
              onChange={onNewCardTitleChange}
              onKeyDown={(event) => event.key === "Enter" && addNewCard()}
            />
          </div>
        )}
      </div>
      <footer>
        {openNewCardForm && (
          <div className="add-new-card-actions">
            <Button variant="success" size="sm" onClick={addNewCard}>
              Add card
            </Button>
            <IoTrash className="cancel-icon" onClick={toggleNewCardForm} />
          </div>
        )}
        {!openNewCardForm && (
          <div className="footer-action" onClick={toggleNewCardForm}>
            <BsPlusLg className="icon" />
            Add another card
          </div>
        )}
      </footer>
      <ConfirmModal
        show={showConfirmModal}
        onAction={onConfirmModalAction}
        title="Remove column"
        content={`Are you sure you want to remove <strong>${column.title}</strong>. <br/> All related cards will also be removed!`}
      />
    </div>
  );
};

export default Column;
