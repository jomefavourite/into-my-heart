import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, shrink-to-fit=no'
        />

        {/* SEO Meta Tags */}
        <meta
          name='description'
          content='Into My Heart - Memorize Bible verses with proven techniques. Practice with flashcards, fill-in-the-blanks, and recitation methods.'
        />
        <meta
          name='keywords'
          content='Bible, memorization, verses, flashcards, practice, Christian, faith, scripture'
        />
        <meta name='author' content='Into My Heart' />
        <meta name='robots' content='index, follow' />

        {/* Open Graph Meta Tags */}
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content='Into My Heart' />
        <meta property='og:locale' content='en_US' />

        {/* Twitter Card Meta Tags */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@intomyheart' />

        {/* Theme Color */}
        <meta name='theme-color' content='#313131' />
        <meta name='msapplication-TileColor' content='#313131' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Into My Heart' />
        <link rel='manifest' href='/manifest.webmanifest' />
        <link rel='apple-touch-icon' href='/icon.png' />

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Add any additional <head> elements that you want globally available on web... */}
      </head>
      <body>{children}</body>
    </html>
  );
}
