
import { Fira_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Wastewave | Efficient Waste Management",
  description: "A modern platform for managing waste efficiently. Track, analyze, and optimize waste processes with real-time insights.",
};

const geistSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // Add weights for flexibility
  variable: '--font-geist-sans', // CSS variable for custom styling
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          
                {children}
             
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
