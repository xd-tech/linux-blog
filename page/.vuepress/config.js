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

module.exports = {
    title: "学生たちの技術ブログ",
    themeConfig: {
        nav: [{
                text: "Home",
                link: "/"
            },
            {
                text: "Posts",
                link: "/post/"
            }
        ],
        sidebar: "auto",
        domain
    },
    markdown: {
        extendMarkdown: md => {
            md.set({
                breaks: true,
                linkify: true,
            })
        }
    },
    head: [
        ...google_analytics(),
        ...google_adsense()
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
    }
}