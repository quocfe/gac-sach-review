import { Header, BookCard } from '@/components/book-ui';
export const instant = false;
import { books } from '@/lib/catalog';
import { notFound } from 'next/navigation';
export default async function Author({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params; const all=books.filter(b=>b.authorSlug===slug);
 if(!all.length) notFound();
 return <><Header/><main className="page"><p className="eyebrow">TÁC GIẢ</p><h1>{all[0].author}</h1><p className="intro">Các tác phẩm trong catalog biên tập của Gác Sách.</p><div className="catalog-grid">{all.map(b=><BookCard key={b.id} book={b}/>)}</div></main></>;
}
