import React, { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Draggable } from "react-smooth-dnd";
import "./BoardContent.scss";
import _ from "lodash";
import { applyDrag } from "utilities/dragDrop";
import { BsPlusLg } from "react-icons/bs";
import { IoTrash } from "react-icons/io5";
import Column from "../Column/Column";
import BoardBar from "pages/BoardPage/BoardComponents/BoardBar/BoardBar";
import {
  Container as BootstrapContainer,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import Loading from "components/Common/Loading/Loading";
import { selectBoard, updateColumnData, updateData } from "features/boardSlice";
import {
  createColumn,
  getOneBoard,
  boardUpdate,
  updateColumn,
  updateCard,
} from "actions/boardAction";

export const loader = async ({ params }) => {
  return params.id;
};

const BoardContent = () => {
  const dispatch = useDispatch();
  const boardParams = useLoaderData();

  const boardData = useSelector(selectBoard);

  const newColumnInputRef = useRef(null);

  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const toggleNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm);

  const [newColumnTitle, setNewColumnTitle] = useState("");
  const onNewColumnTitleChange = (e) => setNewColumnTitle(e.target.value);

  useEffect(() => {
    getOneBoard(boardParams, dispatch);
  }, [dispatch, boardParams]);

  useEffect(() => {
    newColumnInputRef?.current?.focus();
    newColumnInputRef?.current?.select();
  }, [openNewColumnForm]);

  const onColumnDrop = (dropResult) => {
    let newColumns = _.cloneDeep(boardData.columns);
    newColumns = applyDrag(newColumns, dropResult);

    let newBoard = _.cloneDeep(boardData);
    newBoard.columnOrder = newColumns.map((c) => c._id);
    newBoard.columns = newColumns;

    dispatch(updateData(newBoard));
    boardUpdate(newBoard, dispatch);
  };

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.addedIndex !== null || dropResult.removedIndex !== null) {
      let newColumns = _.cloneDeep(boardData.columns);

      let currentColumn = newColumns.find((c) => c._id === columnId);
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
      currentColumn.cardOrder = currentColumn.cards.map((i) => i._id);

      if (dropResult.addedIndex !== null && dropResult.removedIndex !== null) {
        updateColumn(currentColumn, dispatch);
      } else {
        updateColumn(currentColumn, dispatch);
        
        if (dropResult.addedIndex !== null) {
          let currentCard = _.cloneDeep(dropResult.payload);
          currentCard.columnId = currentColumn._id;
          updateCard(currentCard, dispatch);
        }
      }
    }
  };

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus();
      return;
    }

    const newColumnToAdd = {
      boardId: boardData._id,
      title: newColumnTitle.trim(),
    };

    createColumn(newColumnToAdd, dispatch);
    setNewColumnTitle("");
    toggleNewColumnForm();
  };

  if (!boardData._id && !boardData.pending) {
    return <div className="not-found">Board not found!</div>;
  }

  return (
    <>
      {boardData.pending ? (
        <Loading />
      ) : (
        <>
          <BoardBar boardData={boardData} dispatch={dispatch} />
          <div className="board-content">
            <Container
              orientation="horizontal"
              onDrop={onColumnDrop}
              getChildPayload={(index) => boardData.columns[index]}
              dragHandleSelector=".column-drag-handle"
              dropPlaceholder={{
                animationDuration: 150,
                showOnTop: true,
                className: "column-drop-preview",
              }}
            >
              {boardData.columns.map((column, index) => (
                <Draggable key={index}>
                  <Column column={column} onCardDrop={onCardDrop} />
                </Draggable>
              ))}
            </Container>
            <BootstrapContainer className="bootstrap-trello-container">
              {!openNewColumnForm && (
                <Row>
                  <Col className="add-new-column" onClick={toggleNewColumnForm}>
                    <BsPlusLg className="icon" />
                    Add another column
                  </Col>
                </Row>
              )}
              {openNewColumnForm && (
                <Row>
                  <Col className="enter-new-column">
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="Enter column title..."
                      className="input-enter-new-column"
                      ref={newColumnInputRef}
                      value={newColumnTitle}
                      onChange={onNewColumnTitleChange}
                      onKeyDown={(event) =>
                        event.key === "Enter" && addNewColumn()
                      }
                    />
                    <Button variant="success" size="sm" onClick={addNewColumn}>
                      Add column
                    </Button>
                    <IoTrash
                      className="cancel-icon"
                      onClick={toggleNewColumnForm}
                    />
                  </Col>
                </Row>
              )}
            </BootstrapContainer>
          </div>
        </>
      )}
    </>
  );
};

export default BoardContent;
