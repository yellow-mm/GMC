exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { token, message } = JSON.parse(event.body || "{}");

  if (!token || !message) {
    return { statusCode: 400, body: "Missing token or message" };
  }

  const body = new URLSearchParams({ message });

  const res = await fetch("https://notify-api.line.me/api/notify", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  const text = await res.text();

  return {
    statusCode: res.status,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: text
  };
};
