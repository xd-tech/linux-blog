import { defineUserConfig } from "vuepress";
import type { DefaultThemeOptions } from "vuepress";
import { path } from "@vuepress/utils";

export default defineUserConfig<DefaultThemeOptions>({
  lang: "ja-JP",
  title: "学生たちの技術ブログ",
  head: [
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
  ],
  theme: path.resolve(__dirname, "theme"),
  themeConfig: {
    navbar: [
      {
        text: "ホーム",
        link: "/",
      },
      {
        text: "投稿一覧",
        link: "/post/",
      },
    ],
    sidebar: "auto",
    repo: "xd-tech/linux-blog",
    docsDir: "page",
    editLink: true,
    editLinkText: "Githubで編集する",
    lastUpdatedText: "最終更新日",
    docsBranch: "main",
  },
  markdown: { breaks: true },
  plugins: [
    ["@vuepress/plugin-google-analytics", { id: "G-SBRRP4LRT6" }],
    [
      "@vuepress/plugin-search",
      {
        isSearchable: (page) => page.path !== "/" && page.path !== "/post/",
        getExtraFields: (page) => [
          ...new Set([
            page.frontmatter.category || "nocategory",
            ...(page.frontmatter.tag ?? []),
          ]),
        ],
      },
    ],
  ],
});
