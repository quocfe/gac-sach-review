import { Catalog, Header } from '@/components/book-ui';
export const instant = false;
export default async function Discover({searchParams}:{searchParams:Promise<{q?:string;genre?:string}>}){const p=await searchParams;return <><Header/><main className="page"><p className="eyebrow">CATALOG ĐÃ BIÊN TẬP</p><h1>Khám phá sách</h1><p className="intro">Tìm theo tựa, tác giả hoặc ISBN. Các đầu sách được phân biệt giữa tác phẩm và ấn bản.</p><Catalog initialQ={p.q} initialGenre={p.genre}/></main></>}
