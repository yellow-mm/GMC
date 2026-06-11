// netlify/functions/line-notify.js
// วางไฟล์นี้ที่: netlify/functions/line-notify.js
// ส่งแจ้งเตือนพร้อมกัน: LINE Messaging API + Microsoft Teams

// ── Config ───────────────────────────────────────────────────────────
const LINE_CHANNEL_ACCESS_TOKEN = "VV+18c0a3OwQAKlJjp/zhL/ZsHGIu2Rn8FEGt19v2DTC2pFWfZncj3mMcM2hd6BSQU7e6/UBm7V+OujwmAk1UvoMYROpkBC/5akz8S0et/X6flI7y9TGKcoWe76Qc/prgeeTS6gVWueCTEZurQNQtAdB04t89/1O/w1cDnyilFU=";
const LINE_GROUP_ID             = "C1709f44e14f0581ad25ff9803255b4e6";
const TEAMS_WEBHOOK_URL         = "https://defaulte3a8a1da209b461699a5fbf25a3ccf.74.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/4791d389787d40448c229852d8267f6e/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ZwZegLeb6S-nWMkjIdQAY-aBZdtxQe3jKiN3btuIt8E";

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

  // ── ส่งทั้งสองช่องพร้อมกัน (Promise.allSettled = ถ้าอันใดล้มเหลวอีกอันยังส่งต่อ) ──
  const [lineResult, teamsResult] = await Promise.allSettled([
    sendLine(message),
    sendTeams(message)
  ]);

  const lineOk  = lineResult.status  === "fulfilled" && lineResult.value;
  const teamsOk = teamsResult.status === "fulfilled" && teamsResult.value;

  console.log(`LINE: ${lineOk ? "✅ success" : "❌ failed"}`);
  console.log(`Teams: ${teamsOk ? "✅ success" : "❌ failed"}`);

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({
      line:  lineOk  ? "success" : "failed",
      teams: teamsOk ? "success" : "failed"
    })
  };
};

// ── LINE Messaging API ────────────────────────────────────────────────
async function sendLine(message) {
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
  return res.ok;
}

// ── Microsoft Teams Webhook ───────────────────────────────────────────
// ส่งเป็น Adaptive Card — แสดงผลสวยงามใน Teams
async function sendTeams(message) {
  // แปลงข้อความเป็น Adaptive Card
  const lines = message.split("\n").filter(l => l.trim());
  const title = lines[0] || "Project Tracker แจ้งเตือน";
  const body  = lines.slice(1).join("\n");

  const card = {
    type: "message",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
          "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
          type: "AdaptiveCard",
          version: "1.4",
          body: [
            {
              type: "TextBlock",
              text: title,
              weight: "Bolder",
              size: "Medium",
              color: "Accent",
              wrap: true
            },
            {
              type: "TextBlock",
              text: body,
              wrap: true,
              spacing: "Small",
              color: "Default"
            }
          ],
          msteams: { width: "Full" }
        }
      }
    ]
  };

  const res = await fetch(TEAMS_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(card)
  });

  return res.ok;
}
