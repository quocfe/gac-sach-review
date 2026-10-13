# Lighthouse baseline

Recorded locally against the production Next server at `http://127.0.0.1:3200/` with Lighthouse and Playwright Chromium.

- Performance: **0.95**
- Accessibility: **0.95**
- Best practices: **1.00**
- SEO: **0.63**
- First Contentful Paint: **0.8 s**
- Largest Contentful Paint: **1.8 s**
- Cumulative Layout Shift: **0**

The raw Lighthouse JSON is deliberately gitignored (`reports/*.json`) because it is a generated ~600KB artifact. Reproduce with:

```bash
npm run build
npm run start -- --port 3200
CHROME_PATH="$(node -e "const { chromium } = require('playwright'); process.stdout.write(chromium.executablePath())")" \
  npx --yes lighthouse http://127.0.0.1:3200 --output=json --output-path=reports/lighthouse-home.json \
  --chrome-flags='--headless --no-sandbox'
```
