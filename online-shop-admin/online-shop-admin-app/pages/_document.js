// pages/_document.js
// Purpose:
//  - Custom Document for the Next.js application
//  - Sets global HTML and body attributes
//  - Includes meta tags for PWA support and SEO

// Custom Next.js Document — used to augment the <html> and <body> tags
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    // Set global HTML language
    <Html lang="en">
      <Head>
        {/* PWA manifest enables installable app behavior */}
        <link rel="manifest" href="/manifest.json" />

        {/* Theme color for address bar / OS UI */}
        <meta name="theme-color" content="#000000" />

        {/* Enable iOS fullscreen web-app mode */}
        <meta name="apple-mobile-web-app-capable" content="yes" />

        {/* Styled translucent status bar on iOS */}
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        {/* App name when added to home screen */}
        <meta name="apple-mobile-web-app-title" content="Online Shop Admin" />

        {/* Icon used on iOS home screen */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

        {/* SEO / basic meta information */}
        <meta
          name="description"
          content="Admin panel for managing your online shop"
        />
      </Head>

      {/* Global body styles (anti-alias text + neutral background) */}
      <body className="antialiased bg-gray-100 text-gray-900">
        {/* Main application content */}
        <Main />

        {/* Inject Next.js scripts */}
        <NextScript />
      </body>
    </Html>
  );
}

