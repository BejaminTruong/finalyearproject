import React, { useEffect, useRef, useState } from "react";
import "./Activity.scss";
import { MdOutlineChat } from "react-icons/md";
import { CloseButton, Form } from "react-bootstrap";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "features/userSlice";
import { updateCard } from "actions/boardAction";

const Activity = ({ card }) => {
  const userAccount = useSelector(selectUser);
  const inputRef = useRef();

  const [cardCommentList, setCardCommentList] = useState([]);

  const [cardComment, setCardComment] = useState("");
  const [addCommentToggle, setAddCommentToggle] = useState(false);
  const handleCardCommentChange = (e) => setCardComment(e.target.value);

  const [editCommentToggle, setEditCommentToggle] = useState({});
  const [editCommentChange, setEditCommentChange] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    if (addCommentToggle) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [addCommentToggle]);

  useEffect(() => {
    setCardCommentList(card.comments);
  }, [card.comments]);

  useEffect(() => {
    cardCommentList.forEach((comment, index) => {
      setEditCommentChange((prev) => ({ ...prev, [index]: comment.text }));
    });
  }, [cardCommentList]);

  const handleAddComment = async () => {
    if (cardComment !== "") {
      const clonedCard = _.cloneDeep(card);
      clonedCard.comments.push({
        userId: userAccount.userInfo._id,
        username: userAccount.userInfo.name,
        text: cardComment,
        date: Date.now(),
      });
      updateCard(clonedCard, dispatch);
    }
    setCardComment("");
  };

  const handleEditComment = async (index, oldComment) => {
    if (
      editCommentChange[index] === oldComment ||
      editCommentChange[index] === ""
    ) {
      return;
    }
    const clonedCard = _.cloneDeep(card);
    clonedCard.comments.forEach((c, i) => {
      if (i === index) c.text = editCommentChange[index];
    });
    updateCard(clonedCard, dispatch);
    setEditCommentToggle({ [index]: false });
  };

  const handleDeleteComment = async (index) => {
    const clonedCard = _.cloneDeep(card);
    clonedCard.comments.splice(index, 1);
    updateCard(clonedCard, dispatch);
    setEditCommentToggle({ [index]: false });
  };

  return (
    <div className="activity">
      <div className="activity-head">
        <MdOutlineChat className="card-icon" />
        <p>Activity</p>
      </div>
      <div className="activity-content">
        <div className="activity-input">
          <div className="userbox">P</div>
          {addCommentToggle ? (
            <div className="activity-input-show">
              <Form.Control
                ref={inputRef}
                className="form-input"
                size="sm"
                type="text"
                value={cardComment}
                onChange={handleCardCommentChange}
                onBlur={() => setAddCommentToggle(false)}
                placeholder="Write a comment..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddComment();
                    e.preventDefault();
                    e.target.blur();
                  }
                }}
                onMouseDown={(e) => e.preventDefault()}
                spellCheck="false"
              />
              <button onMouseDown={handleAddComment}>Save</button>
            </div>
          ) : (
            <Form.Control
              size="sm"
              type="text"
              onClick={() => setAddCommentToggle(true)}
              placeholder="Write a comment..."
            />
          )}
        </div>
        {cardCommentList.map((comment, index) => (
          <div
            key={index}
            className="activity-comment"
            style={{
              marginBottom: `${
                comment.userId === userAccount.userInfo._id ? "unset" : "10px"
              }`,
            }}
          >
            <div className="userbox">{comment.username[0].toUpperCase()}</div>
            <div className="activity-comment-content">
              <p>
                {comment.username}{" "}
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "normal",
                    color: "gray",
                  }}
                >
                  <i>at {new Date(comment.date).toLocaleString()}</i>
                </span>
              </p>
              <Form.Control
                size="sm"
                as="textarea"
                rows={editCommentToggle[index] ? 3 : 1}
                style={{
                  pointerEvents: `${
                    editCommentToggle[index] ? "unset" : "none"
                  }`,
                }}
                value={editCommentChange[index]}
                onChange={(e) =>
                  setEditCommentChange({
                    ...editCommentChange,
                    [index]: e.target.value,
                  })
                }
              />
              {editCommentToggle[index] ? (
                <div className="activity-comment-content-actions">
                  <button
                    className="btn-save"
                    onClick={() => handleEditComment(index, comment.text)}
                  >
                    Save
                  </button>
                  <CloseButton
                    onClick={() => {
                      setEditCommentToggle({
                        ...editCommentToggle,
                        [index]: false,
                      });
                    }}
                  />
                </div>
              ) : (
                <>
                  {comment.userId === userAccount.userInfo._id && (
                    <div className="comment-actions">
                      <span
                        onClick={() => {
                          setEditCommentToggle({
                            ...editCommentToggle,
                            [index]: true,
                          });
                        }}
                      >
                        Edit
                      </span>
                      <span onClick={() => handleDeleteComment(index)}>
                        Delete
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activity;
