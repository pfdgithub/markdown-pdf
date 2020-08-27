#!/usr/bin/env node

const { program } = require('commander');

const pkg = require('../package.json');
const { absolutePath, deepAssign } = require('../src/utils');
const { run } = require('../src/index');

program
  .version(pkg.version)
  .description(pkg.description)
  .option('-s, --sourceDir <dir>', 'input *.md file directory')
  .option('-t, --targetFile <file>', 'output *.pdf file path')
  .option('-c, --configFile <file>', 'custom config file path')
  .option('--verbose', 'output all log')
  .option('--coverTitle <title>', 'pdf cover title')
  .option('--coverAuthor <author>', 'pdf cover author')
  .option('--coverVersion <version>', 'pdf cover version')
  .option('--dirBookmark', 'use directory name as bookmark')
  .option('--fileBookmark', 'use file name as bookmark')
  .option('--fontName <name>', 'default font name')
  .option('--fontFile <file>', 'default font file path')
  .on('command:*', (operands) => {
    console.error(`error: unknown command '${operands[0]}'`);
    process.exit(1);
  });

program.parse(process.argv);

const {
  configFile, verbose,
  sourceDir, targetFile,
  coverTitle, coverAuthor, coverVersion,
  dirBookmark, fileBookmark,
  fontName, fontFile,
} = program;

if (!configFile && !(sourceDir && targetFile)) {
  console.error(`error: must specify options --configFile or --sourceDir and --targetFile`);
  console.log('');
  program.help();
}

let customCfg = {};
if (configFile) {
  const cfg = require(absolutePath(configFile));
  customCfg = cfg || {};
}

deepAssign(customCfg, {
  sourceDir: sourceDir && absolutePath(sourceDir),
  targetFile: targetFile && absolutePath(targetFile),
  log: {
    debug: verbose,
  },
  cover: {
    title: coverTitle,
    author: coverAuthor,
    version: coverVersion,
  },
  bookmark: {
    dirBookmark: dirBookmark,
    fileBookmark: fileBookmark,
  },
  font: {
    defaultFontName: fontName,
    registerFont: fontName && {
      [fontName]: fontFile && absolutePath(fontFile),
    },
  },
});

run(customCfg);
