import { Header } from "@/components/book-ui";
import Link from "next/link";
import { books, genres } from "@/lib/catalog";

export default function Admin() {
  return (
    <>
      <Header />
      <main id="main-content" className="page">
        <p className="eyebrow">KHÔNG GIAN VẬN HÀNH · DEMO</p>
        <h1>Chăm chút từng đầu sách.</h1>
        <p className="intro">
          Danh mục tác phẩm, tác giả và quy trình kiểm duyệt trong một không
          gian chung.
        </p>
        <p className="notice">
          Chưa có xác thực hoặc phân quyền tài khoản thật. Đây là giao diện minh
          họa; thêm tác phẩm, tác giả và nhập dữ liệu chưa được kết nối.
        </p>
        <div className="admin-grid">
          <section className="admin-card">
            <p className="eyebrow">01 / DANH MỤC</p>
            <h2>Tác phẩm & ấn bản</h2>
            <p>
              {books.length} tác phẩm mẫu. Mỗi tác phẩm có các ấn bản riêng.
            </p>
            <button
              className="button"
              disabled
              aria-describedby="catalog-disabled"
            >
              Thêm tác phẩm
            </button>
            <p className="field-help" id="catalog-disabled">
              Chưa hỗ trợ chỉnh sửa danh mục trong bản demo.
            </p>
            <ul>
              {books.slice(0, 5).map((b) => (
                <li key={b.id}>
                  <Link href={`/books/${b.slug}`}>
                    {b.title}
                    <span>{b.editions.length} ấn bản ↗</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link className="text-link" href="/discover">
              Xem toàn bộ danh mục →
            </Link>
          </section>
          <section className="admin-card">
            <p className="eyebrow">02 / BIÊN TẬP</p>
            <h2>Kiểm duyệt review</h2>
            <p>
              Thử quy trình duyệt một review mẫu và xem nhật ký chuyển trạng
              thái.
            </p>
            <p>
              Thao tác demo không xuất bản nội dung ra cộng đồng. Nhật ký hiển
              thị chỉ tồn tại trong phiên trang này.
            </p>
            <Link className="button" href="/admin/moderation">
              Mở hàng chờ <span aria-hidden="true">↗</span>
            </Link>
          </section>
          <section className="admin-card">
            <p className="eyebrow">03 / PHÂN LOẠI</p>
            <h2>Tác giả & thể loại</h2>
            <p>
              {new Set(books.map((b) => b.author)).size} tác giả ·{" "}
              {genres.length} thể loại trong dữ liệu mẫu.
            </p>
            <button className="button" disabled>
              Thêm tác giả / thể loại
            </button>
            <ul>
              {genres.map((g) => (
                <li key={g}>
                  <Link href={`/discover?genre=${encodeURIComponent(g)}`}>
                    {g}
                    <span>Khám phá ↗</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section className="admin-card">
            <p className="eyebrow">04 / NGUỒN DỮ LIỆU</p>
            <h2>Nhập sách từ nguồn ngoài</h2>
            <span className="status-badge">Chưa kết nối</span>
            <p>
              Google Books chỉ là nguồn ứng viên. Cần kiểm tra trùng lặp, thông
              tin ấn bản và quyền sử dụng bìa trước khi xuất bản.
            </p>
            <p className="muted">
              Các bìa đang hiển thị là minh họa chữ, không phải bìa xuất bản
              chính thức.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
