const postcss = require("postcss");
const postcssrc = require("postcss-load-config");
const fs = require("fs");
const { promisify } = require("util");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const EXIT_CODES = {
  ERROR: 1,
};

const CSS_SRC = "./src/index.css";
const CSS_DEST = "./lib/index.css";

const build = async () => {
  try {
    const [css, { plugins, options }] = await Promise.all([
      await readFile(CSS_SRC),
      await postcssrc(),
    ]);

    const result = await postcss(plugins).process(css, options);

    await writeFile(CSS_DEST, result.css);
  } catch (e) {
    console.error(e);
    process.exit(EXIT_CODES.ERROR);
  }
};

build();
