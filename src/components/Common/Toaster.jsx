import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { closeAlert, selectAlert } from "features/alertSlice";
import { Toast, ToastContainer } from "react-bootstrap";

const Toaster = () => {
  const { show, message, variant, delay, nextRoute } = useSelector(selectAlert);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = () => {
    dispatch(closeAlert());
    try {
      navigate(nextRoute);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ToastContainer position="bottom-center">
      <Toast bg={variant} onClose={handleClose} show={show} delay={delay} autohide>
        <Toast.Header>
          <img src={require("assets/New Logo.png")} style={{width: "20px"}} alt="new-logo" />
          <strong className="me-auto">RTQLO</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default Toaster;
