import { babel } from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import ignore from "rollup-plugin-ignore";
import pkg from "./package.json";

const external = Object.keys(pkg.peerDependencies || {});
const allExternal = [...external, ...Object.keys(pkg.dependencies || {})];
const extensions = [".ts", ".tsx", ".js", ".jsx", ".json"];

const createCommonPlugins = () => [
  babel({
    extensions,
    babelHelpers: "bundled",
    exclude: "node_modules/**",
  }),
];

const main = {
  input: "src/index.tsx",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
    },
    {
      file: pkg.module,
      format: "es",
    },
  ],
  external: allExternal,
  plugins: [...createCommonPlugins(), nodeResolve({ extensions })],
};

const unpkg = {
  input: "src/index.tsx",
  output: {
    name: pkg.name,
    file: pkg.unpkg,
    format: "umd",
    exports: "named",
    globals: {
      react: "React",
    },
  },
  external,
  plugins: [
    ...createCommonPlugins(),
    ignore(["stream"]),
    terser(),
    commonjs({
      include: /node_modules/,
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    nodeResolve({
      extensions,
      preferBuiltins: false,
    }),
  ],
};

export default [main, unpkg];
