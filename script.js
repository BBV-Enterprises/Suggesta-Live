// Handles login and signup for Suggesta. Pages load this file with <script src="script.js">.

// Where people land after logging in or signing up
const HOME_URL = "home.html";

async function postJSON(url, data) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  let body = {};
  try { body = await res.json(); } catch {}
  if (!res.ok) throw new Error(body.error || "Something went wrong. Please try again.");
  return body;
}

function messageBox(button) {
  let box = document.getElementById("form-error");
  if (!box) {
    box = document.createElement("p");
    box.id = "form-error";
    box.className = "error";
    box.setAttribute("role", "alert");
    button.insertAdjacentElement("afterend", box);
  }
  return box;
}

function wireForm({ buttonId, endpoint, fields }) {
  const button = document.getElementById(buttonId);
  if (!button) return;

  async function submit() {
    const box = messageBox(button);
    box.textContent = "";
    const data = {};
    for (const [key, id] of Object.entries(fields)) {
      const el = document.getElementById(id);
      data[key] = el ? el.value : "";
    }
    const label = button.textContent;
    button.disabled = true;
    button.textContent = "One moment...";
    try {
      await postJSON(endpoint, data);
      window.location.href = HOME_URL;
    } catch (err) {
      box.textContent = err.message;
      button.disabled = false;
      button.textContent = label;
    }
  }

  button.addEventListener("click", submit);
  Object.values(fields).forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
  });
}

wireForm({
  buttonId: "login-btn",
  endpoint: "/api/login",
  fields: { email: "login-email", password: "login-password" },
});

wireForm({
  buttonId: "signup-btn",
  endpoint: "/api/signup",
  fields: { name: "signup-name", email: "signup-email", password: "signup-password" },
});