import globby from "globby";
import fs from "fs";
import yaml from "js-yaml";
import md from "markdown-it";
import md_frontmatter from "markdown-it-front-matter";

function assert(condition: boolean, message: string): void | never {
  if (!condition) {
    throw "assertion error: " + message;
  }
}

async function main() {
  const files = await globby("page/post/!(README).md");

  files.forEach(async (file) => {
    const filename = file;
    const buf = fs.readFileSync(filename);
    const content = buf.toString();
    const front_matter = await get_frontmatter(content);
    await frontmatter_check(filename, front_matter);
  });
}

async function get_frontmatter(content: string): Promise<string> {
  const parser = (content: string) =>
    new Promise((resolve) => {
      md().use(md_frontmatter, resolve).render(content);
    });
  return (await parser(content)) as string;
}

interface Frontmatter {
  date: Date;
  author: string;
}

async function frontmatter_check(filename: string, raw_front_matter: string) {
  const frontmatter = yaml.load(raw_front_matter);
  if (!frontmatter || typeof frontmatter !== "object" || frontmatter === null) {
    throw "frontmatter is not a valid object";
  }

  const fdata: Frontmatter = frontmatter as Frontmatter;

  // check keys
  const check_keys = ["title", "author", "date", "description"];
  for (let index in check_keys) {
    assert(
      check_keys[index] in fdata,
      `no key ${check_keys[index]} in ${filename}`
    );
  }

  // check date
  assert(
    typeof fdata.date === "object",
    `date is not valid in ${filename}, value was ${fdata.date}`
  );

  // check author
  const authors = ["astpy_ms", "pineapplehunter"];
  assert(
    authors.includes(fdata["author"].toLowerCase()),
    `the author name is invalid in file ${filename}, value was ${fdata[
      "author"
    ].toLowerCase()} (lowercased)`
  );
}

main();
