# 🚀 Steam Workshop Mod Update Checker

A tool to check for updates to Steam Workshop mods, ensuring your favorite mods are always up-to-date.

## ✨ Features

- 🛠️ **Automated Updates**: Regularly checks for updates to your subscribed Steam Workshop mods.
- ⚙️ **Easy Configuration**: Simple configuration file to set up your mod list and check frequency.
- 🔔 **Notifications**: Get notified when there are updates available for your mods.

## 📦 Packages

- [`sqlite3`](https://www.npmjs.com/package/sqlite3): For database management.
- [`steam-client`](https://www.npmjs.com/package/steam-client): For interacting with the Steam network.
- [`steam-webapi`](https://www.npmjs.com/package/steam-webapi): For making HTTP requests to the Steam Web API.
- [`steam-workshop-scraper`](https://www.npmjs.com/package/steam-workshop-scraper): For scraping data from the Steam Workshop.

## 📥 Installation

1. Clone the repository:
    ```
    git clone https://github.com/jonxmitchell/steam-workshop-mod-update-checker.git
    cd steam-workshop-mod-update-checker
    ```

2. Install the dependencies:
    ```
    npm install
    ```

## 🛠️ Configuration

1. Create a `config.json` file in the root directory with the following structure:
    ```json
    {
      "steamApiKey": "YOUR_STEAM_API_KEY",
      "modIds": [
        "MOD_ID_1",
        "MOD_ID_2"
      ],
      "checkInterval": 60
    }
    ```
    - `steamApiKey`: Your Steam API key.
    - `modIds`: An array of Steam Workshop mod IDs to check.
    - `checkInterval`: Interval in minutes to check for updates.

## 🚀 Usage

Run the script to start checking for mod updates:
```
node index.js
```


## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes.
4. Push to your branch and submit a pull request.

## 📄 License

This project is licensed under the MIT License. 

Copyright 2024 jonxmitchell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## 📬 Contact

For any issues or questions, please open an issue on GitHub.

---

Developed by [jonxmitchell](https://github.com/jonxmitchell)
