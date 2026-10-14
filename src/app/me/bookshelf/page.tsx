"use client";
import { BookCard, Header, shelfLabels } from "@/components/book-ui";
import { books } from "@/lib/catalog";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Shelf() {
  const [items, setItems] = useState<{ id: string; status: string }[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    try {
      const saved = books.flatMap((b) => {
        const status = localStorage.getItem(`shelf-${b.id}`) || "";
        return shelfLabels[status] ? [{ id: b.id, status }] : [];
      });

      setItems(saved);
    } catch {
      setError(true);
    }
    setReady(true);
  }, []);
  return (
    <>
      <Header />
      <main id="main-content" className="page">
        <p className="eyebrow">GÓC ĐỌC CÁ NHÂN</p>
        <h1>Tủ sách của tôi.</h1>
        <p className="intro">
          Những cuốn muốn đọc, đang đọc và đã khép lại. Một góc nhỏ để giữ nhịp
          đọc của riêng bạn.
        </p>
        <p className="notice">
          Tủ sách lưu trên trình duyệt này, không phải tài khoản trực tuyến.
          Không đồng bộ sang thiết bị khác.
        </p>
        {!ready ? (
          <p role="status">Đang mở tủ sách…</p>
        ) : error ? (
          <div className="empty">
            <h2>Chưa mở được tủ sách</h2>
            <p>
              Trình duyệt đang chặn bộ nhớ cục bộ. Cho phép lưu dữ liệu rồi tải
              lại trang.
            </p>
          </div>
        ) : items.length ? (
          <>
            <div className="section-head">
              <h2>{items.length} cuốn trên kệ</h2>
              <Link className="text-link" href="/discover">
                Tìm thêm sách →
              </Link>
            </div>
            <div className="catalog-grid shelf-grid">
              {items.map((item) => (
                <div key={item.id}>
                  <p className="shelf-state">{shelfLabels[item.status]}</p>
                  <BookCard book={books.find((b) => b.id === item.id)!} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty">
            <h2>Tủ sách đang trống</h2>
            <p>
              Gặp một cuốn sách bạn thích? Mở trang sách và chọn trạng thái đọc
              để đặt lên kệ.
            </p>
            <Link className="button" href="/discover">
              Tìm cuốn sách đầu tiên
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
