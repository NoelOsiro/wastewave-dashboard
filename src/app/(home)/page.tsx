import type { Metadata } from 'next';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'WasteWave: Smart Waste Management System',
  keywords: [
    'WasteWave',
    'Smart Waste Management',
    'Recycling System',
    'Waste Collection Platform',
    'Environmental Sustainability',
    'Waste Tracking Dashboard',
  ],
  description:
    'WasteWave is a modern waste management system designed to streamline waste collection, billing, and tracking operations using data-driven insights and automation.',
  openGraph: {
    title: 'WasteWave: Smart Waste Management System',
    description:
      'WasteWave is a modern waste management platform that helps cities, companies, and individuals manage waste collection, billing, and recycling efficiently.',
    type: 'website',
    url: 'https://wastewave.com',
    siteName: 'WasteWave',
    images: [
      {
        url: 'https://wastewave.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WasteWave: Smart Waste Management System',
      },
    ],
  },
  twitter: {
    title: 'WasteWave: Smart Waste Management System',
    description:
      'WasteWave helps organizations and communities manage waste efficiently through automation, analytics, and billing tools.',
    card: 'summary_large_image',
    images: [
      {
        url: 'https://wastewave.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WasteWave: Smart Waste Management System',
      },
    ],
  },
};

export default function Page() {
  return <HomeView />;
}
