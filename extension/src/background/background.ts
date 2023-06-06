import { ApiRequestInfo } from "../types";
import getAccessToken  from './auth';

let accessToken: string | undefined, refreshToken: string | undefined;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.from === 'content') {
    accessToken = request.accessToken;
    refreshToken = request.refreshToken;
  }
  console.log('accessToken: ', accessToken);
  console.log('refreshToken: ', refreshToken);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "apiRequest") {
    apiRequest(request.apiRequestInfo)
      .then((data: any) => {
        sendResponse(data);
      })
      .catch((error: any) => {
        sendResponse({ error: error.message });
      });
    return true;
  }
});

async function apiRequest( apiRequestInfo: ApiRequestInfo) {
  try {
    if(accessToken) {
      accessToken = await getAccessToken(accessToken, refreshToken);
      if (accessToken) {
        const requestConfig: RequestInit = {
          method: apiRequestInfo.method,
          headers: {
            "Content-Type": "application/json",
            "Authorization": accessToken,
          }
        };
        if(apiRequestInfo.body !== null) requestConfig.body = JSON.stringify(apiRequestInfo.body);
        
        const response = await fetch("http://localhost:5000" + apiRequestInfo.url, requestConfig);

        if (!response.ok) {
          const message = `An error has occured: ${response.status}`;
          throw new Error(message);
        }

        return response.json();
      }
    } else {
      throw new Error('No access token recieved');
    }
  } catch (error) {
    console.error(error);
    // Handle errors
  } 
}
