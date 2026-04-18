# tabswitch-cli

A terminal utility to manage and restore browser tab sessions from the command line.

---

## Installation

```bash
npm install -g tabswitch-cli
```

---

## Usage

Save your current browser tabs as a named session, list saved sessions, or restore them later — all without leaving the terminal.

```bash
# Save current tabs as a session
tabswitch save my-work-session

# List all saved sessions
tabswitch list

# Restore a session in your browser
tabswitch restore my-work-session

# Delete a session
tabswitch delete my-work-session
```

Sessions are stored locally in `~/.tabswitch/sessions.json`.

---

## Supported Browsers

- Google Chrome
- Mozilla Firefox
- Microsoft Edge

---

## Requirements

- Node.js >= 14.x
- A supported browser installed on your system

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)