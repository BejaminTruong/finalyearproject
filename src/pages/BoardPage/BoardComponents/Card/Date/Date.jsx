import { updateCard } from "actions/boardAction";
import { format } from "date-fns";
import _ from "lodash";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Form } from "react-bootstrap";
import BasePopover from "../Popovers/BasePopover";
import DatePopover from "../Popovers/DatePopover/DatePopover";
import "./Date.scss";

const DateComponent = ({
  card,
  dispatch,
  basePopoverFlag,
  setBasePopoverFlag,
}) => {
  const [datePopoverToggle, setDatePopoverToggle] = useState(false);
  const [dateChecked, setDateChecked] = useState(
    card.date !== null ? card.date.completed : false
  );

  useEffect(() => {
    if (card.date !== null) setDateChecked(card.date.completed);
  }, [card.date !== null ? card.date.completed : card]);

  useEffect(() => {
    if (card.date !== null) handleDateChecked();
  }, [dateChecked]);

  const handleDateChecked = async () => {
    const clonedCard = _.cloneDeep(card);
    clonedCard.date.completed = dateChecked;
    updateCard(clonedCard, dispatch);
  };

  return (
    <>
      {card.date !== null ? (
        <div className="date-container">
          <p>
            {card.date.startDate
              ? card.date.dueDate
                ? "Dates"
                : "Start date"
              : "Due date"}
          </p>
          <div className="date-content">
            {card.date.dueDate ? (
              <Form.Check
                className="date-content-checked"
                checked={dateChecked}
                onChange={() => setDateChecked(!dateChecked)}
              />
            ) : null}

            <div
              className="date-content-show"
              onClick={() => setDatePopoverToggle(true)}
            >
              {card.date.startDate !== null || card.date.dueDate !== null ? (
                <span>
                  {`${
                    card.date.startDate
                      ? format(new Date(card.date.startDate), "dd MMM,yyyy")
                      : ""
                  } ${
                    card.date.startDate ? (card.date.dueDate ? " - " : "") : ""
                  } ${
                    card.date.dueDate
                      ? format(new Date(card.date.dueDate), "dd MMM,yyyy")
                      : ""
                  } ${card.date.dueTime ? "at " + card.date.dueTime : ""}`}
                </span>
              ) : null}
              {card.date.completed ||
              Date.parse(card.date.dueDate) < Date.now() ? (
                card.date.completed ? (
                  <span className="date-status completed">completed</span>
                ) : Date.parse(card.date.dueDate) < Date.now() ? (
                  <span className="date-status overdue">overdue</span>
                ) : (
                  ""
                )
              ) : (
                ""
              )}
              <BasePopover
                title="Date"
                content={
                  <DatePopover
                    card={card}
                    dispatch={dispatch}
                    setBasePopoverFlag={setBasePopoverFlag}
                  />
                }
                popoverToggle={datePopoverToggle}
                setPopoverToggle={setDatePopoverToggle}
                basePopoverFlag={basePopoverFlag}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default DateComponent;
