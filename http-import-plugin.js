/*
 * @Author       : frank
 * @Date         : 2022-04-20 09:21:21
 * @LastEditTime : 2022-04-21 22:25:51
 * @LastEditors  : frank
 * @Description  : In User Settings Edit
 */
module.exports = () => ({
  name: "esbuild:http",
  setup(build) {
    let https = require("https");
    let http = require("http");

    // 1. 拦截 CDN 请求
    // 拦截间接依赖的路径，并重写路径
    // tip: 间接依赖同样会被自动带上 `http-url`的 namespace
    build.onResolve({ filter: /.*/, namespace: "http-url" }, (args) => {
      console.log('onResolve:------->', args)
      return {
        // 重写路径
        path: new URL(args.path, args.importer).toString(),
        namespace: "http-url",
      }
    });

    // 2. 通过 fetch 请求加载 CDN 资源
    build.onLoad({ filter: /.*/, namespace: "http-url" }, async (args) => {
      console.log('onLoad:======>', args)
      let contents = await new Promise((resolve, reject) => {
        function fetch(url) {
          console.log(`Downloading: ----> ${url}`);
          let lib = url.startsWith("https") ? https : http;
          let req = lib
            .get(url, (res) => {
              if ([301, 302, 307].includes(res.statusCode)) {
                // 重定向
                fetch(new URL(res.headers.location, url).toString());
                req.abort();
              } else if (res.statusCode === 200) {
                // 响应成功
                let chunks = [];
                res.on("data", (chunk) => chunks.push(chunk));
                res.on("end", () => resolve(Buffer.concat(chunks)));
              } else {
                reject(
                  new Error(`GET ${url} failed: status ${res.statusCode}`)
                );
              }
            })
            .on("error", reject);
        }
        fetch(args.path);
      });
      console.log(contents)
      return { contents };
    });
  },
});