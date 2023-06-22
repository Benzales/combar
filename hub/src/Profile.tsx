import React, { useState, useEffect, useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { User } from "./types";
import { UserContext } from "./App";
import getAccessToken from "./utils/auth";
import apiRequest from "./utils/apiRequests";
import Modal from "./Modal"

const Register: React.FC = () => {
  const { user, setUser } = useContext(UserContext);
  const [newUser, setNewUser] = useState<User | null>(null);
  const [ModalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    apiRequest("api/users", "GET")
      .then(data => setUser(data));
  }, []);

  useEffect(() => {
    setNewUser(user);
  }, [user]);

  const handleLogin = (googleToken: any) => {
    if (googleToken) {
      fetch("http://localhost:5000/api/users/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: googleToken.credential,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem('accessToken', data.token);
          localStorage.setItem('refreshToken', data.refreshToken);
          setUser(data);
        })
        .catch(console.error);
    }
  };

  const googleLoginButton = (
    <GoogleLogin
      data-testid="custom-google-login"
      shape="pill"
      size="large"
      onSuccess={handleLogin}
      onError={() => console.log("Google Login failed")}
    />
  );

  const inputFields = [
    { label: "Name", value: newUser?.name, key: "name" },
    { label: "Email", value: newUser?.email, key: "email" },
    { label: "Bio", value: newUser?.bio, key: "bio" },
    { label: "Username", value: newUser?.username || "", key: "username" },
  ];

  const changeUserInfo = () => {
    if (newUser) {
      apiRequest("api/users", "PUT", newUser)
        .then(() => setUser(newUser))
        .catch(console.error);
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setNewUser(null);
  }


  return (
    <div
      style={{
        border: "1px solid black",
        padding: "20px",
        position: "fixed",
        top: "60%",
        marginTop: "50px",
        right: "40px",
        transform: "translateY(-50%)",
        width: "300px",
        height: "700px",
      }}
    >
      {newUser ? (
        <>
          {inputFields.map((field) => (
            <div key={field.key} style={{ marginBottom: "10px" }}>
              <label style={{ marginBottom: "5px" }}>
                {field.label}:
              </label>
              <input
                type="text"
                value={field.value}
                onChange={(e) =>
                  setNewUser({ ...newUser, [field.key]: e.target.value })
                }
                onBlur={changeUserInfo}
                onKeyDown={(e) => {
                  if (e.key === "Enter") changeUserInfo();
                }}
              />
            </div>
          ))}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        googleLoginButton
      )}
    </div>
  );
};

  export default Register;
