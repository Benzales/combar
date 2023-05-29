import React, { useState, useEffect, useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { User } from "./types";
import { UserContext } from "./App";

const Register: React.FC = () => {
  const { user, setUser } = useContext(UserContext);
  const [newUser, setNewUser] = useState<User | null>(null);

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
      fetch("http://localhost:5000/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setUser(newUser);
        })
        .catch(console.error);
    }
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
      </>
      ) : (
        googleLoginButton
      )}
    </>
  );
};

export default Register;
