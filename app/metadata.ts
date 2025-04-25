import { Metadata } from "next";

// SEO Metadata (exported for App Router)
export const metadata: Metadata = {
    title: 'Wastewave  | Efficient Waste Management',
    description: 'A modern platform for managing waste efficiently. Track, analyze, and optimize waste processes with real-time insights.',
    keywords: 'waste management, dashboard, real-time analytics, sustainability',
    openGraph: {
      title: 'Wastewave',
      description: 'Manage waste smarter with our cutting-edge tech.',
      url: 'https://yourdomain.com', // Replace with your actual domain
      type: 'website',
      images: [
        {
          url: 'https://yourdomain.com/og-image.jpg', // Replace with your OG image
          width: 1200,
          height: 630,
          alt: 'Wastewave Dashboard Preview',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Wastewave',
      description: 'Efficient waste management at your fingertips.',
      images: 'https://yourdomain.com/twitter-image.jpg', // Replace with your Twitter image
    },
  }