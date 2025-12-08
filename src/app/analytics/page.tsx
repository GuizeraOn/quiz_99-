import { getAnalyticsMetrics } from '@/actions/analytics';
import DashboardClient from './DashboardClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Analytics Command Center',
    robots: 'noindex, nofollow', // Private internal page
};

// Force dynamic rendering so we always get fresh data
export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
    const data = await getAnalyticsMetrics();

    return <DashboardClient data={data} />;
}
