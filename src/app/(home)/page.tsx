import type { Metadata } from 'next';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'WasteWave: Waste Management System',
  keywords: ['WasteWave', 'Waste Management System', 'Waste Management System UI', 'Waste Management System UI Kit', 'Waste Management System UI Kit UI'],
  description:
    'WasteWave is a billing system for ISPs, built on the newest version of Material-UI ©, ready to be customized to your style',
  openGraph: {
    title: 'WasteWave: Waste Management System',
    description: 'WasteWave is a billing system for ISPs, built on the newest version of Material-UI ©, ready to be customized to your style',
    type: 'website',
    url: 'https://WasteWave.com',
    siteName: 'WasteWave',
    images: [
      {
        url: 'https://WasteWave.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WasteWave: Waste Management System',
      },
    ],
  },
  twitter: {
    title: 'WasteWave: Waste Management System',
    description: 'WasteWave is a billing system for ISPs, built on the newest version of Material-UI ©, ready to be customized to your style',
    card: 'summary_large_image',
    images: [
      {
        url: 'https://WasteWave.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WasteWave: Waste Management System',
      },
    ],
  },
};

export default function Page() {
  return <HomeView />;
}
