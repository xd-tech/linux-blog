import { JSDOM } from "jsdom";
import * as fs from "fs";
import globby from "globby";
import axios, { AxiosResponse } from "axios";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function parseLinks(contents: string): string[] {
  const dom: JSDOM = new JSDOM(contents);
  const tags = dom.window.document.querySelectorAll("a");
  const links = Array.from(tags).map((link) => link.href.split("#")[0]);
  return links;
}

interface Link {
  url: string;
  filename: string;
}

async function main() {
  const files = await globby("page/.vuepress/dist/**/*.html");
  console.log(files);

  let links: Link[] = [];
  let filenames: Set<string> = new Set();

  files.forEach((filename: string) => {
    const buf = fs.readFileSync(filename);
    const content = buf.toString();
    for (const link of parseLinks(content)) {
      const filename_sliced = filename
        .split("page/.vuepress/dist")[1]
        .split("#")[0];
      links.push({
        url: link,
        filename: filename_sliced,
      });
      filenames.add(filename_sliced);
    }
  });

  // console.log(filenames);
  // console.log(links);

  let processed = new Map<string, any>();
  for (const [index, link] of links.entries()) {
    if (processed.has(link.url)) {
      continue;
    }
    console.log(`checking[${index + 1}/${links.length}]: ` + link.url);
    if (link.url.startsWith("/")) {
      if (
        link.url.endsWith("/") ||
        links.map((l) => l.filename).includes(link.url)
      ) {
        processed.set(link.url, {
          status: "ok",
        });
      } else {
        const md_filename = "page" + link.filename.split(".html")[0] + ".md";
        processed.set(link.url, {
          status: "error",
          error: "Error: file not found",
          md_filename,
        });
      }
      continue;
    }
    if (link.url.startsWith("http")) {
      try {
        const response: AxiosResponse = await axios.get(link.url);
        if (response.status !== 200) {
          throw "Link not working";
        }
        processed.set(link.url, {
          status: "ok",
        });
      } catch (e) {
        const md_filename = "page" + link.filename.split(".html")[0] + ".md";
        let line = 1;
        let col = 1;
        const content = fs.readFileSync(md_filename).toString();
        const lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes(link.url)) {
            line = i + 1;
            col = lines[i].indexOf(link.url) + 1;
            break;
          }
        }

        processed.set(link.url, {
          status: "error",
          error: e,
          md_filename,
          line,
          col,
        });
      }
      continue;
    }
    if (link.url.startsWith("about")) {
      processed.set(link.url, {
        status: "about",
      });
      continue;
    }
    processed.set(link.url, {
      status: "unknown",
    });
  }

  let has_error = false;
  for (const [key, value] of processed) {
    if (value.status === "error") {
      if (value.line && value.col) {
        console.error(
          `::error file=${value.md_filename},line=${value.line},col=${value.col}::${key} => ${value.error}`
        );
      } else {
        console.error(
          `::error file=${value.md_filename}::${key} => ${value.error}`
        );
      }
      has_error = true;
    }
    if (value.status === "unknown") {
      console.error("::error::" + key + " Unknown");
      has_error = true;
    }
  }
  if (has_error) {
    process.exit(1);
  }
}

main();
