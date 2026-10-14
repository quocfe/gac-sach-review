import { test, expect } from "@playwright/test";

for (const [query, title] of [
  ["nguyen nhat anh", "Mắt Biếc"],
  ["978-604-100004", "Dune"],
]) {
  test(`catalog searches ${query}`, async ({ page }) => {
    await page.goto("/discover");
    await page.getByLabel("Tìm sách hoặc tác giả").fill(query);
    await page.getByRole("button", { name: "Tìm sách", exact: true }).click();
    await expect(page.locator(".book-card")).toHaveCount(1);
    await expect(page.locator(".book-card h3")).toHaveText(title);
  });
}

test("mobile book actions appear before edition and review sections", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/books/de-men-phieu-luu-ky");
  const action = await page.locator(".actions").boundingBox();
  const editions = await page
    .getByRole("heading", { name: "Tìm hiểu ấn bản" })
    .boundingBox();
  expect(action!.y).toBeLessThan(editions!.y);
});

test("report network failure preserves choices and explains retry", async ({
  page,
}) => {
  await page.route("**/api/reports", (route) => route.abort());
  await page.goto("/books/de-men-phieu-luu-ky");
  await page.getByRole("button", { name: "Báo cáo review" }).click();
  await page.getByLabel("Ghi chú báo cáo").fill("Ghi chú cần giữ");
  await page
    .getByRole("button", { name: "Tiết lộ nội dung", exact: true })
    .click();
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "Không thể gửi báo cáo",
  );
  await expect(page.getByLabel("Ghi chú báo cáo")).toHaveValue(
    "Ghi chú cần giữ",
  );
});

test("moderation records demo transition and preserves failed notes", async ({
  page,
}) => {
  await page.goto("/admin/moderation");
  await page
    .getByLabel("Ghi chú moderator")
    .fill("Đã đọc và kiểm tra nội dung mẫu.");
  await page.getByRole("button", { name: "Xuất bản", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Đã xuất bản (demo)");
  await expect(page.locator(".audit-entry")).toContainText(
    "Đã đọc và kiểm tra nội dung mẫu.",
  );
  await page.route("**/api/admin/moderation", (route) => route.abort());
  await page.getByLabel("Ghi chú moderator").fill("Ghi chú chưa gửi");
  await page.getByRole("button", { name: "Ẩn", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "Không thể kết nối",
  );
  await expect(page.getByLabel("Ghi chú moderator")).toHaveValue(
    "Ghi chú chưa gửi",
  );
});

test("repeated query parameters do not crash catalog", async ({ page }) => {
  await page.goto("/discover?q=de+men&q=dune&genre=&genre=Kinh+điển");
  await expect(page.getByLabel("Tìm sách hoặc tác giả")).toHaveValue("de men");
  await expect(page.locator(".book-card")).toHaveCount(1);
});

test("missing book composer offers a recovery path", async ({ page }) => {
  await page.goto("/books/does-not-exist/review");
  await expect(
    page.getByRole("heading", { name: "Trang sách chưa có ở đây" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Về thư viện" }).click();
  await expect(
    page.getByRole("heading", { name: "Khám phá sách" }),
  ).toBeVisible();
});

test("blocked local storage keeps editor usable and reports failed saving", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage blocked");
      },
    });
  });
  await page.goto("/books/de-men-phieu-luu-ky/review");
  await page
    .getByLabel("Tiêu đề review", { exact: true })
    .fill("Vẫn viết được");
  await expect(page.getByRole("status")).toContainText(
    "Không thể lưu trên thiết bị",
  );
  await expect(page.getByLabel("Tiêu đề review", { exact: true })).toHaveValue(
    "Vẫn viết được",
  );
});

test("mobile navigation identifies current page and opens every destination", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Mở menu" }).click();
  await page
    .getByRole("navigation", { name: "Điều hướng chính" })
    .getByRole("link", { name: "Khám phá" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Khám phá sách", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Mở menu" }).click();
  await expect(
    page
      .getByRole("navigation", { name: "Điều hướng chính" })
      .getByRole("link", { name: "Khám phá" }),
  ).toHaveAttribute("aria-current", "page");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Mở menu" })).toBeFocused();
});

test("local rating and shelf restore after reload without hydration errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("/books/de-men-phieu-luu-ky");
  await page.getByRole("button", { name: "4 sao", exact: true }).click();
  await page
    .getByLabel("Thêm vào tủ sách", { exact: true })
    .selectOption("reading");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "4 sao", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByLabel("Thêm vào tủ sách", { exact: true }),
  ).toHaveValue("reading");
  await page.goto("/me/bookshelf");
  await expect(
    page.getByRole("heading", { name: "Dế Mèn Phiêu Lưu Ký" }),
  ).toBeVisible();
  await expect(page.getByText("Đang đọc", { exact: true })).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Dế Mèn Phiêu Lưu Ký" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("admin explicitly discloses demo and disables unimplemented controls", async ({
  page,
}) => {
  await page.goto("/admin");
  await expect(
    page.getByRole("button", { name: "Thêm tác phẩm" }),
  ).toBeDisabled();
  await expect(page.getByText(/Chưa có xác thực/)).toBeVisible();
  await page.getByRole("link", { name: "Mở hàng chờ" }).click();
  await expect(page.getByText(/không thay đổi review công khai/)).toBeVisible();
});

test("composer restores draft and edition, previews safely, never claims submission", async ({
  page,
}) => {
  await page.goto("/books/de-men-phieu-luu-ky/review");
  await page
    .getByLabel("Tiêu đề review", { exact: true })
    .fill("Một hành trình nhỏ");
  await page
    .getByLabel("Nội dung review", { exact: true })
    .fill("Những trang sách ở lại. <script>alert(1)</script>");
  await page
    .getByLabel("Nội dung spoiler", { exact: true })
    .fill("Một kết thúc để ngẫm.");
  await page.getByLabel("Ấn bản đã đọc", { exact: true }).selectOption("e1b");
  await page.getByRole("button", { name: "Xem trước", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Một hành trình nhỏ" }),
  ).toBeVisible();
  await expect(
    page.getByText("Những trang sách ở lại. <script>alert(1)</script>", {
      exact: true,
    }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Tiêu đề review", { exact: true })).toHaveValue(
    "Một hành trình nhỏ",
  );
  await expect(page.getByLabel("Ấn bản đã đọc", { exact: true })).toHaveValue(
    "e1b",
  );
  await expect(
    page.getByRole("button", { name: "Gửi để duyệt" }),
  ).toBeDisabled();
  await expect(page.getByText(/Chưa kết nối gửi bài/)).toBeVisible();
  await page.getByLabel("Tiêu đề review", { exact: true }).fill("");
  await page.getByLabel("Nội dung review", { exact: true }).fill("");
  await page.getByLabel("Nội dung spoiler", { exact: true }).fill("");
  await page.reload();
  await expect(page.getByLabel("Tiêu đề review", { exact: true })).toHaveValue(
    "",
  );
});

test("composer recovers from malformed saved data", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem("draft-de-men-phieu-luu-ky", "{broken"),
  );
  await page.goto("/books/de-men-phieu-luu-ky/review");
  await expect(
    page.getByLabel("Tiêu đề review", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText(
    "Không đọc được bản nháp",
  );
});

test("search and genre survive submission, reload, clear and history", async ({
  page,
}) => {
  await page.goto("/discover");
  await page.getByLabel("Tìm sách hoặc tác giả").fill("de men");
  await page.getByRole("button", { name: "Tìm sách", exact: true }).click();
  await expect(page).toHaveURL(/q=de\+men/);
  await page
    .getByLabel("Thể loại", { exact: true })
    .selectOption("Văn học Việt Nam");
  await page.getByRole("button", { name: "Tìm sách", exact: true }).click();
  await expect(page.locator(".book-card")).toHaveCount(1);
  await page.reload();
  await expect(page.getByLabel("Tìm sách hoặc tác giả")).toHaveValue("de men");
  await expect(page.getByLabel("Thể loại", { exact: true })).toHaveValue(
    "Văn học Việt Nam",
  );
  await page.getByLabel("Tìm sách hoặc tác giả").fill("zzzzzz");
  await page.getByRole("button", { name: "Tìm sách", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Chưa tìm thấy đầu sách" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Xóa bộ lọc", exact: true }).click();
  await expect(page.locator(".book-card")).toHaveCount(20);
  await page.goBack();
  await expect(page.getByLabel("Tìm sách hoặc tác giả")).toHaveValue("zzzzzz");
});
