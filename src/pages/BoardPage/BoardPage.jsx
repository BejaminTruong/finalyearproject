import { createBoard, getBoards } from "actions/boardsActions";
import Loading from "components/Common/Loading/Loading";
import { selectBoards } from "features/boardsSlice";
import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./BoardPage.scss";
import { IoTrash } from "react-icons/io5";

const BoardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const newBoardInputRef = useRef(null);

  const { pending, boardsData } = useSelector(selectBoards);

  const [openNewBoardForm, setOpenNewBoardForm] = useState(false);
  const toggleNewBoardForm = () => setOpenNewBoardForm(!openNewBoardForm);

  const [newBoardTitle, setNewBoardTitle] = useState("");
  const onNewBoardTitleChange = (e) => setNewBoardTitle(e.target.value);

  useEffect(() => {
    getBoards(dispatch);
  }, [dispatch]);

  useEffect(() => {
    newBoardInputRef?.current?.focus();
    newBoardInputRef?.current?.select();
  }, [openNewBoardForm]);

  const handleOpenBoard = (boardId) => {
    navigate(`/boards/${boardId}`);
  };

  const addNewBoard = async () => {
    if (!newBoardTitle) {
      newBoardInputRef.current.focus();
      return;
    }
    await createBoard({ title: newBoardTitle }, dispatch);
    setNewBoardTitle("");
    toggleNewBoardForm();
  };

  return (
    <div className="boards-container">
      <h1>My Boards</h1>
      <div className="boards-items">
        {pending && <Loading />}
        {!pending &&
          boardsData.length > 0 &&
          boardsData.map((b, index) => (
            <div
              key={index}
              className="item"
              onClick={() => handleOpenBoard(b._id)}
            >
              {b.title}
            </div>
          ))}

        {!openNewBoardForm && (
          <div className="item" onClick={toggleNewBoardForm}>
            Add new board
          </div>
        )}
        {openNewBoardForm && (
          <Row>
            <Col className="enter-new-board">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Enter board title..."
                className="input-enter-new-board"
                ref={newBoardInputRef}
                value={newBoardTitle}
                onChange={onNewBoardTitleChange}
                onKeyDown={(event) => event.key === "Enter" && addNewBoard()}
              />
              <Button variant="success" size="sm" onClick={addNewBoard}>
                Add board
              </Button>
              <IoTrash className="cancel-icon" onClick={toggleNewBoardForm} />
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default BoardPage;
