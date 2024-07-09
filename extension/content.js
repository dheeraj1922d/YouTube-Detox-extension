// content.js

// Function to filter YouTube recommendations
function filterYouTubeRecommendations(preferences) {
  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === "childList") {
        const newVideos = mutation.addedNodes;
        newVideos.forEach((newVideo) => {
          if (
            newVideo.nodeType === Node.ELEMENT_NODE &&
            newVideo.tagName === "YTD-RICH-ITEM-RENDERER"
          ) {
            const titleElement = newVideo.querySelector("#video-title");
            if (titleElement) {
              const title = titleElement.textContent.toLowerCase();
              const matchesPreference = preferences.some((topic) =>
                title.includes(topic.toLowerCase())
              );
              if (!matchesPreference) {
                newVideo.remove();
              }
            }
          }
        });
      }
    });
  });

  // Start observing the DOM for changes in video items
  observer.observe(document.body, { childList: true, subtree: true });

  // Filter already existing videos
  const videoItems = document.querySelectorAll("ytd-rich-item-renderer");
  videoItems.forEach((item) => {
    const titleElement = item.querySelector("#video-title");
    if (titleElement) {
      const title = titleElement.textContent.toLowerCase();
      const matchesPreference = preferences.some((topic) =>
        title.includes(topic.toLowerCase())
      );
      if (!matchesPreference) {
        item.remove();
      }
    }
  });
}

// On YouTube homepage load, trigger the process
chrome.runtime.sendMessage({ action: "loadYouTubeHomepage" });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "filterRecommendations") {
    const { preferences } = request;
    filterYouTubeRecommendations(preferences);
  }
});
