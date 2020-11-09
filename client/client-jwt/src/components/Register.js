import React, { useState } from 'react';
import auth from '../utils/auth';
import apiServiceJWT from './../ApiServiceJWT';

const initialState = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
};

const Register = (props) => {
  const [state, setState] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    // Check the client-session to see how to handle redirects

  };

  const validateForm = () => {
    return (
      !state.email || !state.password || !state.firstName || !state.lastName
    );
  };

  return (
    <div>
      <h2>Register</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="name@mail.com"
          name="email"
          value={state.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="supersecretthingy"
          name="password"
          value={state.password}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Name"
          name="firstName"
          value={state.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Nameson"
          name="lastName"
          value={state.lastName}
          onChange={handleChange}
        />
        <button className="form-submit" type="submit" disabled={validateForm()}>
          &nbsp;Register&nbsp;
        </button>
      </form>
    </div>
  );
};

export default Register;
