/**
 * Custom Next.js Document
 * ----------------------
 * This file controls the base HTML structure of the app.
 * It runs ONLY on the server and is used for:
 * - <html> and <body> attributes
 * - Global <head> elements (fonts, meta tags)
 */

import { Html, Head, Main, NextScript } from "next/document";

/**
 * Document Component
 * ------------------
 * Overrides the default Next.js document.
 * Used for global setup that applies to every page.
 */
export default function Document() {
  return (
    /**
     * Root HTML element
     * -----------------
     * lang="en" improves accessibility and SEO
     */
    <Html lang="en">
      <Head>
        {/*
          Theme color
          -----------
          Used by mobile browsers and PWAs
          to style the browser UI
        */}
        <meta name="theme-color" content="#000000" />

        {/*
          Google Fonts preconnect
          -----------------------
          Improves font loading performance
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/*
          Google Fonts
          ------------
          - Lexend: main UI font
          - Roboto Condensed: headings / compact text
        */}
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/*
        Body element
        ------------
        antialiased improves text rendering
      */}
      <body className="antialiased">
        {/*
          Main application content
          ------------------------
          Next.js renders pages here
        */}
        <Main />

        {/*
          Next.js scripts
          ----------------
          Required for client-side functionality
        */}
        <NextScript />
      </body>
    </Html>
  );
}
