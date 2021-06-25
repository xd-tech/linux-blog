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

    let check_count = 0
    let processed = new Map()
    while (links.length != 0) {
        let link = links.pop()
        let filename = filenames.pop()
        if (processed.has(link)) {
            continue
        }
        console.log("checking: " + link)
        check_count++;
        if (link.startsWith("/")) {
            if (filenames.includes(link) || link.endsWith("/")) {
                processed.set(link, {
                    status: "ok"
                })
            } else {
                processed.set(link, {
                    status: "error",
                    error: "Error: file not found",
                    filename: filename
                })
            }
            continue;
        }
        if (link.startsWith("http")) {
            try {
                await axios.get(link)
                processed.set(link, {
                    status: "ok"
                })
            } catch (e) {
                processed.set(link, {
                    status: "error",
                    error: e,
                    filename: filename
                })
            }
            continue;
        }
        if (link.startsWith("about")) {
            processed.set(link, {
                status: "about"
            })
            continue;
        }
        processed.set(link, {
            status: "unknown"
        })
    }

    console.log()
    console.log("Successfully checked " + check_count + " links!")

    let has_error = false
    for (const [key, value] of processed) {
        if (value.status === "error") {
            console.error("::error file=page" + value.filename.split(".html")[0] + ".md,line=1,col=1" + "::" + key + " => " + value.error)
            has_error = true;
        }
        if (value.status === "unknown") {
            console.error("::error::" + key + " Unknown")
            has_error = true;
        }
    }
    if (has_error) {
        process.exit(1)
    }
}

main()