import getAccessToken  from './auth';

const apiRequest = async (url: string, method: string, body?: any) => {
  try {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const response = await fetch('http://localhost:5000/' + url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } else {
      console.error("Access token is null");
      // Handle no access token scenario
    }
  } catch (error) {
    console.error(error);
    // Handle errors
  }
};

export default apiRequest;
