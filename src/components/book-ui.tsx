"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, genres, searchBooks } from "@/lib/catalog";
import { useEffect, useRef, useState } from "react";
import { BookOpen, Menu, X, ArrowUpRight } from "lucide-react";

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Đến nội dung chính
      </a>
      <header
        className="site-header"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            toggle.current?.focus();
          }
        }}
      >
        <Link className="brand" href="/" aria-label="Gác Sách — Trang chủ">
          <BookOpen size={28} strokeWidth={1.5} />
          <span>
            Gác Sách<small>ĐỌC SÂU HƠN. CÙNG NHAU.</small>
          </span>
        </Link>
        <button
          ref={toggle}
          className="menu-toggle"
          type="button"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav
          id="main-nav"
          aria-label="Điều hướng chính"
          className={open ? "nav-open" : ""}
        >
          {[
            ["/", "Trang chủ"],
            ["/discover", "Khám phá"],
            ["/me/bookshelf", "Tủ sách"],
            ["/admin", "Quản trị"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={
                (href === "/" ? path === href : path.startsWith(href))
                  ? "page"
                  : undefined
              }
            >
              {label}
            </Link>
          ))}
          <span className="demo">Bản trải nghiệm</span>
        </nav>
      </header>
    </>
  );
}

export function Cover({
  book,
  small = false,
}: {
  book: Book;
  small?: boolean;
}) {
  return (
    <div
      role="img"
      aria-label={`Bìa minh họa, không phải bìa xuất bản: ${book.title}`}
      className={`cover ${book.tone} ${small ? "small" : ""}`}
    >
      <span className="cover-imprint">GÁC SÁCH / THƯ VIỆN</span>
      <span className="cover-rule" aria-hidden="true" />
      <strong>{book.title}</strong>
      <em>{book.author}</em>
      <span className="cover-caption">BÌA MINH HỌA · {book.year}</span>
    </div>
  );
}
export function Stars({ value }: { value: number }) {
  return (
    <span className="stars" aria-label={`${value} trên 5`}>
      ★ {value.toFixed(1)}
    </span>
  );
}
export function BookCard({ book }: { book: Book }) {
  return (
    <article className="book-card">
      <Link
        className="cover-link"
        href={`/books/${book.slug}`}
        aria-label={`Xem sách ${book.title}`}
      >
        <Cover book={book} />
        <span className="cover-arrow" aria-hidden="true">
          <ArrowUpRight size={20} />
        </span>
      </Link>
      <div className="card-copy">
        <p className="eyebrow">{book.genres[0]}</p>
        <h3>
          <Link href={`/books/${book.slug}`}>{book.title}</Link>
        </h3>
        <p className="author">{book.author}</p>
        <div className="card-rating">
          <Stars value={book.rating} />
          <small>{book.reviews} review mẫu</small>
        </div>
      </div>
    </article>
  );
}
export function Catalog({
  initialQ = "",
  initialGenre = "",
}: {
  initialQ?: string;
  initialGenre?: string;
}) {
  const results = searchBooks(initialQ, initialGenre);
  return (
    <>
      <form
        action="/discover"
        className="searchbar"
        key={`${initialQ}-${initialGenre}`}
        role="search"
      >
        <label className="search-field" htmlFor="catalog-query">
          Tìm sách hoặc tác giả
          <input
            id="catalog-query"
            name="q"
            defaultValue={initialQ}
            placeholder="Tên sách, tác giả hoặc ISBN…"
            type="search"
          />
        </label>
        <label htmlFor="catalog-genre">
          Thể loại
          <select
            id="catalog-genre"
            aria-label="Thể loại"
            name="genre"
            defaultValue={initialGenre}
          >
            <option value="">Tất cả thể loại</option>
            {!genres.includes(initialGenre) && initialGenre && (
              <option>{initialGenre}</option>
            )}
            {genres.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </label>
        <button className="button" type="submit">
          Tìm sách
        </button>
      </form>
      <div className="results-toolbar">
        <p className="result-count" role="status">
          <strong>{results.length} đầu sách</strong>
          {initialQ && ` cho “${initialQ}”`}
          {initialGenre && ` · ${initialGenre}`}
        </p>
        {initialQ || initialGenre ? (
          <Link className="text-link" href="/discover">
            Xóa bộ lọc
          </Link>
        ) : (
          <span className="muted">Sắp theo danh mục biên tập</span>
        )}
      </div>
      <div className="catalog-grid">
        {results.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      {!results.length && (
        <div className="empty">
          <BookOpen size={40} strokeWidth={1} />
          <h2>Chưa tìm thấy đầu sách</h2>
          <p>Thử tên sách ngắn hơn, tên tác giả hoặc bỏ bộ lọc thể loại.</p>
        </div>
      )}
    </>
  );
}
export const shelfLabels: Record<string, string> = {
  want_to_read: "Muốn đọc",
  reading: "Đang đọc",
  read: "Đã đọc",
};
export function RatingBox({ book }: { book: Book }) {
  const [rating, setRating] = useState("");
  const [shelf, setShelf] = useState("");
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState(
    "Chỉ lưu trên trình duyệt này, không ảnh hưởng điểm cộng đồng.",
  );
  useEffect(() => {
    try {
      const value = localStorage.getItem(`rating-${book.id}`) || "";

      setRating(/^[1-5]$/.test(value) ? value : "");
      const stored = localStorage.getItem(`shelf-${book.id}`) || "";
      setShelf(shelfLabels[stored] ? stored : "");
    } catch {
      setMessage(
        "Trình duyệt không cho phép lưu. Thay đổi chỉ tồn tại trong trang này.",
      );
    }
    setReady(true);
  }, [book.id]);
  function save(kind: string, value: string) {
    try {
      localStorage.setItem(`${kind}-${book.id}`, value);
      setMessage("Đã lưu trên trình duyệt này. Không đồng bộ tài khoản.");
    } catch {
      setMessage("Không thể lưu trên thiết bị. Thay đổi sẽ mất khi tải lại.");
    }
  }
  return (
    <aside className="actions">
      <p className="eyebrow">GÓC ĐỌC CỦA BẠN</p>
      <h2>Bạn thấy sách thế nào?</h2>
      <div
        className="rating-buttons"
        role="group"
        aria-label="Đánh giá của bạn"
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            disabled={!ready}
            type="button"
            aria-label={`${n} sao`}
            aria-pressed={rating === String(n)}
            className={Number(rating) >= n ? "selected" : ""}
            onClick={() => {
              setRating(String(n));
              save("rating", String(n));
            }}
            key={n}
          >
            ★
          </button>
        ))}
      </div>
      <p className="field-help">
        {rating ? `Bạn chọn ${rating}/5 sao` : "Chọn từ 1 đến 5 sao"}
      </p>
      <label htmlFor="shelf-status">Thêm vào tủ sách</label>
      <select
        id="shelf-status"
        disabled={!ready}
        value={shelf}
        onChange={(e) => {
          setShelf(e.target.value);
          save("shelf", e.target.value);
        }}
      >
        <option value="">Chưa thêm vào tủ</option>
        {Object.entries(shelfLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <Link className="button" href={`/books/${book.slug}/review`}>
        Viết review <span aria-hidden="true">↗</span>
      </Link>
      <p className="field-help" role="status">
        {message}
      </p>
    </aside>
  );
}
export function Spoiler({ children }: { children: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="spoiler-block">
      <button
        type="button"
        className="spoiler"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? "Ẩn phần tiết lộ nội dung" : "Hiện phần tiết lộ nội dung"}
      </button>
      {open && <p className="spoiler-open prose">{children}</p>}
    </div>
  );
}
