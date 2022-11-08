import React, { useState } from 'react';
import auth from '../utils/auth';
import apiService from './../ApiService';
import { useNavigate } from 'react-router-dom';

const initialState = {
  email: '',
  password: '',
};

const Login = (props) => {
  let navigate = useNavigate();
  const [state, setState] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add logic to send a request to API service /login
    const info = await apiService.login(state);

    if (info.message === 'Success') {
      // This sets isAuthenticated = true and redirects to profile
      props.setIsAuthenticated(true);
      auth.login(() => navigate('/profile'));
    } else {
      alert(`${info.message} -  Try again`);
    }

  };

  const validateForm = () => {
    return !state.email || !state.password;
  };

  return (
    <section>
      <h2>Login</h2>
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
        <button className="form-submit" type="submit" disabled={validateForm()}>
          &nbsp;Login&nbsp;
        </button>
      </form>
    </section>
  );
};

export default Login;
