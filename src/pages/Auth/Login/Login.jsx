import { login } from "actions/userActions";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Login.scss";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const handleOnchange = (e) => {
    let { name, value } = e.target;
    let newValue = { ...userInfo, [name]: value };
    setUserInfo(newValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(userInfo, dispatch);
  };

  return (
    <div className="login-container">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <img src={require("assets/New Logo.png")} alt="new logo"/>
        <h1>RTQLO</h1>
      </div>
      <div className="form-container">
        <form>
          <p>Log in to RTQLO</p>
          <div className="form-input">
            <input
              type="email"
              placeholder="Enter email"
              required
              name="email"
              onChange={handleOnchange}
            />
            <input
              type="password"
              placeholder="Enter password"
              required
              name="password"
              onChange={handleOnchange}
            />
          </div>
          <div className="form-button">
            <button onClick={handleSubmit}>Submit</button>
          </div>
          <hr />
          <p onClick={() => navigate("/register")}>Sign up for an account?</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
