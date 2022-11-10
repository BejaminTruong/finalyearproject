import React, { useEffect, useState } from "react";
import { CloseButton, Form, Modal } from "react-bootstrap";
import "./Card.scss";
import {
  MdOutlineDeleteForever,
  MdOutlineDescription,
  MdOutlineChat,
} from "react-icons/md";
import { RiCheckboxMultipleLine, RiWindow2Fill } from "react-icons/ri";
import { AiOutlineUser, AiOutlineClockCircle } from "react-icons/ai";
import {
  saveContentAfterPressEnter,
  selectAllInlineText,
} from "utilities/contentEditable";
import Members from "./Members/Members";
import Description from "./Description/Description";
import Checklist from "./Checklist/Checklist";
import Activity from "./Activity/Activity";
import BasePopover from "./Popovers/BasePopover";
import MembersPopover from "./Popovers/MembersPopover/MembersPopover";
import ChecklistPopover from "./Popovers/ChecklistPopover/ChecklistPopover";
import DatePopover from "./Popovers/DatePopover/DatePopover";
import ConfirmModal from "components/Common/ConfirmModal";
import _ from "lodash";
import { updateCard, updateColumn } from "actions/boardAction";
import { useDispatch } from "react-redux";
import DateComponent from "./Date/Date";
import { MODAL_ACTION_CONFIRM } from "utilities/constants";
import { format } from "date-fns";

const Card = ({ card, column }) => {
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setDescriptionToggle(false);
    setShowModal(!showModal);
  };

  const [cardTitle, setCardTitle] = useState("");
  const handleCardTitleChange = (e) => setCardTitle(e.target.value);

  const [descriptionToggle, setDescriptionToggle] = useState(true);

  const [basePopoverFlag, setBasePopoverFlag] = useState(false);
  const [membersPopoverToggle, setMembersPopoverToggle] = useState(false);
  const [checklistPopoverToggle, setChecklistPopoverToggle] = useState(false);
  const [datePopoverToggle, setDatePopoverToggle] = useState(false);

  const [deleteCardModal, setDeleteCardModal] = useState(false);
  const toggleDeleteCardModal = () => setDeleteCardModal(!deleteCardModal);

  const [checkedItemCount, setCheckedItemCount] = useState({
    completed: 0,
    notCompleted: 0,
  });

  useEffect(() => {
    setCardTitle(card.title);
  }, [card.title]);

  useEffect(() => {
    card.checklist.forEach((c) => {
      c.items.forEach((i) => {
        if (i.completed)
          setCheckedItemCount((prev) => ({
            ...prev,
            completed: prev.completed + 1,
          }));
        else
          setCheckedItemCount((prev) => ({
            ...prev,
            notCompleted: prev.notCompleted + 1,
          }));
      });
    });
    return () => setCheckedItemCount({ completed: 0, notCompleted: 0 });
  }, [card.checklist]);

  const handleCardTitleBlur = () => {
    if (cardTitle !== card.title) {
      const newCard = { ..._.cloneDeep(card), title: cardTitle };
      updateCard(newCard, dispatch);
    }
  };

  const onConfirmCardAction = (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      const clonedCard = _.cloneDeep(card);
      clonedCard._destroy = true;
      const clonedColumn = _.cloneDeep(column);
      let newCardOrder = clonedColumn.cardOrder.filter((c) => c !== card._id);
      const newColumn = { ...clonedColumn, cardOrder: newCardOrder };
      updateCard(clonedCard, dispatch);
      updateColumn(newColumn, dispatch);
    }
    toggleDeleteCardModal();
  };

  return (
    <>
      <div className="card-item" onClick={toggleModal}>
        {card.cover && (
          <img
            src={card.cover}
            alt="benjamintruong_alt"
            className="card-cover"
            onMouseDown={(e) => e.preventDefault()}
          />
        )}
        {card.title}
        <div className="card-item-small">
          {card.date !== null ? (
            <span
              className={`${
                card.date.completed ||
                Date.parse(card.date.dueDate) < Date.now()
                  ? card.date.completed
                    ? "finished"
                    : Date.parse(card.date.dueDate) < Date.now()
                    ? "overdue"
                    : ""
                  : ""
              }`}
            >
              <AiOutlineClockCircle />
              {`${
                card.date.startDate
                  ? format(new Date(card.date.startDate), "dd MMM")
                  : ""
              } ${
                card.date.startDate ? (card.date.dueDate ? " - " : "") : ""
              } ${
                card.date.dueDate
                  ? format(new Date(card.date.dueDate), "dd MMM")
                  : ""
              }`}
            </span>
          ) : null}
          {card.description ? (
            <span>
              <MdOutlineDescription className="small-icon" />
            </span>
          ) : null}
          {card.comments.length > 0 ? (
            <span>
              <MdOutlineChat className="small-icon" />
              {card.comments.length}
            </span>
          ) : null}
          {card.checklist.length > 0 ? (
            <span
              className={`${
                checkedItemCount.completed !==
                  checkedItemCount.completed + checkedItemCount.notCompleted ||
                checkedItemCount.completed + checkedItemCount.notCompleted === 0
                  ? ""
                  : "finished"
              }`}
            >
              <RiCheckboxMultipleLine className="small-icon" />
              {checkedItemCount.completed}/
              {checkedItemCount.completed + checkedItemCount.notCompleted}
            </span>
          ) : null}
        </div>
        <div className="card-item-members">
          {card.members.map((m, index) => (
            <div key={index} className="userbox">
              {m.name[0].toUpperCase()}
            </div>
          ))}
        </div>
      </div>
      <Modal size="lg" show={showModal} onHide={toggleModal} keyboard={false}>
        <Modal.Body style={{ minHeight: "100vh" }}>
          <CloseButton onClick={toggleModal} />
          <div className="card-title">
            <RiWindow2Fill className="card-icon" />
            <div className="card-title-input">
              <Form.Control
                size="sm"
                type="text"
                className="trello-content-editable"
                value={cardTitle}
                onChange={handleCardTitleChange}
                onBlur={handleCardTitleBlur}
                onKeyDown={saveContentAfterPressEnter}
                onClick={selectAllInlineText}
                onMouseDown={(e) => e.preventDefault()}
                spellCheck="false"
              />
              <span>
                in column: <u>{column.title}</u>
              </span>
            </div>
          </div>
          <div className="card-body">
            <div className="card-body-content">
              <div className="popover-show-content">
                <Members card={card} dispatch={dispatch} />
                <DateComponent
                  card={card}
                  dispatch={dispatch}
                  basePopoverFlag={basePopoverFlag}
                  setBasePopoverFlag={setBasePopoverFlag}
                />
              </div>
              <Description
                card={card}
                dispatch={dispatch}
                descriptionToggle={descriptionToggle}
                setDescriptionToggle={setDescriptionToggle}
              />
              <Checklist card={card} dispatch={dispatch} />
              <Activity card={card} dispatch={dispatch} />
            </div>
            <div className="card-body-features">
              <p>Add to card</p>
              <div className="add-to-card">
                <div
                  className="feature-item"
                  onClick={() => setMembersPopoverToggle(true)}
                >
                  <AiOutlineUser className="card-icon" />
                  <p>Members</p>
                  <BasePopover
                    title="Members"
                    content={<MembersPopover card={card} dispatch={dispatch} />}
                    popoverToggle={membersPopoverToggle}
                    setPopoverToggle={setMembersPopoverToggle}
                    responsiveClass="popover-responsive"
                  />
                </div>
                <div
                  className="feature-item"
                  onClick={() => setChecklistPopoverToggle(true)}
                >
                  <RiCheckboxMultipleLine className="card-icon" />
                  <p>Checklist</p>
                  <BasePopover
                    title="Checklist"
                    basePopoverFlag={basePopoverFlag}
                    content={
                      <ChecklistPopover
                        card={card}
                        dispatch={dispatch}
                        setBasePopoverFlag={setBasePopoverFlag}
                      />
                    }
                    popoverToggle={checklistPopoverToggle}
                    setPopoverToggle={setChecklistPopoverToggle}
                    responsiveClass="popover-responsive"
                  />
                </div>
                <div
                  className="feature-item"
                  onClick={() => setDatePopoverToggle(true)}
                >
                  <AiOutlineClockCircle className="card-icon" />
                  <p>Dates</p>
                  <BasePopover
                    title="Date"
                    basePopoverFlag={basePopoverFlag}
                    content={
                      <DatePopover
                        card={card}
                        dispatch={dispatch}
                        setBasePopoverFlag={setBasePopoverFlag}
                      />
                    }
                    popoverToggle={datePopoverToggle}
                    setPopoverToggle={setDatePopoverToggle}
                    responsiveClass="popover-responsive"
                  />
                </div>
              </div>
              <div className="actions">
                <p>Actions</p>
                <div className="feature-item" onClick={toggleDeleteCardModal}>
                  <MdOutlineDeleteForever className="card-icon" />
                  <p>Delete this card</p>
                  <ConfirmModal
                    show={deleteCardModal}
                    onAction={onConfirmCardAction}
                    title="Delete Card"
                    content={`Are you sure you want to delete <strong>${card.title}</strong>. <br/> All related contents will also be removed!`}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Card;
