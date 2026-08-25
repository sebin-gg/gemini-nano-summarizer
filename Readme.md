# 🧠 Gemini Nano + Cloud Summarizer
### Chrome Built-In AI Challenge entry

**Author:** [Sebin Mathew](https://www.linkedin.com/in/sebin-m/)
**GitHub:** [sebin-gg](https://github.com/sebin-gg)

---

## 🌟 Overview

A Chrome extension, built on Manifest V3, that summarizes the page you are reading from a popup. It uses Chrome's built-in Summarizer API, powered by Gemini Nano, so summarization runs entirely on your device. When the local model is unavailable or restricted, you can save a cloud API key and the extension falls back to Google Gemini 1.5 Flash or OpenAI GPT-3.5 Turbo.

The project was built for the 2025 Chrome Built-In AI Challenge to show how local inference and cloud APIs can combine into one adaptive, privacy-friendly experience.

| Component | Purpose |
|------------|----------|
| **Manifest V3** | Modern Chrome extension platform |
| **Summarizer API** | Access to Gemini Nano, Chrome's on-device AI model |
| **Fetch API** | Cloud requests to Gemini or OpenAI |
| **Chrome Storage** | Stores API keys and settings |
| **HTML/CSS/JS** | Lightweight popup UI |

The popup checks whether the `Summarizer` object exists and reports `"available"`. Saved cloud keys take priority; with no keys set, the extension uses the local model. When both a Gemini and an OpenAI key are saved, Gemini runs first and OpenAI is used if it fails.

---

## ⚙️ Quickstart

Requires Chrome 144 or higher (Chrome Canary recommended) and hardware that meets the requirements listed under known limitations.

### 1. Enable the Chrome AI flags

Open `chrome://flags`, enable these two flags, then restart Chrome:

```
chrome://flags/#prompt-api-for-gemini-nano          → Enabled (Multilingual)
chrome://flags/#optimization-guide-on-device-model  → Enabled (BypassPerfRequirement)
```

### 2. Load the extension

1. Clone the repository:
   ```bash
   git clone https://github.com/sebin-gg/gemini-nano-summarizer
   ```
2. Go to `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the cloned folder.

### 3. Try it

Open any long article (a Wikipedia page works well), click the extension icon, and press **Summarize Page**.

---

## ⚡ Features

- 🧠 **On-device AI:** Summaries run locally through Chrome's built-in Summarizer API (Gemini Nano), with no server involved.
- ☁️ **Cloud fallback:** Switches to Gemini 1.5 Flash or OpenAI GPT-3.5 Turbo when the local model is unavailable or restricted.
- 🎯 **Multiple modes:** Choose TL;DR, Key Points, or Concise Paragraph.
- 🌓 **Dark mode:** Follows your system theme, with a manual toggle.
- 📋 **Copy and download:** Copy any summary to the clipboard or save it as a `.txt` file.
- 🔐 **Keys stay local:** API keys sit in Chrome storage on your device and only travel to the provider you chose, when you run a cloud summary.
- 💾 **State persistence:** Remembers your theme preference between sessions.
- 🚫 **Restricted page protection:** Handles `chrome://` and `edge://` pages gracefully.
- ⚡ **Optimized performance:** Input capped at ~8 KB of text, loading states, and error recovery.

---

## 🔑 API key setup for cloud fallback

If the local Gemini Nano model is unavailable, or you prefer cloud results:

1. Get a **Gemini API key** from [Google AI Studio](https://makersuite.google.com/app/apikey).
2. Optionally get an **OpenAI API key** from the [OpenAI Platform](https://platform.openai.com/account/api-keys).
3. Paste the keys into the *Fallback API Keys* section of the popup and click **Save Keys**.
4. Run a summary. With both keys saved, Gemini is tried first and OpenAI takes over if it fails.

---

## 🧩 Usage workflow

1. Navigate to a page with substantial text.
2. Open the extension popup.
3. Optional: pick a mode (TL;DR, Key Points, or Concise Paragraph) and tick **Include title** to add the page title.
4. Click **Summarize Page**.

Live status messages tell you what is happening:

* *⬇️ Downloading model (45%)* – Gemini Nano is installing locally
* *🧠 Initializing model…* – the summarizer is preparing to run
* *⚙️ Summarizing…* – text is being processed
* *✅ Done.* – the summary appears in the result box

For cloud runs, the status shows *☁️ Using cloud summarization...* while the request executes and *✅ Done (Cloud)* when it finishes.

Example output:

```
✅ Done.
• Chrome's Summarizer API enables on-device AI summarization.
• Gemini Nano runs locally for faster, private text processing.
• Falls back to Gemini Flash or OpenAI when the local model is unavailable.
```

---

## 🛡️ Privacy and security

* Nothing leaves your device unless you save a cloud key and start a summary.
* In local mode, all processing happens entirely on the device.
* API keys live in Chrome storage, not in plain files or localStorage.
* Cloud use is always visible in the status line before data is sent.
* The project complies with Google's Generative AI Prohibited Use Policy.

---

## ⚠️ Requirements and known limitations

* Requires **16 GB RAM or higher** and **unmetered internet** for the model download.
* First-time model installation downloads ~1-2 GB and can take 5-15 minutes.
* The Summarizer API may produce empty results on Chrome versions below 146 due to restricted rollout.
* On certain profiles, `outputLanguage` attestation is still unavailable.
* Very large pages can time out the popup; input is capped at ~8 KB of text.

---

## 💻 Permissions used

```json
"permissions": [
  "activeTab",
  "scripting",
  "storage"
]
```

These minimal permissions let the extension read visible page text, inject a script to extract it, and store your keys and settings.

---

## 🧩 Project structure

```
/gemini-nano-summarizer
│
├── manifest.json
├── popup.html
├── popup.js
├── icon.png
└── README.md
```

---

## 📜 License

Released under the **MIT License**. You are free to use, modify, and distribute it for research or educational purposes.

---

## 🤝 Contact and profiles

* **Author:** Sebin Mathew
* **LinkedIn:** [linkedin.com/in/sebin-m](https://www.linkedin.com/in/sebin-m/)
* **GitHub:** [github.com/sebin-gg](https://github.com/sebin-gg)

---

## 🏆 Submission notes for the Chrome Built-In AI Challenge

### 🔧 Innovation

* Combines on-device AI inference with cloud API failover in a single popup.
* Demonstrates robust error handling and clear UX feedback for emerging AI APIs.
* Serves as a template for privacy-conscious Chrome AI extensions.

### 🔒 Privacy and ethics

* Local summarization runs fully offline; cloud mode shows its status before sending anything.
* API keys never leave your Chrome profile.
* Complies with Chrome's permission and origin policies.

### 📈 Future enhancements

* Add streaming summaries via `summarizeStreaming()`.
* Extend multilingual summarization (for example, `outputLanguage: "es"` or `"ja"`).
* Add automatic summarization triggers through context menu actions.

---

> *Built with curiosity and care for the 2025 Chrome Built-In AI Challenge.*
> *Empowering local intelligence, backed by ethical cloud resilience.*
