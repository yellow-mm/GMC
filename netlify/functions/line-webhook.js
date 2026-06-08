exports.handler = async function(event) {
  const body   = JSON.parse(event.body || "{}");
  const events = body.events || [];

  events.forEach(e => {
    if (e.source?.type === "group") {
      console.log("✅ Group ID:", e.source.groupId);
    }
  });

  return { statusCode: 200, body: "OK" };
};
