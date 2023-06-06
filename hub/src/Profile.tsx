import React, { useState, useEffect, useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { User } from "./types";
import { UserContext } from "./App";
import getAccessToken from "./utils/auth";
import apiRequest from "./utils/apiRequests";

const Register: React.FC = () => {
  const { user, setUser } = useContext(UserContext);
  const [newUser, setNewUser] = useState<User | null>(null);

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
    <>
      {newUser ? (
        <>
        {inputFields.map((field) => (
          <label key={field.key}>
            {field.label}:
            <input
              type="text"
              value={field.value}
              onChange={(e) => setNewUser({ ...newUser, [field.key]: e.target.value })}
              onBlur={changeUserInfo}
              onKeyDown={(e) => { if (e.key === 'Enter') changeUserInfo(); }}
            />
          </label>
        ))}
        <button onClick={logout}>Logout</button>
      </>
      ) : (
        googleLoginButton
      )}
    </>
  );
};

export default Register;
