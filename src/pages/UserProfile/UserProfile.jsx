import { updateUser } from "actions/userActions";
import Loading from "components/Common/Loading/Loading";
import { selectUser } from "features/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./UserProfile.scss";

const UserProfile = () => {
  const { pending, userInfo } = useSelector(selectUser);
  const dispatch = useDispatch();

  const [userEdit, setUserEdit] = useState({
    email: "",
    name: "",
  });

  useEffect(() => {
    if (userInfo) setUserEdit({ email: userInfo.email, name: userInfo.name });
  }, [userInfo]);

  const handleOnchange = (e) => {
    let { name, value } = e.target;
    let newValue = { ...userEdit, [name]: value };
    setUserEdit(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateUser({ id: userInfo._id, data: userEdit }, dispatch);
  };

  return (
    <>
      {pending ? (
        <Loading />
      ) : (
        <div className="form-container">
          <form>
            <h1>User Information</h1>
            <div className="form-input">
              <input type="email" required value={userEdit.email} disabled />
              <input
                type="text"
                placeholder="Enter new name"
                required
                name="name"
                value={userEdit.name}
                onChange={handleOnchange}
              />
              <input
                type="password"
                placeholder="Enter new password"
                required
                name="password"
                onChange={handleOnchange}
              />
            </div>
            <div className="form-button">
              <button onClick={handleSubmit}>Submit</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default UserProfile;
