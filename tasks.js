const { existsSync, readdirSync, rmdirSync } = require('node:fs');
const adapterName = require('./package.json').name.replace('iobroker.', '');
const { deleteFoldersRecursive, copyFiles, npmInstall, buildReact } = require('@iobroker/build-tools');

const SRC_TS = 'src-widgets/';
const src_ts = `${__dirname}/${SRC_TS}`;

function tsClean() {
    deleteFoldersRecursive(`${src_ts}build`);
    deleteFoldersRecursive(`${__dirname}/widgets`);
}

function tsCopyAllFiles() {
    copyFiles([`${SRC_TS}build/icon-set*.json`], `widgets/${adapterName}`);
    copyFiles([`${SRC_TS}build/assets/*.*`], `widgets/${adapterName}/assets`);
    copyFiles([`${SRC_TS}build/img/*`], `widgets/${adapterName}/img`);
}

if (process.argv.includes('--typescript') || process.argv.length === 2) {
    tsClean();
    let npmPromise;
    if (existsSync(`${src_ts}/node_modules`)) {
        npmPromise = Promise.resolve();
    } else {
        npmPromise = npmInstall(src_ts);
    }
    npmPromise
        .then(() => buildReact(src_ts, { rootDir: __dirname, vite: true }))
        .then(() => tsCopyAllFiles())
        .catch(e => console.error(`Cannot build: ${e}`));
}
