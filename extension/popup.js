document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("email");
  const newPreferenceInput = document.getElementById("newPreference");
  const preferencesForm = document.getElementById("preferencesForm");
  const preferencesList = document.getElementById("preferencesList");
  const refreshPageButton = document.getElementById("refreshPage");

  // Fetch and display preferences on load
  function fetchPreferences(email) {
    fetch(`https://youtube-detox-extension.onrender.com/api/v1/user/preferences/${email}`)
      .then((response) => response.json())
      .then((data) => {
        displayPreferences(data.topics);
      })
      .catch((error) => {
        console.error("Error fetching preferences:", error);
      });
  }

  // Display preferences
  function displayPreferences(preferences) {
    preferencesList.innerHTML = "";
    preferences.forEach((preference) => {
      const li = document.createElement("li");
      li.textContent = preference;
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () =>
        deletePreference(preference)
      );
      li.appendChild(deleteButton);
      preferencesList.appendChild(li);
    });
  }

  // Save preferences
  preferencesForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = emailInput.value;
    const newPreferences = newPreferenceInput.value
      .trim()
      .split(",")
      .map((pref) => pref.trim())
      .filter((topic) => topic.length > 0);
    if (newPreferences.length > 0 && newPreferences[0] !== "") {
      fetch(`https://youtube-detox-extension.onrender.com/api/v1/user/preferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, topics: newPreferences }),
      })
        .then((response) => response.json())
        .then((data) => {
          newPreferenceInput.value = "";
          fetchPreferences(email);
        })
        .catch((error) => {
          console.error("Error saving preferences:", error);
        });
    } else {
      alert("Please enter at least one preference.");
    }
  });

  // Delete a preference
  function deletePreference(preference) {
    const email = emailInput.value;
    fetch(`https://youtube-detox-extension.onrender.com/api/v1/user/delete/${email}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic: preference }),
    })
      .then((response) => response.json())
      .then((data) => {
        fetchPreferences(email);
      })
      .catch((error) => {
        console.error("Error deleting preference:", error);
      });
  }

  // Auto-fill email if saved locally
  const savedEmail = localStorage.getItem("userEmail");
  if (savedEmail) {
    emailInput.value = savedEmail;
    fetchPreferences(savedEmail);
  }

  // Save email locally on input
  emailInput.addEventListener("input", function () {
    const email = emailInput.value;
    localStorage.setItem("userEmail", email);
    fetchPreferences(email); // Fetch preferences if email changes
  });

    // Refresh YouTube page
    refreshPageButton.addEventListener("click", function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.reload(tabs[0].id);
      });
    });
  

  // Listen for form submission to save email and send message to background script
  preferencesForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = emailInput.value;
    localStorage.setItem("userEmail", email);
    fetchPreferences(email); // Fetch preferences after saving email

    // Send message to background script
    chrome.runtime.sendMessage({ action: 'saveEmail', email });
  });
});
