import jwt_decode from "jwt-decode";
const extensionID = 'cmohnfemjhpjblloaehecbmpjoldmggc';

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    throw new Error('No refresh token found');
  }

  const response = await fetch('http://localhost:5000/api/users/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': refreshToken
    },
  });

  if (!response.ok) {
    throw new Error('Failed to refresh access token');
  }

  const data = await response.json();
  const newAccessToken = data.access_token;
  
  localStorage.setItem('accessToken', newAccessToken);
  return newAccessToken;
}

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

const getAccessToken = async () => {
  let accessToken = localStorage.getItem('accessToken');

  if (!accessToken || accessToken === 'undefined') {
      accessToken = await refreshAccessToken();
      if(!accessToken || accessToken === 'undefined') return;
  } else {
      const decodedToken = jwt_decode(accessToken) as DecodedToken;
      const currentTime = Date.now() / 1000;
      const bufferTime = 5 * 60; // 5 minutes buffer time
      if (decodedToken.exp < (currentTime + bufferTime)) {
          accessToken = await refreshAccessToken();
      }
  }
  
  return accessToken;
}

export default getAccessToken;