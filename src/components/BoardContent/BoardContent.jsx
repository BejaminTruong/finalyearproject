import React, { useEffect, useRef, useState } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import Column from "components/Column/Column";
import { mapOrder } from "utilities/sorts";
import { applyDrag } from "utilities/dragDrop";
import "./BoardContent.scss";
import { initialData } from "actions/initialData";
import _ from "lodash";
import { BsPlusLg } from "react-icons/bs";
import { IoTrash } from "react-icons/io5";
import {
  Container as BootstrapContainer,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
const BoardContent = () => {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const newColumnInputRef = useRef(null);

  useEffect(() => {
    const boardFromDB = initialData.boards.find(
      (board) => board.id === "board-1"
    );
    if (boardFromDB) {
      setBoard(boardFromDB);

      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, "id"));
    }
  }, []);

  useEffect(() => {
    newColumnInputRef?.current?.focus();
    newColumnInputRef?.current?.select();
  }, [openNewColumnForm]);

  if (_.isEmpty(board)) {
    return <div className="not-found">Board not found!</div>;
  }

  const onColumnDrop = (dropResult) => {
    let newColumns = [...columns];
    newColumns = applyDrag(newColumns, dropResult);

    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c.id);
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);
  };

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.addedIndex !== null || dropResult.removedIndex !== null) {
      let newColumns = [...columns];
      let currentColumn = newColumns.find((c) => c.id === columnId);
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
      currentColumn.cardOrder = currentColumn.cards.map((i) => i.id);
      setColumns(newColumns);
    }
  };

  const toggleNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm);

  const onNewColumnTitleChange = (e) => {
    setNewColumnTitle(e.target.value);
  };

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus();
      return;
    }

    const newColumnToAdd = {
      id: Math.random().toString(36).substr(2, 5), //5 random characters, will remove when implement api
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: [],
    };

    let newColumns = [...columns];
    newColumns.push(newColumnToAdd);

    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c.id);
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);
    setNewColumnTitle("");
    toggleNewColumnForm();
  };

  const onUpdateColumn = (newColumnToUpdate) => {
    const columnIdToUpdate = newColumnToUpdate.id;
    let newColumns = [...columns];
    const columnIndexToUpdate = newColumns.findIndex(
      (i) => i.id === columnIdToUpdate
    );
    if (newColumnToUpdate._destroy) {
      newColumns.splice(columnIndexToUpdate, 1);
    } else {
      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate);
    }

    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c.id);
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);
  };

  return (
    <div className="board-content">
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        getChildPayload={(index) => columns[index]}
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: "column-drop-preview",
        }}
      >
        {columns.map((column, index) => (
          <Draggable key={index}>
            <Column
              column={column}
              onCardDrop={onCardDrop}
              onUpdateColumn={onUpdateColumn}
            />
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
                onKeyDown={(event) => event.key === "Enter" && addNewColumn()}
              />
              <Button variant="success" size="sm" onClick={addNewColumn}>
                Add column
              </Button>
              <IoTrash
                className="cancel-new-column"
                onClick={toggleNewColumnForm}
              />
            </Col>
          </Row>
        )}
      </BootstrapContainer>
    </div>
  );
};

export default BoardContent;
