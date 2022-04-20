/*
 * @Author       : frank
 * @Date         : 2022-04-20 09:19:53
 * @LastEditTime : 2022-04-20 10:49:51
 * @LastEditors  : frank
 * @Description  : In User Settings Edit
 */
// Esbuild 原生不支持通过 HTTP 从 CDN 服务上拉取对应的第三方依赖资源，如下代码所示:
// react-dom 的内容全部从 CDN 拉取
// 这段代码目前是无法运行的
import { render } from "https://cdn.skypack.dev/react-dom";
import React from 'react';

let Greet = () => <h1>Hello, juejin!</h1>;

render(<Greet />, document.getElementById("root"));