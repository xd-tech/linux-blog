const {
    JSDOM
} = require('jsdom')
const fs = require('fs')
const glob = require('glob')
const axios = require('axios').default

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const globp = async pat => new Promise((resolve, reject) => glob(pat, (er, files) => {
    if (files) {
        resolve(files)
    } else {
        reject(pat)
    }
}))

function parseLinks(contents) {
    const dom = new JSDOM(contents)
    const tags = dom.window.document.querySelectorAll("a")
    const links = Array.from(tags).map(link => {
        return link.href.split("#")[0]
    });
    return links
}

async function main() {
    const files = await globp("page/.vuepress/dist/**/*.html")
    console.log(files)

    let links = []
    let filenames = []

    files.forEach(file => {
        const filename = file
        const buf = fs.readFileSync(filename)
        const content = buf.toString();
        for (const link of parseLinks(content)) {
            links.push(link)
            filenames.push(filename.split('page/.vuepress/dist')[1].split("#")[0])
        }
    })

    console.log(filenames)
    console.log(links)

    let processed = new Map()
    while (links.length != 0) {
        let link = links.pop()
        let filename = filenames.pop()
        if (processed.has(link)) {
            continue
        }
        console.log("checking: " + link)
        if (link.startsWith("/")) {
            if (filenames.includes(link)) {
                processed.set(link, "OK")
            } else if (link.endsWith("/")) {
                processed.set(link, "OK")
            } else {
                processed.set(link, "Error: file not found in " + filename)
            }
            continue;
        }
        if (link.startsWith("http")) {
            try {
                await axios.get(link)
                processed.set(link, "OK")
            } catch (e) {
                processed.set(link, e + " in " + filename)
            }
            continue;
        }
        if (link.startsWith("about")) {
            processed.set(link, "about")
            continue;
        }
        processed.set(link, "unknown in " + filename)
    }

    console.log();

    for (const [key, value] of processed) {
        if (!value.startsWith("OK") && !value.startsWith("about")) {
            console.error("::warning::" + key + " => " + value)
        }
    }
}

main()