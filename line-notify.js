// netlify/functions/line-notify.js
// ส่งข้อความเข้ากลุ่ม LINE ผ่าน Messaging API
// วาง file นี้ไว้ที่: netlify/functions/line-notify.js

exports.handler = async function(event) {

  // รองรับ CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin":  "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let token, groupId, message;

  try {
    const body = JSON.parse(event.body || "{}");
    token   = body.token;
    groupId = body.groupId;
    message = body.message;
  } catch (e) {
    return { statusCode: 400, body: "Invalid JSON body" };
  }

  if (!token || !groupId || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing token, groupId, or message" })
    };
  }

  try {
    const res = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type":  "application/json"
      },
      body: JSON.stringify({
        to: groupId,
        messages: [{ type: "text", text: message }]
      })
    });

    const responseText = await res.text();

    return {
      statusCode: res.status,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: responseText
    };

  } catch (error) {
    console.error("LINE API call failed:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: error.message })
    };
  }
};
