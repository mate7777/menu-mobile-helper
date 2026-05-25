const DEFAULT_SELECTOR = ".wp-block-navigation__responsive-container";
const DEFAULT_CLASS_NAME = "has-modal-open is-menu-open";

// Load stored data and initialize the popup.
document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["selector", "className", "active"], (data) => {
      // Load values into fields.
      document.getElementById("selector").value = data.selector || DEFAULT_SELECTOR;
      document.getElementById("class").value = data.className || DEFAULT_CLASS_NAME;
  
      // Update the activate button state.
      const activateButton = document.getElementById("activate");
      if (data.active) {
        activateButton.classList.add("active");
        activateButton.textContent = "Active";
      } else {
        activateButton.classList.remove("active");
        activateButton.textContent = "Activate";
      }
    });
  });
  
  // Save fields when the user changes values.
  document.getElementById("selector").addEventListener("input", (event) => {
    chrome.storage.local.set({ selector: event.target.value });
  });
  
  document.getElementById("class").addEventListener("input", (event) => {
    chrome.storage.local.set({ className: event.target.value });
  });
  
  // Activate button.
  document.getElementById("activate").addEventListener("click", () => {
    const selector = document.getElementById("selector").value;
    const className = document.getElementById("class").value;
  
    if (selector && className) {
      chrome.storage.local.set({ selector, className, active: true }, () => {
        sendMessageToContentScript({ type: "activate", selector, className });
        updateButtonState(true);
      });
    } else {
      alert("Please fill in both fields.");
    }
  });
  
  // Deactivate button.
  document.getElementById("deactivate").addEventListener("click", () => {
    chrome.storage.local.set({ active: false }, () => {
      sendMessageToContentScript({ type: "deactivate" });
      updateButtonState(false);
    });
  });
  
  // Update the activate button appearance.
  function updateButtonState(isActive) {
    const activateButton = document.getElementById("activate");
    if (isActive) {
      activateButton.classList.add("active");
      activateButton.textContent = "Active";
    } else {
      activateButton.classList.remove("active");
      activateButton.textContent = "Activate";
    }
  }
  
  // Send a message to the content script.
  function sendMessageToContentScript(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, message);
    });
  }
  
