import React, { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import "./DatePopover.scss";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Form } from "react-bootstrap";
import { format } from "date-fns";
import _ from "lodash";
import { updateCard } from "actions/boardAction";
import { openAlert } from "features/alertSlice";

const DatePopover = ({ card, dispatch, setBasePopoverFlag }) => {
  const [dateRange, setDateRange] = useState([
    {
      startDate:
        card.date !== null
          ? card.date.startDate !== null
            ? new Date(card.date.startDate)
            : card.date.dueDate !== null
            ? new Date(card.date.dueDate)
            : new Date()
          : new Date(),
      endDate:
        card.date !== null
          ? card.date.dueDate !== null
            ? new Date(card.date.dueDate)
            : card.date.startDate !== null
            ? new Date(card.date.startDate)
            : new Date()
          : new Date(),
      key: "selection",
    },
  ]);

  const [enableStartDate, setEnableStartDate] = useState(
    card.date !== null
      ? card.date.startDate !== null
        ? card.date.startDate
        : false
      : false
  );
  const [enableDueDate, setEnableDueDate] = useState(
    card.date !== null
      ? card.date.dueDate !== null
        ? card.date.dueDate
        : false
      : false
  );

  const [inputStartDate, setInputStartDate] = useState(
    card.date !== null
      ? card.date.startDate != null
        ? card.date.startDate
        : format(new Date(dateRange[0].startDate), "yyyy-MM-dd")
      : format(new Date(dateRange[0].startDate), "yyyy-MM-dd")
  );
  const [inputDueDate, setInputDueDate] = useState(
    card.date !== null
      ? card.date.dueDate != null
        ? card.date.dueDate
        : format(new Date(dateRange[0].endDate), "yyyy-MM-dd")
      : format(new Date(dateRange[0].endDate), "yyyy-MM-dd")
  );

  const [focusStart, setFocusStart] = useState(false);
  const [focusDue, setFocusDue] = useState(false);
  const [time, setTime] = useState(
    card.date !== null
      ? card.date.dueDate
        ? card.date.dueTime
        : format(new Date(), "HH:mm")
      : format(new Date(), "HH:mm")
  );

  useEffect(() => {
    setInputStartDate(format(new Date(dateRange[0].startDate), "yyyy-MM-dd"));
    setInputDueDate(format(new Date(dateRange[0].endDate), "yyyy-MM-dd"));
  }, [dateRange]);

  const handleAddDate = async () => {
    let clonedCard = _.cloneDeep(card);
    clonedCard.date = {
      startDate: enableStartDate ? inputStartDate : null,
      dueDate: enableDueDate ? inputDueDate : null,
      dueTime: enableDueDate ? time : null,
      completed: false,
    };
    updateCard(clonedCard, dispatch);
    setBasePopoverFlag(false);
  };

  const handleRemoveDate = async () => {
    let clonedCard = _.cloneDeep(card);
    clonedCard.date = null;
    updateCard(clonedCard, dispatch);
    setBasePopoverFlag(false);
  };

  const handleBlur = () => {
    const date1 = new Date(inputStartDate);
    const date2 = new Date(inputDueDate);
    if (date1 > date2) {
      dispatch(
        openAlert({
          message: "Due date cannot be smaller then start date!",
          variant: "danger",
        })
      );
      setInputStartDate(format(new Date(dateRange[0].startDate), "yyyy-MM-dd"));
      setInputDueDate(format(new Date(dateRange[0].endDate), "yyyy-MM-dd"));
      return;
    }
    setDateRange([
      {
        startDate: date1,
        endDate: date2,
        key: "selection",
      },
    ]);
  };

  return (
    <div className="popover-datepicker">
      <DateRange
        editableDateInputs={false}
        onChange={(item) => {
          enableStartDate && enableDueDate
            ? setDateRange([item.selection])
            : dateRange[0].startDate !== item.selection.startDate
            ? setDateRange([
                {
                  startDate: item.selection.startDate,
                  endDate: item.selection.startDate,
                  key: "selection",
                },
              ])
            : setDateRange([
                {
                  startDate: item.selection.endDate,
                  endDate: item.selection.endDate,
                  key: "selection",
                },
              ]);
        }}
        moveRangeOnFirstSelection={false}
        ranges={dateRange}
        format={"dd/MM/yyyy"}
        showPreview={enableStartDate && enableDueDate ? true : false}
      />
      <div className="popover-datepicker-content">
        <div className="action-date">
          <div className="action-date-input">
            <p>Start Date</p>
            <div className="input-group">
              <Form.Check
                checked={enableStartDate}
                onChange={() =>
                  setEnableStartDate((prev) => {
                    setFocusStart(!prev);
                    if (enableDueDate) setFocusDue(prev);
                    if (prev) {
                      setDateRange([
                        {
                          startDate: new Date(inputDueDate),
                          endDate: new Date(inputDueDate),
                          key: "selection",
                        },
                      ]);
                    }
                    return !prev;
                  })
                }
              />
              <Form.Control
                size="sm"
                type={enableStartDate ? "date" : "text"}
                placeholder="dd/MM/yyyy"
                onClick={() => {
                  setFocusStart(true);
                  setFocusDue(false);
                }}
                focus={focusStart.toString()}
                readOnly={!enableStartDate}
                value={enableStartDate ? inputStartDate : ""}
                onChange={(e) => {
                  setInputStartDate(e.target.value);
                }}
                onBlur={handleBlur}
                onFocus={() => {
                  setFocusStart(true);
                  setFocusDue(false);
                }}
              />
            </div>
          </div>
          <div className="action-date-input">
            <p>Due Date</p>
            <div className="input-group">
              <Form.Check
                checked={enableDueDate}
                onChange={() =>
                  setEnableDueDate((prev) => {
                    setFocusDue(!prev);
                    if (enableStartDate) setFocusStart(prev);
                    if (prev) {
                      setDateRange([
                        {
                          startDate: new Date(inputStartDate),
                          endDate: new Date(inputStartDate),
                          key: "selection",
                        },
                      ]);
                    }
                    return !prev;
                  })
                }
              />
              <Form.Control
                size="sm"
                type={enableDueDate ? "date" : "text"}
                placeholder="dd/MM/yyyy"
                onClick={() => {
                  setFocusStart(false);
                  setFocusDue(true);
                }}
                focus={focusDue.toString()}
                readOnly={!enableDueDate}
                value={enableDueDate ? inputDueDate : ""}
                onChange={(e) => {
                  setInputDueDate(e.target.value);
                }}
                onBlur={handleBlur}
                onFocus={() => {
                  setFocusStart(false);
                  setFocusDue(true);
                }}
              />
              <Form.Control
                size="sm"
                type={enableDueDate ? "time" : "text"}
                placeholder="HH:mm"
                onClick={() => {
                  setFocusStart(false);
                  setFocusDue(true);
                }}
                focus={focusDue.toString()}
                onFocus={() => {
                  setFocusStart(false);
                  setFocusDue(true);
                }}
                readOnly={!enableDueDate}
                value={enableDueDate ? time : ""}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="action-btn">
          <button className="btn-add-new-date" onMouseDown={handleAddDate}>
            Save
          </button>
          <button className="btn-remove-date" onMouseDown={handleRemoveDate}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePopover;
