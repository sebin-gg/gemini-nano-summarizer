document.addEventListener("DOMContentLoaded", () => {
  console.log("popup.js loaded");

  // --- Storage helpers (must be before use) ---
  function storageGet(keys) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(keys, (result) => {
          const err = chrome.runtime.lastError;
          if (err) reject(err);
          else resolve(result);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  function storageSet(obj) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.set(obj, () => {
          const err = chrome.runtime.lastError;
          if (err) reject(err);
          else resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  // --- DOM Elements ---
  const summarizeBtn = document.getElementById("summarizeBtn");
  const resultDiv = document.getElementById("output");
  const statusText = document.getElementById("loading");
  const modeSelect = document.getElementById("modeSelect");
  const includeTitleCheckbox = document.getElementById("includeTitle");
  const geminiKeyInput = document.getElementById("geminiKey");
  const openaiKeyInput = document.getElementById("openaiKey");
  const saveKeysBtn = document.getElementById("saveKeysBtn");
  const clearKeysBtn = document.getElementById("clearKeysBtn");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const clearBtn = document.getElementById("clearBtn");
  const darkToggle = document.getElementById("darkToggle");
  const pageTitleEl = document.getElementById("pageTitle");
  const pageUrlEl = document.getElementById("pageUrl");

  // --- Theme Handling ---
  async function applyTheme(dark) {
    const el = document.documentElement;
    if (dark) el.classList.add("dark"); else el.classList.remove("dark");
    try { await storageSet({ darkMode: !!dark }); } catch {}
    if (darkToggle) darkToggle.checked = !!dark;
  }

  storageGet(["darkMode"])
    .then(({ darkMode }) => {
      if (typeof darkMode === "boolean") applyTheme(darkMode);
      else applyTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    })
    .catch(() => applyTheme(false));

  if (darkToggle) darkToggle.addEventListener("change", () => applyTheme(!!darkToggle.checked));

  // --- Load Keys ---
  storageGet(["geminiKey", "openaiKey"]).then(({ geminiKey = "", openaiKey = "" }) => {
    if (geminiKeyInput) geminiKeyInput.value = geminiKey;
    if (openaiKeyInput) openaiKeyInput.value = openaiKey;
  }).catch(console.warn);

  // --- Save / Clear Keys ---
  saveKeysBtn?.addEventListener("click", async () => {
    const g = geminiKeyInput?.value?.trim() || "";
    const o = openaiKeyInput?.value?.trim() || "";
    await storageSet({ geminiKey: g, openaiKey: o });
    statusText.textContent = "✅ Keys saved.";
    setTimeout(() => (statusText.textContent = "Ready"), 1200);
  });

  clearKeysBtn?.addEventListener("click", async () => {
    await storageSet({ geminiKey: "", openaiKey: "" });
    geminiKeyInput.value = "";
    openaiKeyInput.value = "";
    statusText.textContent = "✅ Keys cleared.";
  });

  // --- Copy / Download / Clear ---
  copyBtn?.addEventListener("click", async () => {
    try {
      const txt = resultDiv.innerText || "";
      await navigator.clipboard.writeText(txt);
      statusText.textContent = "✅ Copied!";
    } catch {
      statusText.textContent = "⚠️ Copy failed.";
    }
  });

  downloadBtn?.addEventListener("click", () => {
    const txt = resultDiv.innerText || "";
    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `summary.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  clearBtn?.addEventListener("click", () => {
    resultDiv.innerText = "";
    pageTitleEl.innerText = "";
    pageUrlEl.innerText = "";
    statusText.textContent = "Ready";
  });

  // --- Summarize Button ---
  let isProcessing = false;
  summarizeBtn.addEventListener("click", async () => {
    if (isProcessing) return;
    isProcessing = true;

    try {
      resultDiv.innerHTML = `<div style="color:var(--muted);text-align:center;padding:20px;">Initializing...</div>`;

      const page = await getPageContentSafe();
      if (!page.text) {
        showError("No content found to summarize");
        return;
      }

      const combined = includeTitleCheckbox.checked ? `${page.title}\n\n${page.text}` : page.text;
      const { geminiKey = "", openaiKey = "" } = await storageGet(["geminiKey", "openaiKey"]);
      const hasCloudKeys = !!(geminiKey?.trim() || openaiKey?.trim());

      // 1️⃣ Cloud summarization first
      if (hasCloudKeys) {
        statusText.textContent = "☁️ Using cloud summarization...";
        const summary = await cloudSummarize(combined, modeSelect.value, includeTitleCheckbox.checked);
        resultDiv.innerText = summary;
        if (!summary.startsWith("⚠️")) {
          statusText.textContent = "✅ Done (Cloud)";
          return;
        } else console.warn("Cloud failed, falling back...");
      }

      // 2️⃣ Local fallback
      const hasLocal = await checkSummarizer();
      if (hasLocal) {
        statusText.textContent = "⚙️ Using local Gemini Nano...";
        let localType = modeSelect.value || "summary";
        const validTypes = ["tldr", "summary", "paragraph", "headline", "teaser"];
        if (!validTypes.includes(localType)) localType = "summary";

        const summarizer = await Summarizer.create({
          type: localType,
          outputLanguage: "en"
        });
        const result = await summarizer.summarize(combined);
        if (result?.outputText) {
          resultDiv.innerText = result.outputText;
          statusText.textContent = "✅ Done (Local)";
          return;
        }
      }

      showError("No API key found and local summarizer unavailable.");
    } catch (err) {
      console.error("Summarize error:", err);
      showError(err.message || "An error occurred");
    } finally {
      isProcessing = false;
    }
  });

  // --- Helpers ---
  function showError(msg) {
    statusText.textContent = "⚠️ " + msg;
  }

  async function getPageContentSafe() {
    // Replace this with logic that reads from the current tab if needed
    return { text: document.title || "Example text content", title: "Demo Page", url: "http://example.com" };
  }

  async function checkSummarizer() {
    return typeof Summarizer !== "undefined";
  }

  // --- Cloud Summarization (Gemini > OpenAI fallback) ---
  async function cloudSummarize(text, mode, includeTitle) {
    try {
      const { geminiKey = "", openaiKey = "" } = await storageGet(["geminiKey", "openaiKey"]);
      const useGemini = !!geminiKey?.trim();
      const useOpenAI = !!openaiKey?.trim();

      const prompt = `Summarize the following content in ${mode} format:
${includeTitle ? "Include the title if relevant." : ""}
---
${text}`;

      // Prefer Gemini API
      if (useGemini) {
        const resp = await fetch(
          "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + geminiKey,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          }
        );
        const data = await resp.json();
        console.log("Gemini raw response:", data);
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text.trim();
        } else {
          console.warn("Gemini API invalid response:", data);
          return "⚠️ Gemini API call failed.";
        }
      }

      // Fallback → OpenAI
      if (useOpenAI) {
        const resp = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + openaiKey
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a summarization assistant." },
              { role: "user", content: prompt }
            ]
          })
        });
        const data = await resp.json();
        console.log("OpenAI raw response:", data);
        if (data?.choices?.[0]?.message?.content) {
          return data.choices[0].message.content.trim();
        } else {
          console.warn("OpenAI API invalid response:", data);
          return "⚠️ OpenAI API call failed.";
        }
      }

      return "⚠️ No API key found.";

    } catch (err) {
      console.error("Cloud summarization error:", err);
      return "⚠️ Cloud summarization error.";
    }
  }
});
