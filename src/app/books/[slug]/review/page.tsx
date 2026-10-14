import Composer from "@/components/review-composer";
import { bySlug } from "@/lib/catalog";
import { notFound } from "next/navigation";
export const instant = false;
export default async function ReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!bySlug(slug)) notFound();
  return <Composer slug={slug} />;
}
