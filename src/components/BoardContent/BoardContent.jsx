import React, { useEffect, useRef, useState } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import Column from "components/Column/Column";
import { mapOrder } from "utilities/sorts";
import { applyDrag } from "utilities/dragDrop";
import "./BoardContent.scss";
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
import {
  createNewColumn,
  fetchBoardDetails,
  updateBoard,
  updateCard,
  updateColumn,
} from "actions/ApiCall";
const BoardContent = () => {
  const newColumnInputRef = useRef(null);

  const [board, setBoard] = useState({});

  const [columns, setColumns] = useState([]);

  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const toggleNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm);

  const [newColumnTitle, setNewColumnTitle] = useState("");
  const onNewColumnTitleChange = (e) => setNewColumnTitle(e.target.value);

  useEffect(() => {
    const boardId = "6335928ea1ba8cf217c7942a";

    fetchBoardDetails(boardId).then((board) => {
      setBoard(board);
      setColumns(mapOrder(board.columns, board.columnOrder, "_id"));
    });
  }, []);

  useEffect(() => {
    newColumnInputRef?.current?.focus();
    newColumnInputRef?.current?.select();
  }, [openNewColumnForm]);

  const onColumnDrop = (dropResult) => {
    let newColumns = _.cloneDeep(columns);
    newColumns = applyDrag(newColumns, dropResult);

    let newBoard = _.cloneDeep(board);
    newBoard.columnOrder = newColumns.map((c) => c._id);
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);

    updateBoard(newBoard._id, newBoard).catch(() => {
      setColumns(columns);
      setBoard(board);
    });
  };

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.addedIndex !== null || dropResult.removedIndex !== null) {
      let newColumns = [...columns];
      
      let currentColumn = newColumns.find((c) => c._id === columnId);
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
      currentColumn.cardOrder = currentColumn.cards.map((i) => i._id);

      setColumns(newColumns);

      if (dropResult.addedIndex !== null && dropResult.removedIndex !== null) {
        updateColumn(currentColumn._id, currentColumn).catch(() =>
          setColumns(columns)
        );
      } else {
        updateColumn(currentColumn._id, currentColumn).catch(() =>
          setColumns(columns)
        );
        if (dropResult.addedIndex !== null) {
          let currentCard = _.cloneDeep(dropResult.payload);
          currentCard.columnId = currentColumn._id;
          updateCard(currentCard._id, currentCard)
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
      boardId: board._id,
      title: newColumnTitle.trim(),
    };

    createNewColumn(newColumnToAdd).then((column) => {
      let newColumns = _.cloneDeep(columns);
      newColumns.push(column);

      let newBoard = _.cloneDeep(board);
      newBoard.columnOrder = newColumns.map((c) => c._id);
      newBoard.columns = newColumns;

      setColumns(newColumns);
      setBoard(newBoard);
      setNewColumnTitle("");
      toggleNewColumnForm();
    });
  };

  const onUpdateColumnState = (newColumnToUpdate) => {
    const columnIdToUpdate = newColumnToUpdate._id;
    let newColumns = _.cloneDeep(columns);
    const columnIndexToUpdate = newColumns.findIndex(
      (i) => i._id === columnIdToUpdate
    );
    if (newColumnToUpdate._destroy) {
      newColumns.splice(columnIndexToUpdate, 1);
    } else {
      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate);
    }

    let newBoard = _.cloneDeep(board);
    newBoard.columnOrder = newColumns.map((c) => c._id);
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);
  };

  if (_.isEmpty(board)) {
    return <div className="not-found">Board not found!</div>;
  }

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
              onUpdateColumnState={onUpdateColumnState}
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
              <IoTrash className="cancel-icon" onClick={toggleNewColumnForm} />
            </Col>
          </Row>
        )}
      </BootstrapContainer>
    </div>
  );
};

export default BoardContent;
