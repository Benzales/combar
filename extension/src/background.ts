chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "request") {
    apiRequest(request.request)
      .then((data: any) => {
        sendResponse(data);
      })
      .catch((error: any) => {
        sendResponse({ error: error.message });
      });
    return true;
  }
});

async function apiRequest( request: Request) {
  const requestConfig: RequestInit = {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
    }
  };
  if(request.body !== null) requestConfig.body = JSON.stringify(request.body);
  
  const response = await fetch("http://localhost:5000" + request.url, requestConfig);

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}
