import { redirect } from "next/navigation";

export default async function ProjectRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/works/${slug}`);
}
