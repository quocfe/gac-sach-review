import type { Metadata } from 'next'; import './globals.css';
export const metadata: Metadata = { title:'Gác Sách Review', description:'Cộng đồng review sách Việt Nam' };
export default function Layout({children}:{children:React.ReactNode}){return <html lang="vi"><body>{children}</body></html>}
