// background.js

// Function to fetch preferences from the server
async function fetchPreferencesFromServer(email) {
  try {
    const response = await fetch(`https://youtube-detox-extension.onrender.com/api/v1/user/preferences/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch preferences');
    }
    const data = await response.json();
    return data.topics; // Assuming topics are returned as an array of strings
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return []; // Return empty array or handle error as per your application logic
  }
}

// Function to retrieve email from local storage or prompt user for input
async function getEmail() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('email', (data) => {
      const email = data.email;
      if (email) {
        resolve(email);
      } else {
        // No email found in local storage, prompt user to enter email
        chrome.windows.create({
          url: chrome.runtime.getURL('popup.html'),
          type: 'popup',
          width: 400,
          height: 300,
        });
        // Listen for message from popup with user's email
        chrome.runtime.onMessage.addListener(function listener(message, sender, sendResponse) {
          if (message.action === 'saveEmail') {
            const { email } = message;
            chrome.storage.local.set({ email }, () => {
              chrome.runtime.onMessage.removeListener(listener); // Remove the listener to avoid multiple triggers
              resolve(email);
            });
          }
        });
      }
    });
  });
}

// Function to manipulate YouTube recommendations based on preferences
function manipulateRecommendations(preferences) {
  // Content script to filter YouTube recommendations
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'filterRecommendations', preferences });
  });
}

// On YouTube homepage load, trigger the process
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'loadYouTubeHomepage') {
    // Step 1: Retrieve email
    getEmail().then((email) => {
      // Step 2: Fetch preferences from server
      fetchPreferencesFromServer(email).then((preferences) => {
        // Step 3: Manipulate YouTube recommendations
        manipulateRecommendations(preferences);
      }).catch((error) => {
        console.error('Error fetching preferences:', error);
      });
    }).catch((error) => {
      console.error('Error retrieving email:', error);
    });
  }
});
