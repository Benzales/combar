export async function request(
  url: string,
  method: string = "GET",
  body: any = null
) {
  const response = await fetch("http://localhost:5000" + url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Error storing selection data");
  }

  return response.json();
}
