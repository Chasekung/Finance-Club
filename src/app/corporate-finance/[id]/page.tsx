import CorporateFinanceClient from './CorporateFinanceClient';

export async function generateStaticParams() {
  // Fetch all corporate finance content IDs
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/corporate-finance`);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  
  // Extract all IDs from the content
  const ids = Object.values(data.content)
    .flat()
    .map((item: any) => item.id);
  
  return ids.map((id) => ({
    id: id.toString(),
  }));
}

export default function CorporateFinancePage({ params }: { params: { id: string } }) {
  return <CorporateFinanceClient id={params.id} />;
} 