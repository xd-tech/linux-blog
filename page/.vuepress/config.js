const google_analytics = () => {
    return [
        ["script", {
            async: true,
            src: "https://www.googletagmanager.com/gtag/js?id=UA-103597604-2"
        }],
        ["script", {}, `window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
  
    gtag('config', 'UA-103597604-2');`]
    ]
}

const google_adsense = () => {
    return [
        ["script", {
            "async": true,
            src: "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        }],
        ["script", {}, `
        (adsbygoogle = window.adsbygoogle || []).push({
            google_ad_client: "ca-pub-1395471808093411",
            enable_page_level_ads: true
        });`]
    ]
}
const domain = "students-tech.blog"

function for_code_plugin(md, ruleName, iteartor) {

    function scan(state) {
        for (let blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
            if (state.tokens[blkIdx].type === "fence") {
                iteartor(state.tokens[blkIdx])
            }
        }
    }

    md.core.ruler.push(ruleName, scan);
}

module.exports = {
    title: "学生たちの技術ブログ",
    themeConfig: {
        nav: [{
                text: "ホーム",
                link: "/"
            },
            {
                text: "投稿一覧",
                link: "/post/"
            }
        ],
        sidebar: "auto",
        domain,
        repo: "xd-tech/linux-blog",
        docsDir: "page",
        editLinks: true,
        editLinkText: "Githubで編集する",
        lastUpdated: "最終更新日",
        docsBranch: 'main',
    },
    markdown: {
        extendMarkdown: md => {
            md
                .use(for_code_plugin, "replace_code_hinting", (token) => {
                    token.info = token.info.split(":")[0]
                    token.info = token.info.replace("terminal", "bash")
                })
                .set({
                    breaks: true,
                    linkify: true,
                })
        }
    },
    head: [
        ...google_analytics(),
        ...google_adsense(),
        ["meta", {
            charset: "utf-8"
        }],
        ["meta", {
            name: "viewport",
            content: "width=device-width,initial-scale=1"
        }]
    ],
    plugins: {
        "seo": {
            siteTitle: (_, $site) => $site.title,
            title: $page => $page.frontmatter.title || $page.title,
            description: $page => $page.frontmatter.description,
            // author: (_, $site) => $site.themeConfig.author,
            // tags: $page => $page.frontmatter.tags,
            // twitterCard: _ => 'summary_large_image',
            type: $page => ['articles', 'posts', 'blog'].some(folder => $page.regularPath.startsWith('/' + folder)) ? 'article' : 'website',
            url: (_, $site, path) => ($site.themeConfig.domain || '') + path,
            // image: ($page, $site) => $page.frontmatter.image && (($site.themeConfig.domain || '') + $page.frontmatter.image),
            publishedAt: $page => $page.frontmatter.date && new Date($page.frontmatter.date),
            modifiedAt: $page => $page.lastUpdated && new Date($page.lastUpdated),
        },
        "sitemap": {
            hostname: "https://" + domain
        }
    },
    lang: "ja-JP"
}