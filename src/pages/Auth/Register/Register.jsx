import { register } from "actions/userActions";
import Loading from "components/Common/Loading/Loading";
import { selectUser } from "features/userSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Register.scss";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector(selectUser);

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    repeated_password: "",
  });

  const handleOnchange = (e) => {
    let { name, value } = e.target;
    let newValue = { ...userInfo, [name]: value };
    setUserInfo(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(userInfo, dispatch);
  };

  return (
    <>
      {userData.pending && <Loading />}
      <div className="register-container">
        <div className="navbar-logo" onClick={() => navigate("/")}>
          <img src={require("assets/New Logo.png")} alt="new logo" />
          <h1>RTQLO</h1>
        </div>
        <div className="form-container">
          <form>
            <p>Sign up for you account</p>
            <div className="form-input">
              <input
                type="text"
                placeholder="Enter name"
                required
                name="name"
                onChange={handleOnchange}
              />
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
              <input
                type="password"
                placeholder="Enter repeated password"
                required
                name="repeated_password"
                onChange={handleOnchange}
              />
            </div>
            <p className="form-terms">
              By signing up, you confirm that you've read and accepted our{" "}
              <span>Terms of Service</span> and <span>Privacy Policy</span>.
            </p>
            <div className="form-button">
              <button onClick={handleSubmit}>Submit</button>
            </div>
            <hr />
            <p onClick={() => navigate("/login")}>
              Already have an account? Log In
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
