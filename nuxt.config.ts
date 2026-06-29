import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // Canonical/OG base — update to the real domain before launch.
  site: { url: "https://www.unfoldedevents.com" },

  // Global stylesheet (design tokens + fonts + base live here).
  css: ["~/assets/css/main.css"],

  // Tailwind CSS v4 via its first-party Vite plugin (no PostCSS config needed).
  vite: {
    plugins: [tailwindcss()],
  },

  // Let the Vue compiler treat TresJS scene tags (<TresMesh> …) as custom
  // elements so they resolve via TresJS's renderer (only used in the client-only
  // hero canvas). TresCanvas stays a real imported component.
  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) =>
        (tag.startsWith("Tres") && tag !== "TresCanvas") || tag === "primitive",
    },
  },

  // Server-only secrets + config (NEVER exposed to the client — no `public`
  // block). Filled from the matching env vars at build (Vercel provides them at
  // build + runtime); see .env.example.
  runtimeConfig: {
    resendApiKey: process.env.RESEND_API_KEY,
    quoteToEmail: process.env.QUOTE_TO_EMAIL,
    quoteFromEmail: process.env.QUOTE_FROM_EMAIL,
  },

  // SSG-first for the marketing page: prerender "/" at build for instant LCP and
  // crawlable HTML. /thank-you is the prerendered no-JS form fallback. The
  // /api/quote route is server-only (POST) and is never prerendered.
  routeRules: {
    "/": { prerender: true },
    "/thank-you": { prerender: true },
  },

  nitro: {
    // Vercel preset is auto-detected on Vercel; these help everywhere.
    compressPublicAssets: { gzip: true, brotli: true },
    prerender: { crawlLinks: true, failOnError: false },
  },

  app: {
    head: {
      htmlAttrs: { lang: "en" },
      // Set .js synchronously so scroll-reveal hidden states only apply with JS
      // (no-JS visitors & crawlers always see fully-painted content; no flash).
      script: [
        {
          // Sets .js always; adds .hero-anim ONLY for capable desktops (not
          // reduced-motion, fine pointer, >=1024px, >=4 cores, no Save-Data,
          // WebGL available). Runs synchronously in <head> BEFORE first paint,
          // so the tall hero track height is correct from frame 1 (no CLS) and
          // every excluded path (SSR/no-JS/mobile/reduced-motion/no-WebGL) stays
          // normal height with no phantom scroll region.
          innerHTML:
            "(function(){var e=document.documentElement;e.classList.add('js');try{var m=function(q){return window.matchMedia(q).matches};if(!m('(prefers-reduced-motion: reduce)')&&m('(pointer: fine)')&&m('(min-width: 1024px)')&&!((navigator.connection||{}).saveData)&&(navigator.hardwareConcurrency||2)>=4){var c=document.createElement('canvas');if(window.WebGLRenderingContext&&(c.getContext('webgl')||c.getContext('experimental-webgl')))e.classList.add('hero-anim')}}catch(x){}})()",
          tagPosition: "head",
        },
      ],
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Premium table & seating rentals for events across DC, Maryland & Virginia — delivered, styled, and set. Based in Rockville, MD. Request a quote.",
        },
        { name: "theme-color", content: "#1C1814" },
        // Open Graph
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Unfolded Events" },
        { property: "og:locale", content: "en_US" },
        {
          property: "og:title",
          content: "Unfolded Events — Table & Chair Rentals in the DMV",
        },
        {
          property: "og:description",
          content:
            "Premium table & seating rentals — delivered, styled, and set across DC, Maryland & Virginia.",
        },
        { property: "og:image", content: "/og-image.jpg" },
        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "Unfolded Events — Table & Chair Rentals in the DMV",
        },
        {
          name: "twitter:description",
          content:
            "Premium table & seating rentals — delivered, styled, and set across the DMV.",
        },
        { name: "twitter:image", content: "/og-image.jpg" },
      ],
      link: [
        // Favicon set — SVG first (modern browsers prefer the crisp vector),
        // .ico as the legacy fallback.
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
        { rel: "icon", href: "/favicon.ico", sizes: "any" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "manifest", href: "/site.webmanifest" },
        // Preload the two above-the-fold fonts (Fraunces drives the hero LCP
        // headline, Inter the nav/body). crossorigin is required even same-origin
        // because fonts are always fetched anonymously.
        {
          rel: "preload",
          as: "font",
          type: "font/woff2",
          href: "/fonts/fraunces-latin-standard-normal.woff2",
          crossorigin: "",
        },
        {
          rel: "preload",
          as: "font",
          type: "font/woff2",
          href: "/fonts/inter-latin-wght-normal.woff2",
          crossorigin: "",
        },
      ],
    },
  },
});
