const $ = (id) => document.getElementById(id);
const money = (n) => "PKR " + n.toLocaleString("en-US");

// ---------- 1. Render the website from /api/products ----------
async function loadStore() {
  const data = await (await fetch("/api/products")).json();
  const card = (p) => `
    <article class="card">
      <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.removeAttribute('src')">
      <div class="p-5">
        <h3 class="font-bold text-lg">${p.name}</h3>
        <p class="text-sm text-slate-500 mt-1">${p.specs}</p>
        <div class="flex items-center justify-between mt-4">
          <span class="text-indigo-600 font-extrabold">${money(p.price)}</span>
          <button class="ask text-sm font-semibold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100" data-q="Tell me about the ${p.name}">Ask TechBot</button>
        </div>
      </div>
    </article>`;
  $("laptopGrid").innerHTML = data.laptops.map(card).join("");
  $("phoneGrid").innerHTML = data.phones.map(card).join("");
  const icons = { Chargers: "🔌", Headphones: "🎧", "Power Banks": "🔋", "Laptop Bags": "🎒" };
  $("accGrid").innerHTML = data.accessories.map((a) => `
    <div class="card p-6 text-center">
      <div class="text-4xl">${icons[a.name] || "🛒"}</div>
      <h3 class="font-bold mt-2">${a.name}</h3>
      <p class="text-sm text-slate-500">from <b class="text-indigo-600">${money(a.from)}</b></p>
    </div>`).join("");
  const pol = [["🛡️ Warranty", data.policies.warranty], ["🚚 Delivery", data.policies.delivery], ["↩️ Returns", data.policies.returns]];
  $("policyGrid").innerHTML = pol.map(([t, d]) => `<div class="card p-6"><h3 class="font-bold text-lg">${t}</h3><p class="text-slate-600 mt-2 text-sm">${d}</p></div>`).join("");
  $("hours").textContent = "🕒 " + data.policies.hours;
}
loadStore();
$("year").textContent = new Date().getFullYear();
$("menuBtn").onclick = () => $("mobileNav").classList.toggle("hidden");
$("mobileNav").onclick = () => $("mobileNav").classList.add("hidden");

// ---------- 2. Chatbot ----------
const history = []; // conversation memory sent to the server each time
const box = $("chatMessages");

function addMsg(text, who) {
  const d = document.createElement("div");
  d.className = "msg " + who;
  d.textContent = text;           // textContent (not innerHTML) prevents XSS
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
  return d;
}

async function send(text) {
  text = text.trim();
  if (!text) return;
  addMsg(text, "user");
  history.push({ role: "user", content: text });
  $("quickReplies").style.display = "none";
  $("sendBtn").disabled = true;

  const typing = document.createElement("div");
  typing.className = "msg bot typing";
  typing.innerHTML = "<span></span><span></span><span></span>";
  box.appendChild(typing); box.scrollTop = box.scrollHeight;

  try {
    const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history }) });
    const { reply } = await res.json();
    typing.remove();
    addMsg(reply, "bot");
    history.push({ role: "assistant", content: reply });
  } catch {
    typing.remove();
    addMsg("Connection problem. Please try again.", "bot");
  }
  $("sendBtn").disabled = false;
  $("chatInput").focus();
}

function openChat() {
  $("chatWindow").classList.remove("hidden");
  $("chatToggle").style.display = window.innerWidth <= 480 ? "none" : "flex";
  if (!box.children.length) {
    addMsg("Assalam o Alaikum! 👋 I'm TechBot. Ask me about laptops, mobiles, accessories, prices, warranty or delivery.", "bot");
    ["Laptops under 100,000", "Best phone under 60,000", "Warranty?", "Delivery time?", "Return policy?"].forEach((q) => {
      const b = document.createElement("button"); b.textContent = q; b.onclick = () => send(q); $("quickReplies").appendChild(b);
    });
  }
  $("chatInput").focus();
}
function closeChat() { $("chatWindow").classList.add("hidden"); $("chatToggle").style.display = "flex"; }

$("chatToggle").onclick = openChat;
$("chatClose").onclick = closeChat;
$("chatForm").onsubmit = (e) => { e.preventDefault(); const v = $("chatInput").value; $("chatInput").value = ""; send(v); };
document.addEventListener("click", (e) => { const b = e.target.closest(".ask"); if (b) { openChat(); send(b.dataset.q); } });
