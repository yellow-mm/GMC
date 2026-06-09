// netlify/functions/line-notify.js
// วางไฟล์นี้ที่: netlify/functions/line-notify.js

// ── LINE Messaging API config ────────────────────────────────────────
const LINE_CHANNEL_ACCESS_TOKEN = "VV+18c0a3OwQAKlJjp/zhL/ZsHGIu2Rn8FEGt19v2DTC2pFWfZncj3mMcM2hd6BSQU7e6/UBm7V+OujwmAk1UvoMYROpkBC/5akz8S0et/X6flI7y9TGKcoWe76Qc/prgeeTS6gVWueCTEZurQNQtAdB04t89/1O/w1cDnyilFU=";
const LINE_GROUP_ID             = "C1709f44e14f0581ad25ff9803255b4e6";

exports.handler = async function(event) {

  // CORS preflight
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

  let message;
  try {
    const body = JSON.parse(event.body || "{}");
    message = body.message;
  } catch (e) {
    return { statusCode: 400, body: "Invalid JSON body" };
  }

  if (!message) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing message" }) };
  }

  try {
    const res = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
        "Content-Type":  "application/json"
      },
      body: JSON.stringify({
        to: LINE_GROUP_ID,
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
