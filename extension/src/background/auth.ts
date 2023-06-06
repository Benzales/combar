import jwt_decode from "jwt-decode";

const refreshAccessToken = async (refreshToken: any) => {
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
  
  // TODO: Store new access token
  return newAccessToken;
}

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

const getAccessToken = async (accessToken: any, refreshToken: any) => {
  const decodedToken = jwt_decode(accessToken) as DecodedToken;
  const currentTime = Date.now() / 1000;
  const bufferTime = 5 * 60; // 5 minutes buffer time
  if (decodedToken.exp < (currentTime + bufferTime)) {
      accessToken = await refreshAccessToken(refreshToken);
  }

  return accessToken;
}

export default getAccessToken;