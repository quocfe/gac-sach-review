import { test, expect } from "@playwright/test";

// All Vietnamese vowel/tone combinations, Đ/đ, and decomposed diacritics.
const vietnamese =
  "aàáảãạăằắẳẵặâầấẩẫậeèéẻẽẹêềếểễệiìíỉĩịoòóỏõọôồốổỗộơờớởỡợuùúủũụưừứửữựyỳýỷỹỵđ";
const sample = `${vietnamese} ${vietnamese.toUpperCase()} ${vietnamese.normalize("NFD")}`;

for (const width of [320, 390, 1440]) {
  test(`self-hosted Vietnamese typography renders without fallback at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const fontRequests: string[] = [];
    const failedFonts: string[] = [];
    page.on("request", (request) => {
      if (request.resourceType() === "font") fontRequests.push(request.url());
    });
    page.on("response", (response) => {
      if (response.request().resourceType() === "font" && !response.ok())
        failedFonts.push(response.url());
    });
    await page.goto("/");
    await expect(page.locator("body")).toHaveCSS(
      "font-family",
      /"Source Sans 3 Variable"/,
    );
    await expect(page.locator("h1")).toHaveCSS(
      "font-family",
      /"Source Serif 4 Variable"/,
    );
    await page.evaluate(() => document.fonts.ready.then(() => undefined));

    // FontFaceSet.check alone can succeed for a missing family. Inspect the
    // fonts actually used to paint every glyph, including normal/bold/italic.
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("DOM.enable");
    await cdp.send("CSS.enable");
    for (const [family, weight, style] of [
      ["Source Sans 3 Variable", "400", "normal"],
      ["Source Sans 3 Variable", "700", "normal"],
      ["Source Serif 4 Variable", "400", "normal"],
      ["Source Serif 4 Variable", "700", "normal"],
      ["Source Serif 4 Variable", "400", "italic"],
    ]) {
      const loaded = await page.evaluate(
        async ({ family, weight, style, sample }) => {
          const faces = await document.fonts.load(
            `${style} ${weight} 24px "${family}"`,
            sample,
          );
          const probe = document.createElement("span");
          probe.id = "font-probe";
          probe.textContent = sample;
          probe.style.cssText = `font: ${style} ${weight} 24px "${family}"; position: fixed; width: 250px; overflow-wrap: anywhere; top: 0; left: 0;`;
          document.body.append(probe);
          return faces.length;
        },
        { family, weight, style, sample },
      );
      expect(
        loaded,
        `${family} ${weight} ${style} loaded faces`,
      ).toBeGreaterThan(0);
      const { root } = await cdp.send("DOM.getDocument");
      const { nodeId } = await cdp.send("DOM.querySelector", {
        nodeId: root.nodeId,
        selector: "#font-probe",
      });
      const { fonts } = await cdp.send("CSS.getPlatformFontsForNode", {
        nodeId,
      });

      expect(fonts.length).toBeGreaterThan(0);
      for (const font of fonts) {
        expect(
          font.isCustomFont,
          `${family}: unexpected fallback ${font.familyName}`,
        ).toBe(true);
        expect(font.familyName).toContain(family.replace(" Variable", ""));
      }
      await page.locator("#font-probe").evaluate((node) => node.remove());
    }
    await cdp.detach();

    for (const route of [
      "/",
      "/discover",
      "/books/de-men-phieu-luu-ky",
      "/books/de-men-phieu-luu-ky/review",
    ]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready.then(() => undefined));
      const overflow = await page.evaluate(() => ({
        page: document.documentElement.scrollWidth > innerWidth,
        headings: [...document.querySelectorAll("h1, h2, h3")]
          .filter((heading) => {
            const box = heading.getBoundingClientRect();
            return (
              box.left < 0 ||
              box.right > innerWidth + 1 ||
              heading.scrollWidth > heading.clientWidth + 1
            );
          })
          .map((heading) => heading.textContent),
      }));
      expect(overflow, route).toEqual({ page: false, headings: [] });
    }
    expect(fontRequests.length).toBeGreaterThan(0);
    expect(
      fontRequests.every(
        (url) => new URL(url).origin === new URL(page.url()).origin,
      ),
    ).toBe(true);
    expect(failedFonts).toEqual([]);
  });
}
