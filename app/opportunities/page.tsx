import OpportunitiesClient from "@/app/opportunities/OpportunitiesClient";

export default async function OpportunitiesPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  return <OpportunitiesClient initialCategory={params.category ?? ""} initialQuery={params.q ?? ""} />;
}
