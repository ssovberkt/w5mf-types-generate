const fs = require('fs');
const path = require('path');
const tar = require('tar');

module.exports = class W5MFTypesGeneratePlugin {
  constructor(options) {
    this.options = options; // publicDir, typesDir, archiveFile, appName
  }

  apply(compiler) {
    const APP_NAME = this.options?.appName;

    if (!APP_NAME) {
      throw new Error('[W5MF-TYPES-GENERATE] App name option is required');
    }

    const ROOT_DIR = process.cwd();
    const PUBLIC_DIR = this.options?.publicDir || path.resolve(ROOT_DIR, (process.env.NODE_ENV === 'production' ? 'build' : 'public'));
    const TYPES_DIR = this.options?.typesDir || path.resolve(ROOT_DIR, 'w5mf-types');
    const ARCHIVE_FILE = this.options?.archiveFile || path.resolve(PUBLIC_DIR, 'w5mf-types.tar');

    compiler.hooks.assetEmitted.tap("W5MFTypesGenerate", async (compilation) => {
      fs.stat(TYPES_DIR, async (error) => {
        if (error) {
          throw new Error(`[W5MF-TYPES-GENERATE] Not '${TYPES_DIR}' dir`);
        }

        process.chdir(TYPES_DIR);
        await tar.create({ gzip: false, file: ARCHIVE_FILE }, [APP_NAME]);
      });
    });
  }
};
