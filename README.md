
# YouTube Detox Extension

YouTube Detox is a Chrome extension that helps users filter YouTube recommendations to match their specific interests. By showing only relevant videos, this tool aims to enhance productivity and minimize distractions.
## Features

- User Input: Users can enter their email and preferences via a popup interface.
- Local Storage: User email is saved locally to persist preferences.
- Preference Management: Add, view, and delete preferences in the popup interface.
- Background Script: Communicates with a backend server to fetch and manage user preferences.
- Content Script: Filters YouTube videos by manipulating the DOM to hide videos that do not match the user's preferences. 


## How It Works ?

- Initial Setup: On first use, the user inputs their email and preferences.
- Local Storage Check: If an email is saved locally, preferences are fetched from the backend server.
- DOM Manipulation: The content script filters videos on YouTube based on the user's preferences.
- Dynamic Filtering: As new videos load while scrolling, the extension continues to filter out irrelevant content.
## Screenshots

![App Screenshot](https://res.cloudinary.com/draptrzrc/image/upload/v1720512129/codehelp/dfo8lrl87yrbvqpi5wv4.png)


## Installation


```bash
  Clone the repository.
  Load the extension in Chrome via chrome://extensions.
  Click "Load unpacked" and select the extension directory.
```
    
## Usage

- Click the extension icon to open the popup.
- Enter your email and preferences, then click "Save".
- YouTube Detox will filter your YouTube recommendations based on your preferences.


## Contributing

Contributions are welcome. Please fork the repository and submit pull requests


#

YouTube Detox helps you stay focused by showing only the videos you care about, making your YouTube experience more productive and less distracting.
