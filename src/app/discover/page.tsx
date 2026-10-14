import { Catalog, Header } from "@/components/book-ui";
export const instant = false;
export default async function Discover({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; genre?: string | string[] }>;
}) {
  const p = await searchParams;
  return (
    <>
      <Header />
      <main id="main-content" className="page">
        <p className="eyebrow">THƯ VIỆN GÁC SÁCH</p>
        <h1>Khám phá sách</h1>
        <p className="intro">
          Một cuốn sách đúng lúc có thể mở ra cả một thế giới. Tìm theo tên, tác
          giả hoặc ISBN trong danh mục mẫu.
        </p>
        <Catalog
          initialQ={Array.isArray(p.q) ? p.q[0] : p.q}
          initialGenre={Array.isArray(p.genre) ? p.genre[0] : p.genre}
        />
      </main>
    </>
  );
}
