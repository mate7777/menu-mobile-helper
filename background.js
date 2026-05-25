chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed.");
  });
  
  chrome.storage.onChanged.addListener((changes, area) => {
    console.log("Changes detected in", area, changes);
  });
  
