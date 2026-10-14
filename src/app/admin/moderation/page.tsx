"use client";
import { Header } from "@/components/book-ui";
import Link from "next/link";
import { useState } from "react";

type Status = "pending" | "published" | "hidden" | "rejected";
type Audit = {
  actor: string;
  from: Status;
  to: Status;
  at: string;
  note: string;
};
const labels: Record<Status, string> = {
  pending: "Chờ duyệt",
  published: "Đã xuất bản (demo)",
  hidden: "Đã ẩn (demo)",
  rejected: "Đã từ chối (demo)",
};
export default function Moderation() {
  const [status, setStatus] = useState<Status>("pending");
  const [note, setNote] = useState("");
  const [audit, setAudit] = useState<Audit[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function act(next: Status) {
    if (!note.trim()) {
      setError("Cần ghi chú moderator trước khi chuyển trạng thái.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/moderation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ actor: "moderator", status: next, note }),
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json.error);
        return;
      }
      setAudit((a) => [json.audit, ...a]);
      setStatus(next);
      setNote("");
    } catch {
      setError("Không thể kết nối. Ghi chú vẫn được giữ; vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Header />
      <main id="main-content" className="page">
        <Link className="back-link" href="/admin">
          ← Về không gian vận hành
        </Link>
        <p className="eyebrow">QUY TRÌNH KIỂM DUYỆT · DEMO</p>
        <h1>Hàng chờ review.</h1>
        <p className="notice">
          Đây là review mẫu; các thao tác không thay đổi review công khai. Vai
          trò moderator được giả lập, chưa có xác thực. Nhật ký trên trang không
          được lưu qua lần tải lại.
        </p>
        <div className="admin-grid">
          <section className="admin-card">
            <span className="status-badge" role="status">
              {busy ? "Đang xử lý…" : labels[status]}
            </span>
            <p className="eyebrow">DẾ MÈN PHIÊU LƯU KÝ · REVIEW MẪU</p>
            <h2>Một chuyến đi vẫn còn vang lại</h2>
            <p>
              Review demo cần được xem xét trước khi xuất hiện công khai. Không
              xóa cứng nội dung từ giao diện kiểm duyệt.
            </p>
            <hr />
            <label htmlFor="moderator-note">Ghi chú moderator</label>
            <p className="field-help" id="note-help">
              Bắt buộc cho mỗi thao tác. Ghi rõ lý do và căn cứ xử lý.
            </p>
            <textarea
              id="moderator-note"
              aria-describedby="note-help"
              aria-invalid={!!error}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Lý do và căn cứ xử lý"
            />
            {error && (
              <p className="notice" role="alert">
                {error}
              </p>
            )}
            <div className="moderation-actions">
              <button
                className="button"
                disabled={busy}
                onClick={() => act("published")}
              >
                Xuất bản
              </button>
              <button
                className="button secondary"
                disabled={busy}
                onClick={() => act("hidden")}
              >
                Ẩn
              </button>
              <button
                className="button secondary"
                disabled={busy}
                onClick={() => act("rejected")}
              >
                Từ chối
              </button>
            </div>
          </section>
          <section className="admin-card">
            <p className="eyebrow">NHẬT KÝ TRONG PHIÊN</p>
            <h2>Lịch sử xử lý</h2>
            {audit.length ? (
              <ul>
                {audit.map((a, i) => (
                  <li className="audit-entry" key={i}>
                    <strong>
                      {labels[a.from]} → {labels[a.to]}
                    </strong>
                    <p>{a.note}</p>
                    <small>
                      {a.actor} · {a.at}
                    </small>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty">
                <h3>Chưa có thao tác</h3>
                <p>
                  Sau mỗi lần xử lý, trạng thái và ghi chú sẽ xuất hiện ở đây.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
