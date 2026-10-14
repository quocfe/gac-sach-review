"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header, Spoiler } from "@/components/book-ui";
import { bySlug } from "@/lib/catalog";

type Draft = { title: string; body: string; spoiler: string; edition: string };
export default function Composer({ slug }: { slug: string }) {
  const book = bySlug(slug)!;
  const key = `draft-${slug}`;
  const [draft, setDraft] = useState<Draft>({
    title: "",
    body: "",
    spoiler: "",
    edition: book.editions[0].id,
  });
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("Đang mở bản nháp…");
  const [preview, setPreview] = useState(false);
  useEffect(() => {
    // Browser storage is read only after hydration; never render a different server snapshot.
    let restored: Draft | undefined;
    let status = "Bản nháp tự động lưu trên thiết bị này.";
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const value = JSON.parse(raw);
        if (
          !value ||
          ["title", "body", "spoiler"].some(
            (field) => typeof value[field] !== "string",
          )
        )
          throw new Error("Invalid draft");
        restored = {
          title: value.title,
          body: value.body,
          spoiler: value.spoiler,
          edition: book.editions.some((e) => e.id === value.edition)
            ? value.edition
            : book.editions[0].id,
        };
        status = "Đã khôi phục bản nháp trên thiết bị này.";
      }
    } catch {
      status = "Không đọc được bản nháp. Bạn vẫn có thể viết tại đây.";
    }

    if (restored) setDraft(restored);
    setMessage(status);
    setReady(true);
  }, [key, book]);

  function update(field: keyof Draft, value: string) {
    const next = { ...draft, [field]: value };
    setDraft(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
      setMessage("Đã lưu bản nháp trên thiết bị này.");
    } catch {
      setMessage(
        "Không thể lưu trên thiết bị. Hãy sao chép nội dung trước khi rời trang.",
      );
    }
  }

  return (
    <>
      <Header />
      <main id="main-content" className="page composer">
        <Link className="back-link" href={`/books/${slug}`}>
          ← Trở về trang sách
        </Link>
        <p className="eyebrow">GÓC VIẾT · {book.title}</p>
        <h1>Viết điều bạn nghĩ.</h1>
        <p className="intro">
          Không cần một bài phê bình hoàn hảo. Bắt đầu từ điều cuốn sách để lại
          trong bạn.
        </p>
        <div className="composer-layout">
          <div className="editor-panel">
            <div className="editor-toolbar">
              <div className="segmented" aria-label="Chế độ soạn thảo">
                <button
                  type="button"
                  aria-pressed={!preview}
                  onClick={() => setPreview(false)}
                >
                  Soạn thảo
                </button>
                <button
                  type="button"
                  aria-pressed={preview}
                  onClick={() => setPreview(true)}
                >
                  Xem trước
                </button>
              </div>
              <span className="muted">
                {draft.body.trim() ? draft.body.trim().split(/\s+/).length : 0}{" "}
                từ
              </span>
            </div>
            <p className="save-status" role="status">
              {ready ? message : "Đang mở bản nháp…"}
            </p>
            {preview ? (
              <article className="review-preview">
                <p className="eyebrow">BẢN XEM TRƯỚC · CHƯA XUẤT BẢN</p>
                <h2>{draft.title || "Tiêu đề review của bạn"}</h2>
                <p className="prose">
                  {draft.body || "Nội dung bạn viết sẽ xuất hiện ở đây."}
                </p>
                {draft.spoiler && <Spoiler>{draft.spoiler}</Spoiler>}
              </article>
            ) : (
              <form onSubmit={(e) => e.preventDefault()}>
                <fieldset disabled={!ready}>
                  <label htmlFor="review-title">Tiêu đề review</label>
                  <input
                    id="review-title"
                    maxLength={160}
                    value={draft.title}
                    onChange={(e) => update("title", e.target.value)}
                    placeholder="Điều gì ở lại sau trang cuối?"
                  />
                  <label htmlFor="review-body">Nội dung review</label>
                  <p className="field-help" id="body-help">
                    Chia sẻ cảm nhận, điều bạn thích và ai có thể thích cuốn
                    sách này.
                  </p>
                  <textarea
                    id="review-body"
                    aria-describedby="body-help"
                    value={draft.body}
                    onChange={(e) => update("body", e.target.value)}
                    placeholder="Với tôi, cuốn sách này…"
                  />
                  <label htmlFor="review-spoiler">
                    Nội dung spoiler <span className="muted">(tùy chọn)</span>
                  </label>
                  <textarea
                    id="review-spoiler"
                    aria-label="Nội dung spoiler"
                    className="short-textarea"
                    value={draft.spoiler}
                    onChange={(e) => update("spoiler", e.target.value)}
                    placeholder="Đặt chi tiết tiết lộ cốt truyện ở đây để người đọc chủ động mở."
                  />
                  <label htmlFor="review-edition">Ấn bản đã đọc</label>
                  <select
                    id="review-edition"
                    value={draft.edition}
                    onChange={(e) => update("edition", e.target.value)}
                  >
                    {book.editions.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.publisher} · {e.year} · {e.language}
                      </option>
                    ))}
                  </select>
                </fieldset>
              </form>
            )}
            <div className="editor-footer">
              <button
                className="button"
                disabled
                aria-describedby="submission-note"
              >
                Gửi để duyệt
              </button>
              <p id="submission-note">
                Chưa kết nối gửi bài. Bản demo chỉ lưu nháp trên trình duyệt,
                không gửi vào hàng chờ.
              </p>
            </div>
          </div>
          <aside className="writing-guide">
            <p className="eyebrow">MỘT VÀI GỢI Ý</p>
            <h2>
              Viết chậm.
              <br />
              Viết thật.
            </h2>
            <ol>
              <li>Đâu là chi tiết khiến bạn dừng lại?</li>
              <li>Cuốn sách làm bạn nghĩ khác đi thế nào?</li>
              <li>Bạn sẽ tặng nó cho ai?</li>
            </ol>
            <hr />
            <p>
              Tôn trọng góc nhìn khác biệt. Nếu kể về cốt truyện, hãy dùng ô
              spoiler.
            </p>
            <p className="muted">
              Bản nháp không đồng bộ giữa các thiết bị. Xóa dữ liệu trình duyệt
              sẽ làm mất bản nháp.
            </p>
          </aside>
        </div>
      </main>
    </>
  );
}
