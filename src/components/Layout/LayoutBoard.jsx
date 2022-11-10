import React, { useEffect } from "react";
import AppBar from "pages/BoardPage/BoardComponents/AppBar/AppBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "features/userSlice";
import Loading from "components/Common/Loading/Loading";

export const loader = async () => {
  // if (!localStorage.getItem("token")) return redirect("/login");
};

const LayoutBoard = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.isAuthenticated && !user.pending) navigate("/login");
  }, [user]);

  if (user.isAuthenticated && !user.pending)
    return (
      <div className="trelloContainer">
        <AppBar />
        <Outlet />
      </div>
    );
  else return <Loading />;
};

export default LayoutBoard;
