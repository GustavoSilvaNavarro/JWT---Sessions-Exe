const BASE_URL = 'http://localhost:3001';

const apiServiceJWT = {};

apiServiceJWT.register = async (user) => {
  try{
    const result = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
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

apiServiceJWT.login = async (user) => {
  try{
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user)
    });

    if (res.status === 200) {
      const resp = await res.json();
      return resp;
    }

    return await res.json();
  } catch (err) {
    console.log(err);
  }

};

apiServiceJWT.profile = async (accessToken) => {
  try {
    let result = await fetch(`${BASE_URL}/me`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${accessToken}`
      },
    });

    return await result.json();
  } catch (error) {
    console.log(error);
  }
};

apiServiceJWT.logout = async (tokenName) => {
  try {
    let result = await fetch(`${BASE_URL}/logout`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${tokenName}`
      }
      // credentials: 'include',
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

export default apiServiceJWT;
