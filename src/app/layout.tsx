import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ['latin'] });
const defaultUrl = process?.env?.NEXT_PUBLIC_SITE_URL ??
  process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
  process?.env?.VERCEL_URL ??
  'http://localhost:3000/';
// Make sure to include `https://` when not localhost.
const siteUrl = defaultUrl.startsWith('http')
  ? defaultUrl
  : `https://${defaultUrl}`;

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};
export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Which Choice - Image Comparison Tool',
  description: 'A simple tool to help you make decisions by comparing images side by side with beautiful layouts',
  keywords: [
    "Which Choice",
    "Image Comparison",
    "A/B Testing",
    "Visual Comparison",
    "Decision Making",
    "Image Tool",
    "Next.js",
    "React",
    "Tailwind CSS",
  ],
  authors: [
    {
      name: "creeponsky",
      url: "https://creeponsky.com",
    },
  ],
  creator: "Which-Choice", // 请替换成你的品牌名
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Which Choice - Image Comparison Tool",
    description: "Compare images side by side and make better decisions with beautiful layouts",
    siteName: "Which Choice",
    images: [
      {
        url: siteUrl + "/assets/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Which Choice - Image Comparison Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Which Choice - Image Comparison Tool",
    description: "Compare images side by side and make better decisions with beautiful layouts",
    images: [siteUrl + "/assets/images/og-image.png"],
    creator: "@creeponsky", // 请替换成你的 Twitter 用户名
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/assets/svg/favicon.svg",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/assets/svg/favicon.svg" />
        <link rel="alternate icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}