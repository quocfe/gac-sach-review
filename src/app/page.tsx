import Link from "next/link";
import { BookCard, Cover, Header } from "@/components/book-ui";
import { books, genres } from "@/lib/catalog";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="home-masthead">
          <span>Một góc nhỏ dành cho người yêu sách</span>
          <span>Tạp chí đọc / Số 01</span>
        </div>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">MỞ MỘT TRANG SÁCH, THÊM MỘT GÓC NHÌN</p>
            <h1>
              Những cuốn sách
              <br />
              <i>ở lại cùng ta.</i>
            </h1>
            <p>
              Giữa những ngày vội vã, dành một khoảng lặng cho trang sách. Tìm
              cuốn tiếp theo và viết lại điều bạn muốn giữ.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/discover">
                Khám phá sách <span aria-hidden="true">↗</span>
              </Link>
              <Link className="text-link" href="/me/bookshelf">
                Ghé tủ sách của bạn
              </Link>
            </div>
          </div>
          <div>
            <Link
              className="hero-still"
              href="/books/de-men-phieu-luu-ky"
              aria-label="Dế Mèn Phiêu Lưu Ký — mở trang sách"
            >
              <Cover book={books[0]} />
              <span className="hero-note">
                Một chuyến đi nhỏ.
                <br />
                Một thế giới rộng.
              </span>
            </Link>
            <div className="hero-figure-caption">
              <span>TRÊN BÀN ĐỌC / 01</span>
              <span>Tô Hoài · Văn học Việt Nam</span>
            </div>
          </div>
        </section>
        <section className="home-section">
          <div className="section-head">
            <div>
              <p className="eyebrow">BẮT ĐẦU TỪ ĐÂY</p>
              <h2>Gợi ý trên bàn đọc</h2>
            </div>
            <Link className="text-link" href="/discover">
              Xem tất cả →
            </Link>
          </div>
          <div className="catalog-grid">
            {books.slice(0, 4).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
        <section className="feature">
          <div>
            <p className="eyebrow">GÓC ĐỌC CHẬM</p>
            <h2>
              Đọc lại những điều
              <br />
              ta tưởng đã biết.
            </h2>
          </div>
          <div>
            <p>
              Không phải cuốn sách nào cũng cần đọc thật nhanh. Có những trang
              cần một lần dừng lại, một dòng ghi chú, một cuộc trò chuyện.
            </p>
            <Link className="text-link" href="/books/de-men-phieu-luu-ky">
              Trở lại cùng Dế Mèn →
            </Link>
          </div>
        </section>
        <section className="genres">
          <div className="section-head">
            <div>
              <p className="eyebrow">LẦN THEO KỆ SÁCH</p>
              <h2>Hôm nay, bạn muốn đọc gì?</h2>
            </div>
          </div>
          <div className="genre-links">
            {genres.map((g) => (
              <Link key={g} href={`/discover?genre=${encodeURIComponent(g)}`}>
                {g} <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
