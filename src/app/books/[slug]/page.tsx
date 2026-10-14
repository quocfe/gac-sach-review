import type { Metadata } from "next";
import { ReportReview } from "@/components/ReportReview";
import { Header, Cover, RatingBox, Spoiler } from "@/components/book-ui";
import { bySlug } from "@/lib/catalog";
import Link from "next/link";
import { notFound } from "next/navigation";
export const instant = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const b = bySlug((await params).slug);
  if (!b) return {};
  return {
    title: b.title,
    description: b.blurb,
    alternates: { canonical: `/books/${b.slug}` },
    openGraph: {
      title: `${b.title} — ${b.author}`,
      description: b.blurb,
      type: "book",
    },
  };
}
export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const b = bySlug((await params).slug);
  if (!b) return notFound();
  return (
    <>
      <Header />
      <main id="main-content" className="detail-page">
        <Link className="back-link" href="/discover">
          ← Khám phá sách
        </Link>
        <div className="detail">
          <div className="detail-cover">
            <Cover book={b} />
            <p>
              Bìa minh họa bằng chữ.
              <br />
              Không phải bìa xuất bản chính thức.
            </p>
          </div>
          <div className="book-summary">
            <p className="eyebrow">
              {b.genres[0]} · {b.year}
            </p>
            <h1>{b.title}</h1>
            <p className="author">
              Tác giả <Link href={`/authors/${b.authorSlug}`}>{b.author}</Link>
            </p>
            <p className="stars">
              ★ {b.rating.toFixed(1)}{" "}
              <small> / 5 · {b.ratingCount} đánh giá mẫu</small>
            </p>
            <p className="blurb">{b.blurb}</p>
            <p className="book-meta">
              {b.language} · {b.editions.length} ấn bản trong danh mục
            </p>
          </div>
          <RatingBox book={b} />
          <div className="detail-extras">
            <section aria-labelledby="editions-heading">
              <h2 id="editions-heading">Tìm hiểu ấn bản</h2>
              <p className="field-help">
                Thông tin ấn bản và ISBN là dữ liệu minh họa, không dùng để đặt
                mua.
              </p>
              <ul className="edition-list">
                {b.editions.map((e) => (
                  <li key={e.id}>
                    <strong>
                      {e.publisher} · {e.year}
                    </strong>
                    <span>
                      {e.language} · ISBN {e.isbn}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
            <section
              className="review-section"
              aria-labelledby="reviews-heading"
            >
              <p className="eyebrow">CÙNG ĐỌC, CÙNG CHIA SẺ</p>
              <h2 id="reviews-heading">Góc nhìn bạn đọc</h2>
              <p className="field-help">
                Review bên dưới là nội dung mẫu để trải nghiệm giao diện.
              </p>
              <article className="review">
                <p className="eyebrow">LINH TRẦN · REVIEW MẪU</p>
                <h3>Một chuyến đi vẫn còn vang lại</h3>
                <p>
                  {b.blurb} Cuốn sách có nhịp kể điềm tĩnh và nhiều chi tiết
                  khiến tôi muốn ghi lại.
                </p>
                <Spoiler>
                  Đoạn kết và lựa chọn của nhân vật chính thay đổi cách nhìn về
                  toàn bộ hành trình.
                </Spoiler>
                <ReportReview reviewId={`published-${b.id}`} />
              </article>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
