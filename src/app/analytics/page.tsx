import { getAnalyticsMetrics } from '@/actions/analytics';
import DashboardClient from './DashboardClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Analytics Command Center',
    robots: 'noindex, nofollow', // Private internal page
};

// Force dynamic rendering so we always get fresh data
export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AnalyticsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const daysParam = params.days;
    // Default to 7 days if not specified
    const days = daysParam ? parseInt(String(daysParam)) : 7;

    const data = await getAnalyticsMetrics(days);

    return <DashboardClient data={data} initialDays={days} />;
}
