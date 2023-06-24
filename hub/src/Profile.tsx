import React, { useState, useEffect, useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { User, Group } from "./types";
import { UserContext } from "./App";
import apiRequest from "./utils/apiRequests";
import Modal from "./Modal"

type GroupProps = {
  groupId: string;
};

const AddUsersToGroup: React.FC<GroupProps> = ({ groupId }) => {
  const [usernames, setUsernames] = useState<string[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newUsernames = [...usernames];
    newUsernames[index] = event.target.value;
    setUsernames(newUsernames);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch(`http://localhost:5000/api/groups/${groupId}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usernames }),
    });

    if (!response.ok) {
      const message = await response.text();
      console.error('Error:', message);
      return;
    }

    const group = await response.json();
    console.log('Updated group:', group);
  }

  return (
    <form onSubmit={handleSubmit}>
      {usernames.map((username, index) => (
        <input
          key={index}
          type="text"
          placeholder="Username"
          value={username}
          onChange={event => handleInputChange(event, index)}
        />
      ))}
      <button type="button" onClick={() => setUsernames([...usernames, ""])}>Add User</button>
      <button type="submit">Update Group</button>
    </form>
  );
}

function GroupComponent() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [newGroupName, setNewGroupName] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/api/groups')
            .then(response => {
                if (!response.ok) { 
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(data => setGroups(data))
            .catch(error => console.error('Error:', error));
    }, []);

    const createGroup = () => {
      console.log('newGroupName', newGroupName);
        fetch('http://localhost:5000/api/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ groupName: newGroupName }),
        })
        .then(response => {
            if (!response.ok) { 
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(data => {
            setGroups([...groups, data]);
            setNewGroupName('');
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    return (
        <div>
            {groups.map(group => (
                <div key={group.id}>
                    <h2>{group.groupName}</h2>
                    <p>Members: {group.members.length}</p>
                    <p>Comments: {group.comments.length}</p>
                    <AddUsersToGroup groupId={group.id} />
                </div>
            ))}
            <input 
                type="text" 
                value={newGroupName} 
                onChange={e => setNewGroupName(e.target.value)} 
                placeholder="Enter new group name" 
            />
            <button onClick={createGroup}>Create Group</button>
        </div>
    );
}

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
          <GroupComponent />
        </>
      ) : (
        googleLoginButton
      )}
    </div>
  );
};

  export default Register;
