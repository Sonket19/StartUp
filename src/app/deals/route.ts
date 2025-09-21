
import { NextResponse } from 'next/server';
import { allAnalysisData } from '@/lib/mock-data';

export async function GET() {
  // In a real application, you would fetch this data from a database
  // or a real backend service.
  try {
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return NextResponse.json(allAnalysisData);
  } catch (error) {
    console.error("Failed to fetch deals:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
