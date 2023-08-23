import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import { DEFAULT_EXTENSIONS } from "@babel/core";
import postcss from "rollup-plugin-postcss";
import tailwindcss from "tailwindcss";

import tailwindConfig from "./tailwind.config.js";

export default [
  {
    input: "./src/App.tsx",
    output: [
      { file: "dist/index.js", format: "cjs", sourcemap: true },
      {
        file: "dist/index.es.js",
        format: "es",
        exports: "named",
        sourcemap: true,
      },
    ],
    plugins: [
      typescript(),
      postcss({
        extensions: [".css"],
        plugins: [tailwindcss(tailwindConfig)],
      }),
      babel({
        babelHelpers: "bundled",
        extensions: [...DEFAULT_EXTENSIONS, ".ts", ".tsx"],
      }),
      external(),
      resolve(),
      commonjs(),
      terser(),
    ],
  },
];
