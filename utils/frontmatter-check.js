const glob = require("glob");
const fs = require("fs")
const yaml = require("js-yaml")
const moment = require("moment");
// const assert = require("assert").strict

function assert(condition, message) {
    if (!condition) {
        console.error("assertion error: " + message)
        process.exit(1)
    }
}


const globp = async pat => new Promise((resolve, reject) => glob(pat, (er, files) => {
    if (files) {
        resolve(files)
    } else {
        reject(pat)
    }
}))

async function main() {
    const files = await globp("page/post/!(README).md")
    // console.log(files)

    files.forEach(async file => {
        const filename = file
        const buf = fs.readFileSync(filename)
        const content = buf.toString();
        const front_matter = await get_frontmatter(content)
        await frontmatter_check(filename, front_matter)
        // console.log(output)
    })
}

async function get_frontmatter(content) {
    const parser = (content) => new Promise(resolve => {
        require('markdown-it')()
            .use(require('markdown-it-front-matter'), resolve)
            .render(content)
    })
    return await parser(content)
}


async function frontmatter_check(filename, raw_front_matter) {
    // console.log(filename)
    const frontmatter = yaml.load(raw_front_matter)
    // console.log(frontmatter)

    // check keys
    const check_keys = ["title", "author", "date", "description"]
    for (let index in check_keys) {
        assert(check_keys[index] in frontmatter, `no key ${check_keys[index]} in ${filename}`)
    }

    // check date
    // console.log(frontmatter["date"])
    assert(moment(frontmatter["date"], "YYYY-MM-DD").isValid(), `date is not valid in ${filename}, value was ${frontmatter["date"]}`)

    // check author
    const authors = ["astpy_ms", "pineapplehunter"]
    assert(authors.includes(frontmatter["author"].toLowerCase()), `the author name is invalid in file ${filename}, value was ${frontmatter["author"].toLowerCase()} (lowercased)`)
}

main()