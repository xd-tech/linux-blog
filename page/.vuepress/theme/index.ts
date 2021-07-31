import { path } from "@vuepress/utils";
import { createPage, Page, Theme } from "@vuepress/core";
import { DefaultThemeOptions } from "@vuepress/theme-default";

interface MyLocalThemeOptions extends DefaultThemeOptions {}

// テーマの作成
const my_local_theme: Theme<MyLocalThemeOptions> = {
  // テーマ名
  name: "vuepress-theme-local",
  // vuepress2の標準テーマを拡張する
  extends: "@vuepress/theme-default",
  // ページの最後にAuthorInfoをつけるためのハック
  extendsMarkdown: (md) => {
    const render = md.render;
    md.render = (...args) => {
      // レンダリングされたHTMLに追記する
      const html = render.call(md, ...args);
      return html + "\n<AuthorInfo />";
    };
  },
  // AuthorInfoのコンポーネントをページ内で使えるようにロード
  clientAppEnhanceFiles: path.resolve(__dirname, "enhance.ts"),
  // buildしたときに一度だけ実行される。
  // この中でホームページ、投稿一覧ページの生成をしている
  async onInitialized(app) {
    // ページを日付でソート
    const pages_sorted_by_new: Page[] = Array.from(
      app.pages
        .filter((p) => p.title)
        .sort((a, b) => {
          let adate: Date = new Date(a.frontmatter.date || "2018-01-01");
          let bdate: Date = new Date(b.frontmatter.date || "2018-01-01");
          return +bdate - +adate;
        })
    );
    // ホームページが存在しなかったら生成
    if (!app.pages.some((page) => page.path === "/")) {
      // 最近の投稿の生成
      const top5: string = pages_sorted_by_new // すべてのページ
        .slice(0, 5) // 5つ取る
        .map(page_index_md) // markdownに変換
        .join("\n"); // 接続
      // ホームページの要素
      const homepage: Page = await createPage(app, {
        path: "/",
        frontmatter: {
          home: true,
          title: "", //　空に設定しないとページのタイトルが「最近の投稿 | 学生たちの技術ブログ」になってしまう
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
        // ページの中身のMarkdown
        content: "# 最近の記事\n" + top5,
      });
      // ページの追加
      app.pages.push(homepage);
    }

    // 投稿一覧が存在しなかったら生成
    if (!app.pages.some((page: Page) => page.path === "/post/")) {
      // ページの内容の生成
      const all_pages: string = pages_sorted_by_new // すべてのページ
        .map(page_index_md) // Markdownの生成
        .join("\n"); // 接続
      // 投稿一覧ページの要素
      const posts_page: Page = await createPage(app, {
        path: "/post/",
        frontmatter: {
          layout: "Layout",
          sidebar: false,
          editLink: false,
        },
        // Markdownのコンテンツ
        content: "# 投稿一覧\n" + all_pages,
      });
      // ページの追加
      app.pages.push(posts_page);
    }
  },
};

// ページの情報からMarkdownを生成
function page_index_md(p: Page): string {
  // タグ
  const tags: string = (p.frontmatter.tag as string[])?.join(",") ?? "なし";
  // カテゴリ
  const category: string = (p.frontmatter.category as string) || "なし";
  // 日付
  const date = format_page_date(p);

  return `\
## [${p.title}](${p.path})
${p.frontmatter.description}
投稿日:${date} カテゴリー:**${category}** タグ:${tags}`;
}

// 日付のフォーマット
function format_page_date(p: Page): string {
  const date: Date = new Date(p.frontmatter.date || "2018-01-01");
  return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
}

export default my_local_theme;
