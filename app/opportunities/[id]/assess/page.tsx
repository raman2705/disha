import { notFound } from "next/navigation";
import AssessmentClient from "@/app/opportunities/[id]/assess/AssessmentClient";
import { getOpportunity, opportunities } from "@/lib/opportunities";

export function generateStaticParams() {
  return opportunities.map((opportunity) => ({ id: opportunity.id }));
}

export default async function AssessmentPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ask?: string }>;
}) {
  const { id } = await params;
  const { ask } = await searchParams;
  const opportunity = getOpportunity(id);

  if (!opportunity) {
    notFound();
  }

  return <AssessmentClient opportunity={opportunity} initialAsk={ask ?? ""} />;
}
