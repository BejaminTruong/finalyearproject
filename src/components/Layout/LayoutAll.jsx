import Toaster from "components/Common/Toaster";
import React from "react";
import { Outlet } from "react-router-dom";

const LayoutAll = () => {

  return (
    <>
      <div
        style={{ width: "500px", position: "absolute", bottom: "10%", left: "37%" }}
      >
        <Toaster />
      </div>
      <Outlet />
    </>
  );
};

export default LayoutAll;
