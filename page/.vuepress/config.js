module.exports = {
    title: "学生たちの技術ブログ",
    themeConfig: {
        nav: [
            { text: "Home", link: "/" },
            { text: "Posts", link: "/post/" }
        ],
        sidebar: "auto"
    },
    markdown: {
        extendMarkdown: md => {
            md.set({
                breaks: true,
                linkify: true,
            })
        }
    }
}
