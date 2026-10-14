"use client";
import { useState } from "react";
const reasons = [
  ["spoiler", "Tiết lộ nội dung"],
  ["harassment", "Quấy rối"],
  ["hate", "Ngôn từ thù ghét"],
  ["spam", "Spam"],
  ["copyright", "Bản quyền"],
  ["other", "Lý do khác"],
] as const;
export function ReportReview({ reviewId }: { reviewId: string }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(reason: string) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reviewId, reason, note }),
      });
      if (!response.ok) {
        setError(
          response.status === 409
            ? "Bạn đã báo cáo review này."
            : response.status === 429
              ? "Bạn thao tác quá nhanh. Vui lòng thử lại sau."
              : "Không thể gửi báo cáo. Vui lòng thử lại.",
        );
        return;
      }
      setMessage(
        "Đã ghi nhận báo cáo demo trong bộ nhớ máy chủ; không lưu bền vững.",
      );
      setOpen(false);
    } catch {
      setError(
        "Không thể gửi báo cáo. Ghi chú vẫn được giữ; vui lòng thử lại.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="report">
      {!open ? (
        <button
          onClick={() => {
            setOpen(true);
            setMessage("");
          }}
        >
          Báo cáo review
        </button>
      ) : (
        <div className="report-box">
          <b>Báo cáo nội dung</b>
          <p className="field-help">
            Chọn lý do để gửi báo cáo demo. Dữ liệu chỉ lưu tạm trong bộ nhớ máy
            chủ.
          </p>
          <input
            aria-label="Ghi chú báo cáo"
            value={note}
            maxLength={500}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ghi chú (tùy chọn)"
          />
          {reasons.map(([value, label]) => (
            <button disabled={busy} key={value} onClick={() => submit(value)}>
              {label}
            </button>
          ))}
          <button
            disabled={busy}
            onClick={() => {
              setOpen(false);
              setError("");
            }}
          >
            Đóng
          </button>
          {busy && <small role="status">Đang gửi…</small>}
        </div>
      )}
      {message && <small role="status">{message}</small>}
      {error && <small role="alert">{error}</small>}
    </div>
  );
}
