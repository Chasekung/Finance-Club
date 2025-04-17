import { CorporateFinanceContent } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export async function getCorporateFinanceContent(id: string): Promise<CorporateFinanceContent> {
  const response = await fetch(`${API_BASE_URL}/api/corporate-finance/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch content');
  }
  return response.json();
}

export async function updateCorporateFinanceContent(id: string, data: Partial<CorporateFinanceContent>): Promise<CorporateFinanceContent> {
  const response = await fetch(`${API_BASE_URL}/api/corporate-finance/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update content');
  }
  return response.json();
}

export async function deleteCorporateFinanceContent(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/corporate-finance/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete content');
  }
} 