require("dotenv").config();
const express = require("express");
const data = require("./store-data");

const app = express();
app.use(express.json({ limit: "20kb" }));
app.use(express.static("public"));

const fmt = (n) => "PKR " + n.toLocaleString("en-US");

const SYSTEM_PROMPT = `You are "TechBot", the friendly sales assistant of ${data.storeName}, a laptop & mobile shopping store in Pakistan.
You ONLY answer questions about laptops, mobile phones, accessories, orders, delivery, warranty, returns, and store services.
If asked anything else, politely say: "I am here only to answer questions related to laptops, mobile phones, accessories, orders, delivery, warranty, and store services." and steer back to shopping.

LAPTOPS:
${data.laptops.map((p) => `- ${p.name} - ${fmt(p.price)} (${p.specs})`).join("\n")}

MOBILE PHONES:
${data.phones.map((p) => `- ${p.name} - ${fmt(p.price)} (${p.specs})`).join("\n")}

ACCESSORIES:
${data.accessories.map((a) => `- ${a.name} from ${fmt(a.from)}`).join("\n")}

POLICIES:
- Warranty: ${data.policies.warranty}
- Delivery: ${data.policies.delivery}
- Returns: ${data.policies.returns}
- Hours: ${data.policies.hours}

RULES: Use only the prices and details above; never invent products, discounts or prices. If unsure (e.g. exact stock), tell the customer to confirm by calling or visiting the store. Keep replies short (2-5 sentences), friendly, and suggest options within the customer's budget. Reply in the customer's language (English or Roman Urdu/Urdu).`;

app.get("/api/products", (req, res) => res.json(data));

// Basic in-memory rate limit: 20 requests/minute per IP
const hits = new Map();
setInterval(() => hits.clear(), 60_000);

app.post("/api/chat", async (req, res) => {
  const ip = req.ip;
  hits.set(ip, (hits.get(ip) || 0) + 1);
  if (hits.get(ip) > 20) return res.status(429).json({ reply: "Too many messages. Please wait a minute." });

  const key = process.env.GROQ_API_KEY;
  if (!key || key.startsWith("PASTE")) return res.status(500).json({ reply: "Server is missing the GROQ_API_KEY in .env file." });

  // Sanitize history: keep last 10 messages, only user/assistant roles, trimmed text
  const history = (Array.isArray(req.body.messages) ? req.body.messages : [])
    .filter((m) => ["user", "assistant"].includes(m.role) && typeof m.content === "string")
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 500) }));
  if (!history.length) return res.status(400).json({ reply: "Empty message." });

  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
        temperature: 0.5,
        max_tokens: 400
      })
    });
    const json = await r.json();
    if (!r.ok) { console.error("Groq error:", json); return res.status(502).json({ reply: "Sorry, the assistant is unavailable right now." }); }
    res.json({ reply: json.choices[0].message.content });
  } catch (e) {
    console.error(e);
    res.status(500).json({ reply: "Something went wrong. Please try again." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`TechZone running at http://localhost:${port}`));
