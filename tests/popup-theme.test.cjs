const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const popupSource = readFileSync(join(__dirname, "..", "popup.js"), "utf8");

function startPopup({ data = {}, failGet = false, failSet = false } = {}) {
  const elements = new Map();
  const darkClasses = new Set();
  const writes = [];
  let lastError = null;
  let onReady;

  const document = {
    title: "Test page",
    documentElement: {
      classList: {
        add: (name) => darkClasses.add(name),
        remove: (name) => darkClasses.delete(name),
      },
    },
    addEventListener: (name, callback) => {
      if (name === "DOMContentLoaded") onReady = callback;
    },
    getElementById: (id) => {
      if (!elements.has(id)) {
        elements.set(id, {
          checked: false,
          value: "",
          addEventListener() {},
          close() {},
          click() {},
        });
      }
      return elements.get(id);
    },
  };
  const chrome = {
    runtime: { get lastError() { return lastError; } },
    storage: {
      local: {
        get(keys, callback) {
          queueMicrotask(() => {
            if (failGet && keys.includes("darkMode")) {
              lastError = new Error("storage read failed");
              callback();
              lastError = null;
              return;
            }
            callback(data);
          });
        },
        set(values, callback) {
          writes.push(values);
          queueMicrotask(() => {
            if (failSet) lastError = new Error("storage write failed");
            callback();
            lastError = null;
          });
        },
      },
    },
  };

  vm.runInNewContext(popupSource, {
    chrome,
    console: { log() {}, warn() {}, error() {} },
    document,
    queueMicrotask,
    window: { matchMedia: () => ({ matches: false }) },
  });
  onReady();

  return {
    darkClasses,
    darkToggle: elements.get("darkToggle"),
    writes,
    settle: () => new Promise((resolve) => setImmediate(resolve)),
  };
}

test("theme initialization applies the stored preference and waits for persistence", async () => {
  const popup = startPopup({ data: { darkMode: true } });
  await popup.settle();

  assert.equal(popup.darkClasses.has("dark"), true);
  assert.equal(popup.darkToggle.checked, true);
  assert.deepEqual(popup.writes.map(({ darkMode }) => darkMode), [true]);
});

test("theme initialization falls back to light mode when storage fails", async () => {
  const popup = startPopup({ failGet: true, failSet: true });
  await popup.settle();

  assert.equal(popup.darkClasses.has("dark"), false);
  assert.equal(popup.darkToggle.checked, false);
  assert.deepEqual(popup.writes.map(({ darkMode }) => darkMode), [false]);
});
