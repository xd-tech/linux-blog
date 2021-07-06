const {
    path
} = require('@vuepress/utils');
const {
    createPage
} = require('@vuepress/core');

function* take(iterable, length) {
    const iterator = iterable[Symbol.iterator]();
    while (length-- > 0) yield iterator.next().value;
}

module.exports = {
    name: 'vuepress-theme-local',
    extends: '@vuepress/theme-default',
    extendsMarkdown: md => {
        md.breaks = true;
        const render = md.render;

        md.render = (...args) => {
            // original content
            const html = render.call(md, ...args);
            return html + "\n<AuthorInfo />";
        };
    },
    clientAppEnhanceFiles: path.resolve(__dirname, 'enhance.ts'),
    async onInitialized(app) {
        const pages_sorted_by_new = [...app.pages.filter(p => p.title).sort((a, b) => {
            let adate = a.frontmatter.date || "2018-1-1"
            let bdate = b.frontmatter.date || "2018-1-1"
            return Date.parse(bdate) - Date.parse(adate)
        })]
        // if the homepage does not exist
        if (app.pages.every((page) => page.path !== "/")) {
            // create a homepage
            // console.log(pages_sorted_by_new)
            const top5 = [...take(pages_sorted_by_new, 5)].map(page_index_md).join("\n")
            const homepage = await createPage(app, {
                path: "/",
                frontmatter: {
                    home: true,
                    heroText: "学生たちの技術ブログ",
                    tagline: "学生たちが様々な技術について語っているブログです",
                    actions: [{
                        text: "記事一覧",
                        link: "/post/",
                        type: "primary"
                    }]
                },
                // set markdown content
                content: "# 最近の記事\n" + top5,
            });
            // add it to `app.pages`
            app.pages.push(homepage);
        }

        if (app.pages.every((page) => page.path !== "/post/")) {
            // create a posts page
            const all_pages = pages_sorted_by_new.map(page_index_md).join("\n")
            const posts_page = await createPage(app, {
                path: "/post/",
                // set frontmatter
                frontmatter: {
                    layout: "Layout",
                    sidebar: false,
                },
                // set markdown content
                content: "# 投稿一覧\n" + all_pages
            });
            // add it to `app.pages`
            app.pages.push(posts_page);
        }
    }
};

function page_index_md(p) {
    return `## [${p.title}](${p.path})` + "\n" + `${p.frontmatter.description}` + "\n" +
        `投稿日:${get_page_date(p)} カテゴリー:**${p.frontmatter.category}** タグ:${(p.frontmatter.tag||[]).join(",")}`
}

function get_page_date(p) {
    return `${p.frontmatter.date?.getFullYear()}/${p.frontmatter.date?.getMonth()}/${p.frontmatter.date?.getDate()}`
}