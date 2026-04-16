chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    const url = chrome.runtime.getURL('guide.html');
    chrome.tabs.create({ url });
  }
});
