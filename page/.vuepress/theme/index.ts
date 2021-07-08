import { path } from "@vuepress/utils";
import { createPage, Page, Theme } from "@vuepress/core";
import { DefaultThemeOptions } from "@vuepress/theme-default";

const my_local_theme: Theme<DefaultThemeOptions> = {
  name: "vuepress-theme-local",
  extends: "@vuepress/theme-default",
  extendsMarkdown: (md) => {
    //md.breaks = true;
    const render = md.render;
    md.render = (...args) => {
      // original content
      const html = render.call(md, ...args);
      return html + "\n<AuthorInfo />";
    };
  },
  clientAppEnhanceFiles: path.resolve(__dirname, "enhance.ts"),
  async onInitialized(app) {
    const pages_sorted_by_new: Page[] = Array.from(
      app.pages
        .filter((p) => p.title)
        .sort((a, b) => {
          let adate: Date = new Date(a.frontmatter.date || "2018-01-01");
          let bdate: Date = new Date(b.frontmatter.date || "2018-01-01");
          return +bdate - +adate;
        })
    );
    // if the homepage does not exist
    if (app.pages.every((page) => page.path !== "/")) {
      // ホームページの生成
      // はじめの5つの要素を取る
      const top5: string = pages_sorted_by_new
        .slice(0, 5)
        .map(page_index_md)
        .join("\n");
      const homepage: Page = await createPage(app, {
        path: "/",
        frontmatter: {
          home: true,
          heroText: "学生たちの技術ブログ",
          tagline: "学生たちが様々な技術について語っているブログです",
          actions: [
            {
              text: "記事一覧",
              link: "/post/",
              type: "primary",
            },
          ],
        },
        // set markdown content
        content: "# 最近の記事\n" + top5,
      });
      // add it to `app.pages`
      app.pages.push(homepage);
    }

    if (app.pages.every((page: Page) => page.path !== "/post/")) {
      // create a posts page
      const all_pages: string = pages_sorted_by_new
        .map(page_index_md)
        .join("\n");
      const posts_page: Page = await createPage(app, {
        path: "/post/",
        // set frontmatter
        frontmatter: {
          layout: "Layout",
          sidebar: false,
        },
        // set markdown content
        content: "# 投稿一覧\n" + all_pages,
      });
      // add it to `app.pages`
      app.pages.push(posts_page);
    }
  },
};

function page_index_md(p: Page): string {
  const tags: string = (p.frontmatter.tag as string[])?.join(",") ?? "なし";
  const category: string = (p.frontmatter.category as string) || "なし";
  const date = get_page_date(p);
  return `\
## [${p.title}](${p.path})
${p.frontmatter.description}
投稿日:${date} カテゴリー:**${category}** タグ:${tags}`;
}

function get_page_date(p: Page): string {
  const date: Date = new Date(p.frontmatter.date || "2018-01-01");
  return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
}

export default my_local_theme;
