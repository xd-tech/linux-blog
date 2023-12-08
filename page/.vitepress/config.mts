import { defineConfig } from "vitepress";

const google_analytics = () => {
  return [
    [
      "script",
      {
        async: true,
        src: "https://www.googletagmanager.com/gtag/js?id=275253874",
      },
    ],
    [
      "script",
      {},
      `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '275253874');`,
    ],
  ];
};

const google_adsense = () => {
  return [
    [
      "script",
      {
        async: true,
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
  ];
};
const domain = "students-tech.blog";

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
