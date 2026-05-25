// Variables globales
let selector = "";
let className = "";
let active = false;
let observer = null;
let appliedSelector = "";
let appliedClassName = "";

// Load stored data and apply the class if active.
chrome.storage.local.get(["selector", "className", "active"], (data) => {
  active = data.active || false;
  selector = data.selector || "";
  className = data.className || "";

  if (active && selector && className) {
    addClassToSelector(selector, className); // Apply the class initially.
    appliedSelector = selector;
    appliedClassName = className;
    startObserver(); // Watch DOM changes.
  }
});

// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "activate") {
    if (appliedSelector && appliedClassName) {
      removeClassFromSelector(appliedSelector, appliedClassName);
    }

    selector = message.selector;
    className = message.className;
    active = true;
    chrome.storage.local.set({ active: true }); // Save active state.
    addClassToSelector(selector, className); // Apply the class immediately.
    appliedSelector = selector;
    appliedClassName = className;
    startObserver(); // Watch DOM changes.
  } else if (message.type === "deactivate") {
    active = false;
    chrome.storage.local.set({ active: false }); // Save inactive state.
    stopObserver();
    removeClassFromSelector(appliedSelector || selector, appliedClassName || className); // Remove the class immediately.
    appliedSelector = "";
    appliedClassName = "";
  }
});

// Add a class to a selector.
function addClassToSelector(selector, className) {
  const elements = getMatchingElements(selector);

  // Split classes into unique tokens.
  const classes = getClassTokens(className);

  elements.forEach((element) => {
    classes.forEach((cls) => {
      if (cls) {
        element.classList.add(cls);
      }
    });
  });
}

// Remove a class from a selector.
function removeClassFromSelector(selector, className) {
  const elements = getMatchingElements(selector);

  // Split classes into unique tokens.
  const classes = getClassTokens(className);

  elements.forEach((element) => {
    classes.forEach((cls) => {
      if (cls) {
        element.classList.remove(cls);
      }
    });
  });
}

// Watch DOM changes and apply classes when needed.
function startObserver() {
  stopObserver();

  observer = new MutationObserver(() => {
    if (active && selector && className) {
      addClassToSelector(selector, className); // Reapply classes to new elements.
    }
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

function stopObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

function getMatchingElements(selector) {
  try {
    return document.querySelectorAll(selector);
  } catch (error) {
    console.warn("Invalid selector:", selector, error);
    return [];
  }
}

function getClassTokens(className) {
  return className.split(/\s+/).filter(Boolean);
}
