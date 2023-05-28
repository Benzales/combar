import React, { useState } from 'react';

type UserFormState = {
  username: string;
  email: string;
  full_name: string;
  bio: string;
};


const Register: React.FC = () => {
  const [form, setForm] = useState<UserFormState>({
    username: '',
    email: '',
    full_name: '',
    bio: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" onChange={handleChange} placeholder="Username" required />
      <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
      <input type="text" name="full_name" onChange={handleChange} placeholder="Full Name" />
      <input type="text" name="bio" onChange={handleChange} placeholder="Bio" />
      <button type="submit">Register</button>
    </form> 
  );
};

export default Register;
