# Gamo Launchpad

<div align="center">
  <h3>The Ultimate Web Proxy & Launchpad</h3>
  <p>A modern web proxy with a sleek UI and privacy features.</p>
</div>

---

> **Important:** If you fork this project, consider giving it a star in the original repository!

## Features
- **Tab Cloaking** - Disguise your browsing activity
- **Wide Collection** - Extensive apps & games library
- **Clean UI** - Easy to use interface
- **Inspect Element** - Built-in developer tools
- **Various Themes** - Customize your experience
- **Password Protection** - Optional security layer
- **Built-in Tab System** - Seamless multitasking
- **Now.gg Support** - Cloud gaming integration
- **Fast Speeds** - Optimized performance
- **Geforce NOW Support** - Enhanced gaming capabilities

---

## Deployment

> **Important:** You cannot deploy to static web hosts, including Netlify, Cloudflare Pages, and GitHub Pages.

### GitHub Codespaces

> **Note:** If you're setting the port below 1023, you must run `sudo PORT=1023`

#### Setup Instructions

1. **Create a GitHub account** if you haven't already

2. **Launch Codespace**
   - Click "Code" (green button)
   - Select "Create Codespace on main"

3. **Install & Start**
   - In the terminal at the bottom, paste:
   ```bash
   pnpm i && pnpm start
   ```

4. **Make Public**
   - Respond to the application popup by clicking "Make public"
   
   > **Important:** Make sure you click the "Make public" button, or the proxy won't function properly. If you get a Range Error, go back and make sure you clicked Make public!

5. **Access Your Deployment**
   - Access the deployed website from the ports tab
   - For subsequent uses in the same codespace, just run `pnpm start`

#### Troubleshooting

<div style="background: #f6f8fa; padding: 15px; border-radius: 6px; margin: 15px 0;">

**If there is no popup:**

1. Run `pnpm i`, and before `pnpm start`, prepend `PORT=8080`, replacing 8080 with another port
   ```bash
   PORT=6969 pnpm start
   ```

2. If this does not work, prepend `$env:PORT=8080;`:
   ```bash
   $env:PORT=6969; pnpm start
   ```

3. Navigate to the ports tab
4. Click "Forward A Port" and type the port number
5. Right-click "Visibility" and set Port Visibility to Public

</div>

---

## Contributing

We welcome contributions! Please check out our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to get involved.

---

## Report Issues

If you encounter problems, open an issue on GitHub, and we'll address it promptly.

> **Tip:** If you're having trouble, don't hesitate to reach out to us on Discord for personalized support.

---

## Credits

A huge thanks goes out to all of the people who have contributed to this project.

---

## License

This project is licensed under the MIT license. See [LICENSE](LICENSE) for details.

---

<div align="center">
  <sub>Built with ❤️ by the Gamo Launchpad team</sub>
</div>