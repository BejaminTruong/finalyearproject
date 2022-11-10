import React, { useEffect } from "react";
import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouterProvider,
} from "react-router-dom";
import "./App.scss";
import BoardContent from "pages/BoardPage/BoardComponents/BoardContent/BoardContent";
import ErrorPage from "components/Error/ErrorPage";
import Login from "pages/Auth/Login/Login";
import Register from "pages/Auth/Register/Register";
import LayoutBoard from "components/Layout/LayoutBoard";
import Welcome from "pages/WelcomePage/Welcome";
import LayoutAll from "components/Layout/LayoutAll";
import { loader as layoutBoardLoader } from "./components/Layout/LayoutBoard";
import { loadUser } from "actions/userActions";
import { store } from "app/store";
import UserProfile from "pages/UserProfile/UserProfile";
import BoardPage from "pages/BoardPage/BoardPage";
import { loader as boardContentLoader } from "pages/BoardPage/BoardComponents/BoardContent/BoardContent";

const router = createBrowserRouter([
  {
    element: <LayoutAll />,
    children: [
      {
        path: "boards",
        element: <LayoutBoard />,
        errorElement: <ErrorPage />,
        loader: layoutBoardLoader,
        children: [
          { index: true, element: <BoardPage /> },
          {
            path: "/boards/profile",
            element: <UserProfile />,
          },
          {
            path: "/boards/:id",
            element: <BoardContent />,
            loader: boardContentLoader,
          },
        ],
      },
      {
        element: <Outlet />,
        loader: () => {
          if (localStorage.getItem("token")) return redirect("/boards");
        },
        children: [
          {
            path: "",
            element: <Welcome />,
          },
          {
            path: "register",
            element: <Register />,
          },
          {
            path: "login",
            element: <Login />,
          },
        ],
      },
    ],
  },
]);

function App() {
  useEffect(() => {
    loadUser(store.dispatch);
  }, []);
  return <RouterProvider router={router} />;
}

export default App;
