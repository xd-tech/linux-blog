import { defineConfig, HeadConfig } from "vitepress";

const google_analytics: () => HeadConfig[] = () => {
  return [
    [
      "script",
      {
        async: "true",
        src: "https://www.googletagmanager.com/gtag/js?id=G-SBRRP4LRT6",
      },
    ],
    [
      "script",
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-SBRRP4LRT6');`,
    ],
  ] satisfies HeadConfig[];
};

const google_adsense: () => HeadConfig[] = () => {
  return [
    [
      "script",
      {
        async: "true",
        src: "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
      },
    ],
    [
      "script",
      {},
      `
      (adsbygoogle = window.adsbygoogle || []).push({
          google_ad_client: "ca-pub-1395471808093411",
          enable_page_level_ads: true
      });`,
    ],
  ] satisfies HeadConfig[];
};

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "学生たちの技術ブログ",
  description: "学生たちが技術について話しています",
  lastUpdated: true,
  head: [
    [
      "link",
      {
        rel: "shortcut icon",
        href: "data:image/x-icon;,",
        type: "image/x-icon",
      },
    ],
    ...google_analytics(),
    ...google_adsense(),
  ],
  sitemap: {
    hostname: "https://students-tech.blog",
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "ホーム", link: "/" },
      { text: "投稿", link: "/post/" },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/xd-tech/linux-blog" },
    ],

    search: {
      provider: "local",
    },
    aside: "left",
    editLink: {
      pattern: "https://github.com/xd-tech/linux-blog/edit/main/page/:path",
    },
  },
});
