import Composer from '@/components/review-composer';
export const instant = false;
export default async function ReviewPage({params}:{params:Promise<{slug:string}>}){return <Composer slug={(await params).slug}/>;}
