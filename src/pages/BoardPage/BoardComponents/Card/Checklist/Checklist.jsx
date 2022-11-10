import React, { useEffect, useRef, useState } from "react";
import "./Checklist.scss";
import { MdOutlineDeleteForever } from "react-icons/md";
import { RiCheckboxMultipleLine } from "react-icons/ri";
import { CloseButton, Form, ProgressBar } from "react-bootstrap";
import {
  saveContentAfterPressEnter,
  selectAllInlineText,
} from "utilities/contentEditable";
import _ from "lodash";
import { updateCard } from "actions/boardAction";

const Checklist = ({ card, dispatch }) => {
  const checklistInputRef = useRef();
  const checkItemInputRef = useRef();

  const [cardCheckList, setCardCheckList] = useState([]);

  const [checklistTitleToggle, setChecklistTitleToggle] = useState({});
  const [checklistTitleChange, setChecklistTitleChange] = useState({});

  const [checklistItemToggle, setChecklistItemToggle] = useState({});
  const [checklistItemChange, setChecklistItemChange] = useState({});

  const [checklistItemAddToggle, setChecklistItemAddToggle] = useState({});
  const [checklistItemAddChange, setChecklistItemAddChange] = useState({});

  const [checklistItemChecked, setChecklistItemChecked] = useState({});

  const [indexValues, setIndexValues] = useState({});

  const [hideChecked, setHideChecked] = useState({});

  useEffect(() => {
    if (checklistInputRef.current) {
      checklistInputRef.current.focus();
      checklistInputRef.current.select();
    }
  }, [checklistTitleToggle]);

  useEffect(() => {
    if (checkItemInputRef.current) {
      checkItemInputRef.current.focus();
      checkItemInputRef.current.select();
    }
  }, [checklistItemToggle]);

  useEffect(() => {
    setCardCheckList(card.checklist);
  }, [card.checklist]);

  useEffect(() => {
    cardCheckList.forEach((checklist, cIndex) => {
      setChecklistTitleChange((prev) => ({
        ...prev,
        [cIndex]: checklist.title,
      }));
      checklist.items.forEach((item, index) => {
        setChecklistItemChange((prev) => ({
          ...prev,
          [`${cIndex} - ${index}`]: item.text,
        }));
        setChecklistItemChecked((prev) => ({
          ...prev,
          [`${cIndex} - ${index}`]: item.completed,
        }));
      });
    });
  }, [cardCheckList]);

  useEffect(() => {
    if (!_.isEmpty(indexValues))
      handleEditCheckListItem(
        indexValues.checklistIndex,
        indexValues.itemIndex,
        true
      );
  }, [indexValues]);

  const handleSaveCheckListTitle = async (cIndex) => {
    const clonedCard = _.cloneDeep(card);
    clonedCard.checklist.forEach((c, index) => {
      if (index === cIndex) c.title = checklistTitleChange[cIndex];
    });
    updateCard(clonedCard, dispatch);
    setChecklistTitleToggle({ [cIndex]: false });
  };

  const handleAddCheckListItem = async (index) => {
    const clonedCard = _.cloneDeep(card);
    clonedCard.checklist.forEach((c, cIndex) => {
      if (cIndex === index)
        c.items.push({ text: checklistItemAddChange[index], completed: false });
    });
    updateCard(clonedCard, dispatch);
    setChecklistItemAddChange({ [index]: "" });
    setChecklistItemAddToggle({ [index]: false });
  };

  const handleEditCheckListItem = async (cIndex, iIndex, condition) => {
    const clonedCard = _.cloneDeep(card);
    if (condition) {
      clonedCard.checklist.forEach((c, firstIndex) => {
        if (firstIndex === cIndex)
          c.items.forEach((i, secondIndex) => {
            if (secondIndex === iIndex) {
              i.text = checklistItemChange[`${cIndex} - ${iIndex}`];
              i.completed = checklistItemChecked[`${cIndex} - ${iIndex}`];
            }
          });
      });
    } else {
      clonedCard.checklist.forEach((c, firstIndex) => {
        if (firstIndex === cIndex) c.items.splice(iIndex, 1);
      });
    }
    updateCard(clonedCard, dispatch);
    setChecklistItemToggle({ [`${cIndex} - ${iIndex}`]: false });
  };

  const handleDeleteChecklist = async (cIndex) => {
    const clonedCard = _.cloneDeep(card);
    clonedCard.checklist.splice(cIndex, 1);
    updateCard(clonedCard, dispatch);
  };

  const percentage = (cIndex) => {
    const clonedCard = _.cloneDeep(card);
    let result = 0;
    clonedCard.checklist.forEach((c, index) => {
      if (cIndex === index) {
        if (c.items.length > 0) {
          const completed = c.items.filter((i) => i.completed);
          result = Math.round(
            100 - ((c.items.length - completed.length) / c.items.length) * 100
          );
        }
      }
    });
    return result;
  };

  return (
    <>
      {cardCheckList.map((c, cIndex) => (
        <div key={cIndex} className="checklist">
          <div className="checklist-head">
            <RiCheckboxMultipleLine className="card-icon" />
            {checklistTitleToggle[cIndex] ? (
              <div className="checklist-head-input">
                <Form.Control
                  type="text"
                  className="trello-content-editable"
                  value={checklistTitleChange[cIndex]}
                  onBlur={() => handleSaveCheckListTitle(cIndex)}
                  onChange={(e) =>
                    setChecklistTitleChange({
                      ...checklistTitleChange,
                      [cIndex]: e.target.value,
                    })
                  }
                  onKeyDown={saveContentAfterPressEnter}
                  onMouseDown={(e) => e.preventDefault()}
                  spellCheck="false"
                  ref={checklistInputRef}
                />
                <div className="checklist-head-input-actions">
                  <button
                    className="btn-save"
                    onMouseDown={() => handleSaveCheckListTitle(cIndex)}
                  >
                    Save
                  </button>
                  <CloseButton
                    onClick={() => {
                      setChecklistTitleToggle({
                        ...checklistTitleToggle,
                        [cIndex]: false,
                      });
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="checklist-head-content">
                <p
                  onClick={() => {
                    setChecklistTitleToggle({
                      ...checklistTitleToggle,
                      [cIndex]: true,
                    });
                  }}
                >
                  {c.title}
                </p>
                <div className="checklist-head-content-btn"
                style={{
                  width: `${c.items.length < 1 ? "unset" : "50%"}`
                }}>
                  {c.items.length < 1 ? null : (
                    <button
                      onClick={() =>
                        setHideChecked((prev) => ({
                          ...prev,
                          [cIndex]: !prev[cIndex],
                        }))
                      }
                    >
                      {hideChecked[cIndex] ? "Show checkeds" : "Hide checkeds"}
                    </button>
                  )}
                  <button onClick={() => handleDeleteChecklist(cIndex)}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="checklist-progress">
            <span>{percentage(cIndex)}%</span>
            <ProgressBar
              className="checklist-progress-bar"
              now={percentage(cIndex)}
              label={`${percentage(cIndex)}%`}
            />
          </div>
          {c.items.length < 1
            ? null
            : c.items.map((i, iIndex) => {
                if (hideChecked[cIndex] && i.completed) return null;
                return (
                  <div key={iIndex} className="checklist-item">
                    <Form.Check
                      className="checklist-item-checked"
                      checked={
                        checklistItemChecked[`${cIndex} - ${iIndex}`] || false
                      }
                      onChange={(e) => {
                        setChecklistItemChecked({
                          ...checklistItemChecked,
                          [`${cIndex} - ${iIndex}`]: e.target.checked,
                        });
                        setIndexValues({
                          checklistIndex: cIndex,
                          itemIndex: iIndex,
                        });
                      }}
                    />
                    {checklistItemToggle[`${cIndex} - ${iIndex}`] ? (
                      <div className="checklist-item-input">
                        <Form.Control
                          as="textarea"
                          rows={2}
                          className="trello-content-editable"
                          value={checklistItemChange[`${cIndex} - ${iIndex}`]}
                          onChange={(e) =>
                            setChecklistItemChange({
                              ...checklistItemChange,
                              [`${cIndex} - ${iIndex}`]: e.target.value,
                            })
                          }
                          onKeyDown={saveContentAfterPressEnter}
                          onMouseDown={(e) => e.preventDefault()}
                          spellCheck="false"
                          ref={checkItemInputRef}
                        />
                        <div className="checklist-item-input-actions">
                          <button
                            className="btn-save"
                            onClick={() =>
                              handleEditCheckListItem(cIndex, iIndex, true)
                            }
                          >
                            Save
                          </button>
                          <CloseButton
                            onClick={() => {
                              setChecklistItemToggle({
                                ...checklistItemToggle,
                                [`${cIndex} - ${iIndex}`]: false,
                              });
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="checklist-item-content">
                        <span
                          onClick={() => {
                            setChecklistItemToggle({
                              ...checklistItemToggle,
                              [`${cIndex} - ${iIndex}`]: true,
                            });
                          }}
                        >
                          {i.text}
                        </span>
                        <MdOutlineDeleteForever
                          className="card-icon"
                          onClick={() =>
                            handleEditCheckListItem(cIndex, iIndex, false)
                          }
                        />
                      </div>
                    )}
                  </div>
                );
              })}

          {checklistItemAddToggle[cIndex] ? (
            <div className="checklist-item-add-input">
              <Form.Control
                as="textarea"
                rows={3}
                className="trello-content-editable"
                value={checklistItemAddChange[cIndex]}
                onChange={(e) =>
                  setChecklistItemAddChange({
                    ...checklistItemAddChange,
                    [cIndex]: e.target.value,
                  })
                }
                onKeyDown={saveContentAfterPressEnter}
                onClick={(e) => selectAllInlineText(e)}
                onMouseDown={(e) => e.preventDefault()}
                spellCheck="false"
                placeholder="Checkitem"
              />
              <div className="checklist-item-add-input-actions">
                <button
                  className="btn-save"
                  onClick={() => handleAddCheckListItem(cIndex)}
                >
                  Save
                </button>
                <CloseButton
                  onClick={() =>
                    setChecklistItemAddToggle({
                      ...checklistItemAddToggle,
                      [cIndex]: false,
                    })
                  }
                />
              </div>
            </div>
          ) : (
            <button
              className="checklist-item-add-btn"
              onClick={() =>
                setChecklistItemAddToggle({
                  ...checklistItemAddToggle,
                  [cIndex]: true,
                })
              }
            >
              Add an item
            </button>
          )}
        </div>
      ))}
    </>
  );
};

export default Checklist;
