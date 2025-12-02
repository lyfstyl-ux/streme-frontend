import type { Metadata } from "next";
import localFont from "next/font/local";
import ClientLayout from "./ClientLayout";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { PostHogProvider } from "../components/providers/PostHogProvider";



const poppinsRounded = localFont({
  src: "../../public/fonts/PoppinsRounded-Rounded_1760960791858.ttf",
  variable: "--font-poppins-rounded",
  display: "swap",
});

export const metadata: Metadata = {
  title: "youBuidl",
  description: "Explore, trade and get rewards trading Public Goods",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="youbuidl">
      <head>
        {/* Performance hint for Farcaster Quick Auth server, per docs */}
        <link rel="preconnect" href="https://auth.farcaster.xyz" />
        {/* App manifest and social/meta tags for the youBuidl brand */}
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="description" content="Explore, trade and get rewards trading Public Goods" />
        <meta property="og:title" content="youBuidl" />
        <meta property="og:description" content="Explore, trade and get rewards trading Public Goods" />
        <meta property="og:image" content="/android-chrome-512x512.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="youBuidl" />
        <meta name="twitter:description" content="Explore, trade and get rewards trading Public Goods" />
        <meta name="twitter:image" content="/android-chrome-512x512.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize theme before the page renders
              (function() {
                const theme = localStorage.getItem('theme') || 
                            (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.setAttribute('data-theme', theme);
              })();

              // Initialize Eruda debugging console early if debug=true or in development
              (function() {
                const urlParams = new URLSearchParams(window.location.search);
                const isDebug = urlParams.get('debug') === 'true';
                const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                
                if (isDebug || isDev) {
                  const script = document.createElement('script');
                  script.src = 'https://cdn.jsdelivr.net/npm/eruda';
                  script.onload = function() {
                    window.eruda.init();
                    console.log('🐛 Eruda debugging console initialized (early load)');
                  };
                  document.head.appendChild(script);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${poppinsRounded.variable} antialiased pb-4`}>
        <PostHogProvider>
          <ClientLayout>{children}</ClientLayout>
        </PostHogProvider>
      </body>
    </html>
  );
}
