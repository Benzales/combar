export async function request(
  url: string,
  method: string = "GET",
  body: any = null
) {
  const requestConfig: RequestInit = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    }
  };
  if(body !== null) requestConfig.body = JSON.stringify(body);
  
  const response = await fetch("http://localhost:5000" + url, requestConfig);

  if (!response.ok) {
    throw new Error();
  }

  return response.json();
}
