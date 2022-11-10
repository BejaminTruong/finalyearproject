import React from "react";
import "./Loading.scss";

const Loading = () => {
  return (
    <div className="loading">
      <img src={require("assets/loading.gif")} width={100}/>
    </div>
  );
};

export default Loading;
