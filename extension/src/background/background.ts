import { ApiRequestInfo } from "../types";

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
  console.log("apiRequest", apiRequestInfo);
  const requestConfig: RequestInit = {
    method: apiRequestInfo.method,
    headers: {
      "Content-Type": "application/json",
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
