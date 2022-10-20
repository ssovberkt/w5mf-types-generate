const tar = require('tar');

module.exports = class W5MFTypesGeneratePlugin {
  constructor(options) {
    this.options = options; // publicDir, typesDir, archiveFile
  }

  apply(compiler) {
    const PUBLIC_DIR = this.options?.publicDir || (process.env.NODE_ENV === 'production' ? 'build' : 'public');
    const TYPES_DIR = this.options?.typesDir || 'types';
    const ARCHIVE_FILE = this.options?.archiveFile || 'types.tar';

    compiler.hooks.assetEmitted.tap("W5MFTypesGenerate", async (compilation) => {
      await tar.create({ gzip: false, file: `${PUBLIC_DIR}/${ARCHIVE_FILE}` }, [TYPES_DIR]);
    });
  }
};
