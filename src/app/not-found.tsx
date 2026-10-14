import Link from "next/link";
import { Header } from "@/components/book-ui";
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className="page">
        <div className="empty">
          <p className="eyebrow">404 / TRANG CHƯA TỒN TẠI</p>
          <h1>Trang sách chưa có ở đây</h1>
          <p>
            Có thể đường dẫn đã thay đổi. Ghé thư viện để tìm một cuốn sách khác
            nhé.
          </p>
          <Link className="button" href="/discover">
            Về thư viện
          </Link>
        </div>
      </main>
    </>
  );
}
