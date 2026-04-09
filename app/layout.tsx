import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nebulorions.com"),
  title: "Nebulorion Innovations",
  description: "High-end digital engineering and design agency. Digital Reality, Perfected.",
  openGraph: {
    title: "Nebulorion Innovations",
    description: "Digital Reality, Perfected.",
    url: "https://www.nebulorions.com",
    siteName: "Nebulorion Innovations",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nebulorion Innovations",
    description: "Digital Reality, Perfected.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://www.nebulorions.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const serviceWorkerCleanupScript = `
    (function () {
      if (!('serviceWorker' in navigator)) return;
      var host = window.location.hostname;
      var isLocal = host === 'localhost' || host === '127.0.0.1';
      var isDev = ${JSON.stringify(process.env.NODE_ENV === "development")};
      if (!isLocal && !isDev) return;
      navigator.serviceWorker.getRegistrations()
        .then(function (regs) { return Promise.all(regs.map(function (r) { return r.unregister(); })); })
        .then(function () {
          var reloaded = sessionStorage.getItem('__sw_cleanup_reloaded__');
          if (!reloaded) {
            sessionStorage.setItem('__sw_cleanup_reloaded__', '1');
            window.location.reload();
          }
        })
        .catch(function () {});
    })();
  `;

  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-sans min-h-screen bg-background text-foreground flex flex-col">
        <Script id="sw-cleanup" strategy="beforeInteractive">
          {serviceWorkerCleanupScript}
        </Script>
        <SmoothScroll>
          <div className="relative z-10 w-full">
            {children}
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
