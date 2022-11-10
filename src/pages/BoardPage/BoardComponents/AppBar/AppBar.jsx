import { getBoards } from "actions/boardsActions";
import Loading from "components/Common/Loading/Loading";
import { selectBoard } from "features/boardSlice";
import { selectBoards } from "features/boardsSlice";
import { logout, selectUser } from "features/userSlice";
import React, { useEffect } from "react";
import {
  Dropdown,
  DropdownButton,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./AppBar.scss";

const AppBar = () => {
  const { userInfo } = useSelector(selectUser);
  const { pending, boardsData } = useSelector(selectBoards);
  const boardData = useSelector(selectBoard);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getBoards(dispatch);
  }, [dispatch, boardData]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleOpenBoard = (boardId) => {
    navigate(`/boards/${boardId}`);
  };

  return (
    <nav className="navbar-app">
      <div className="navbar-app-left">
        <div className="logo" onClick={() => navigate("/boards")}>
          <img src={require("assets/New Logo.png")} alt="new logo"/>
          <h1>RTQLO</h1>
        </div>
        <DropdownButton title="Your boards">
          {pending && <Loading />}
          {!pending &&
            boardsData.length > 0 &&
            boardsData.map((b, index) => (
              <Dropdown.Item key={index} onClick={() => handleOpenBoard(b._id)}>
                {b.title}
              </Dropdown.Item>
            ))}
        </DropdownButton>
      </div>
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        rootClose={true}
        overlay={
          <Popover>
            <Popover.Body>
              <p onClick={handleLogout}>Logout!</p>
              <hr />
              <p onClick={() => navigate("/boards/profile")}>Profile</p>
            </Popover.Body>
          </Popover>
        }
      >
        <div className="userbox">{userInfo?.name[0].toUpperCase()}</div>
      </OverlayTrigger>
    </nav>
  );
};

export default AppBar;
