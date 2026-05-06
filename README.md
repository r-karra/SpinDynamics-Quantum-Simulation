<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/e301d0c2-cc22-4ce7-b13a-e430db1745b7

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages (using `main` / `docs`)

1. Install dependencies:
   `npm install`
2. Build the app to the `docs` folder:
   `npm run build`
3. Commit and push the generated `docs/` folder to `main`.
4. In GitHub Pages settings, choose `main` branch and `docs` folder.

Your site should now preview from the `docs` folder on GitHub Pages.
