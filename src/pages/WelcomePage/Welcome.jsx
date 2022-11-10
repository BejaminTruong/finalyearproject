import React from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.scss";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="navbar">
        <div className="navbar-logo" onClick={() => navigate("/")}>
          <img src={require("assets/New Logo.png")} alt="new logo" />
          <h1>RTQLO</h1>
        </div>
        <div className="navbar-button">
          <button onClick={() => navigate("/login")}>Log in</button>
          <button onClick={() => navigate("/register")}>Sign up</button>
        </div>
      </div>
      <div className="content">
        <div className="content-left">
          <h1>RTQLO helps teams move work forward.</h1>
          <p>
            Collaborate, manage projects, and reach new productivity peaks. From
            high rises to the home office, the way your team works is
            unique—accomplish it all with RTQLO.
          </p>
          <button onClick={() => navigate("/register")}>
            Sign up, It's free
          </button>
        </div>
        <div className="content-right">
          <img
            src="https://images.ctfassets.net/rz1oowkt5gyp/5QIzYxue6b7raOnVFtMyQs/113acb8633ee8f0c9cb305d3a228823c/hero.png?w=1200&fm=webp"
            alt="random"
          />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
