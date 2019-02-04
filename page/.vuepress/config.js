const google_analytics = () => {
    return [["script", {async:true, src:"https://www.googletagmanager.com/gtag/js?id=UA-103597604-2"}],
    ["script",{},`window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
  
    gtag('config', 'UA-103597604-2');` ]]
}

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
    },
    head:[
        ...google_analytics()
    ]
}
