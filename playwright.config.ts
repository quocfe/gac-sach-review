import { defineConfig, devices } from "@playwright/test";
const port = Number(process.env.E2E_PORT || 3217);
export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    ...devices["Desktop Chrome"],
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npm run ${process.env.E2E_PRODUCTION ? "start" : "dev"} -- ${process.env.E2E_PRODUCTION ? "" : "--webpack"} --port ${port}`,
    url: `http://127.0.0.1:${port}/api/health`,
    reuseExistingServer: false,
  },
});
