import type { Metadata } from "next";
import "./fonts.css";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://mocban.example"),
  title: { default: "Gác Sách Review", template: "%s · Gác Sách Review" },
  description: "Cộng đồng review sách Việt Nam: đọc sâu hơn, cùng nhau.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Gác Sách Review",
    title: "Gác Sách Review",
    description: "Cộng đồng review sách Việt Nam.",
  },
  robots: { index: true, follow: true },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body>
        {children}
        <footer className="site-footer">
          <div>
            <strong>Gác Sách</strong>
            <p>Một khoảng lặng cho sách, một góc nhìn cho bạn.</p>
          </div>
          <div className="footer-note">
            Bản trải nghiệm · Dữ liệu sách, điểm số và review minh họa.
            <br />
            Bìa chữ không phải bìa xuất bản. Chưa có tài khoản trực tuyến.
          </div>
        </footer>
      </body>
    </html>
  );
}
