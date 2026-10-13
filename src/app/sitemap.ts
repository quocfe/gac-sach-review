import type { MetadataRoute } from 'next'; import { books } from '@/lib/catalog';
export default function sitemap(): MetadataRoute.Sitemap { const base='https://mocban.example'; return [{url:base,lastModified:new Date()},...books.map(book=>({url:`${base}/books/${book.slug}`,lastModified:new Date()}))]; }
