# 🧠 Gemini Nano + Cloud Summarizer  
### Chrome Built-In AI Challenge Entry  

**Author:** [Sebin Mathew](https://www.linkedin.com/in/sebin-m/)  
**GitHub:** [sebin-gg](https://github.com/sebin-gg)

---

## 🌟 Overview
**Gemini Nano + Cloud Summarizer** is a modern Chrome extension built using **Manifest V3** that intelligently summarizes web pages with Google’s latest on-device AI technology.  
It utilizes Chrome’s new **Summarizer API**, powered by **Gemini Nano**, to perform summarization locally on the user’s device. When the local model is unavailable or restricted, the extension automatically switches to a **cloud-based fallback**, using either **Google Gemini 1.5 Flash** or **OpenAI GPT-3.5 Turbo**.

The extension was designed to highlight how developers can combine **local inference** and **cloud APIs** for adaptive AI experiences, balancing performance, privacy, and accessibility.  

---

## 🚀 Features

- 🧠 **On-Device AI Summarization:** Uses Chrome's built-in Summarizer API (Gemini Nano) for offline or privacy-sensitive summarization.  
- ☁️ **Automatic Cloud Fallback:** Switches to Gemini Pro or OpenAI GPT if the local model is unavailable or restricted.
- 🔄 **Smart Caching:** Caches summaries locally to avoid repeated API calls for the same content.
- 🌓 **Dark Mode Support:** Includes automatic dark mode detection and manual toggle.
- 📋 **Copy & Download:** Easy options to copy summaries or download as text files.
- 🎯 **Multiple Modes:** Choose between TL;DR, Key Points, or Concise Paragraph formats.
- 🔐 **Secure API Key Management:** Keys are stored safely in `chrome.storage.sync` and never transmitted without consent.
- 💾 **State Persistence:** Remembers your last used mode and theme preferences.
- 🚫 **Restricted Page Protection:** Gracefully handles chrome:// and edge:// pages.
- ⚡ **Optimized Performance:** Text truncation, loading states, and error recovery.

---

## 🧰 Technical Architecture

| Component | Purpose |
|------------|----------|
| **Manifest V3** | Modern Chrome extension manifest supporting ES modules and secure APIs |
| **Summarizer API** | Provides access to Gemini Nano, Chrome’s built-in on-device AI model |
| **Fetch API** | Handles fallback API requests to Google Gemini or OpenAI |
| **Chrome Storage Sync** | Securely stores API keys and settings |
| **HTML/CSS/JS** | Builds a lightweight popup UI for user interaction |

The extension first checks whether the `Summarizer` object exists and the model status is `"available"`. If so, it uses the Gemini Nano model locally. Otherwise, it loads stored API keys and forwards the cleaned webpage text to the user-selected fallback service.


## ⚙️ Installation Guide

### 1. Enable Experimental Chrome AI Flags
Open Chrome Canary (version 144 or higher) and enable:

```

chrome://flags/#prompt-api-for-gemini-nano          → Enabled (Multilingual)
chrome://flags/#optimization-guide-on-device-model  → Enabled (BypassPerfRequirement)

````

Restart Chrome after enabling these flags.

### 2. Load the Extension
1. Clone the repository:
   ```bash
   git clone https://github.com/sebin-gg/gemini-nano-summarizer
````

2. Go to `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the cloned folder.

### 3. Test the Extension

Open any long article (for example, a Wikipedia page) and click the extension icon.
Press **“Summarize Page”** to start.

---

## 🔑 API Key Setup for Cloud Fallback

If the local Gemini Nano model is not available or fails to produce a summary:

1. Obtain a **Gemini API key** from [Google AI Studio](https://makersuite.google.com/app/apikey).
2. Optionally, get an **OpenAI API key** from [OpenAI Platform](https://platform.openai.com/account/api-keys).
3. Enter these keys in the popup’s *Fallback API Keys* section and click **Save Keys**.
   The keys are encrypted and stored securely using `chrome.storage.sync`.
4. The extension automatically uses Gemini first, then OpenAI if needed.

---

## 🧩 Usage Workflow

1. Navigate to any webpage containing rich textual content.
2. Open the extension popup.
3. (Optional) Choose your preferred summarization mode:
   - **TL;DR:** Quick, concise summary
   - **Key Points:** Bulleted list of main points
   - **Concise Paragraph:** Flowing paragraph format
4. (Optional) Toggle "Include title" to include page title in summary
5. Click **Summarize Page** to begin.
6. You will see live messages such as:
   * *⬇️ Downloading model (45%)* – Gemini Nano is being installed locally
   * *🧠 Initializing model…* – The summarizer is preparing to run
   * *⚙️ Summarizing…* – Text is being processed
   * *✅ Done.* – Summary appears in the result box

For cloud fallback:
- If a cached version exists, it's shown immediately with age
- Click "Retry (force)" to bypass cache and get fresh summary
- Explicit confirmation required before sending to cloud
- Clear status messages show current operation state

---

## 🧠 Example Summary Output

```
✅ Done.
• Chrome’s Summarizer API enables on-device AI summarization.
• Gemini Nano runs locally for faster, private text processing.
• Falls back to Gemini Flash or OpenAI when the local model is unavailable.
```

---

## 🛡️ Privacy and Security

* The extension **never sends data** externally without explicit user consent.
* When using the local model, all processing happens **entirely on the device**.
* API keys are stored using **Chrome’s Sync Storage**, not in plain files or localStorage.
* Cloud fallbacks are clearly indicated before data is transmitted.
* The project complies with Google’s Generative AI Prohibited Use Policy.

---

## ⚠️ Known Limitations

* The **Summarizer API** may produce empty results in Chrome versions below 146 due to restricted rollout.
* Requires **16 GB RAM or higher** and **unmetered internet** for model download.
* First-time model installation may take 5–15 minutes (~1–2 GB).
* On certain profiles, `outputLanguage` attestation may still be unavailable.
* The popup environment may time out on very large pages; input is capped to ~8 KB of text.

---

## 💻 Permissions Used

```json
"permissions": [
  "activeTab",
  "scripting",
  "storage"
]
```

These minimal permissions allow the extension to read visible page text, inject scripts to extract content, and store API keys securely.

---

## 🧩 Project Structure

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

This project is released under the **MIT License**.
You are free to use, modify, and distribute it for research or educational purposes.

---

## 🤝 Contact & Profiles

* **Author:** Sebin Mathew
* **LinkedIn:** [linkedin.com/in/sebin-m](https://www.linkedin.com/in/sebin-m/)
* **GitHub:** [github.com/sebin-gg](https://github.com/sebin-gg)

---

## 🏆 Submission Notes for Chrome Built-In AI Challenge

### 🔧 Innovation

* Integrates **on-device AI inference** with **cloud API failover** seamlessly.
* Demonstrates robust error handling and UX feedback for emerging AI APIs.
* Serves as a template for privacy-conscious Chrome AI extensions.

### 🔒 Privacy & Ethics

* Local summarization runs fully offline; cloud mode explicitly notifies the user.
* User credentials and keys never leave their Chrome profile.
* Complies with Chrome’s permission and origin policies.

### 📈 Future Enhancements

* Add **streaming summaries** using `summarizeStreaming()`.
* Extend support for multilingual summarization (e.g., `outputLanguage: "es"` or `"ja"`).
* Integrate caching for repeated summarizations of the same page.
* Add automatic summarization triggers via context menu actions.

---

> *Built with curiosity and care for the 2025 Chrome Built-In AI Challenge.*
> *Empowering local intelligence, backed by ethical cloud resilience.*


