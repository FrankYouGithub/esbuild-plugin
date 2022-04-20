/*
 * @Author       : frank
 * @Date         : 2022-04-20 09:55:32
 * @LastEditTime : 2022-04-20 10:30:36
 * @LastEditors  : frank
 * @Description  : In User Settings Edit
 */
const { build } = require("esbuild");
const httpImport = require("./http-import-plugin");
const html = require("./html-plugin");
async function runBuild() {
  build({
    absWorkingDir: process.cwd(),
    entryPoints: ["./src/index.jsx"],
    outdir: "dist",
    bundle: true,
    format: "esm",
    splitting: true,
    sourcemap: true,
    metafile: true,
    plugins: [httpImport(), html()],
  }).then(() => {
    console.log("🚀 Build Finished!");
  });
}

runBuild();