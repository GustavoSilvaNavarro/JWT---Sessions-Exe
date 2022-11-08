// import axios from 'axios';
const BASE_URL = 'http://localhost:3001';

// possible to refactor into a 'fetch factory' to reduce repetition

const apiService = {};

apiService.register = async (user) => {
  try{
    const result = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(user)
    });

    if (result.status === 201) {
      const resp = await result.json();
      return resp;
    }

    return await result.json();
  } catch (err) {
    console.log(err);
  }
};

apiService.login = async (user) => {
  try{
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(user)
    });

    if (res.status === 200) {
      const resp = await res.json();
      console.log(resp);
      return resp;
    }

    return await res.json();
  } catch (err) {
    console.log(err);
  }

};

apiService.profile = async () => {
  try {
    let result = await fetch(`${BASE_URL}/me`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
    });

    return await result.json();
  } catch (error) {
    console.log(error);
  }
};

apiService.logout = async () => {
  try {
    let result = await fetch(`${BASE_URL}/logout`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
    });

    if (result.status === 200) {
      const data = await result.json();
      console.log(data)
      return data;
    }

    return null;
  } catch (error) {
    console.log(error);
  }
};

export default apiService;
