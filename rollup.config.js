import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import replace from "rollup-plugin-replace";
import commonjs from "rollup-plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import { uglify } from "rollup-plugin-uglify";
import ignore from "rollup-plugin-ignore";
import pkg from "./package.json";

const { name } = pkg;
const external = Object.keys(pkg.peerDependencies || {});
const allExternal = external.concat(Object.keys(pkg.dependencies || {}));

const makeExternalPredicate = externalArr => {
  if (externalArr.length === 0) {
    return () => false;
  }
  const pattern = new RegExp(`^(${externalArr.join("|")})($|/)`);
  return id => pattern.test(id);
};

const common = {
  input: "src/index.js"
};

const createCommonPlugins = () => [
  babel({
    exclude: "node_modules/**",
    plugins: ["external-helpers"]
  }),
  commonjs({
    include: /node_modules/,
    ignoreGlobal: true
  }),
  filesize()
];

const main = Object.assign({}, common, {
  output: {
    name,
    file: pkg.main,
    format: "cjs",
    exports: "named"
  },
  external: makeExternalPredicate(allExternal),
  plugins: createCommonPlugins().concat([resolve()])
});

const module = Object.assign({}, common, {
  output: {
    file: pkg.module,
    format: "es"
  },
  external: makeExternalPredicate(allExternal),
  plugins: createCommonPlugins().concat([resolve()])
});

const unpkg = Object.assign({}, common, {
  output: {
    name,
    file: pkg.unpkg,
    format: "umd",
    exports: "named",
    globals: {
      react: "React",
      "react-dom": "ReactDOM"
    }
  },
  external: makeExternalPredicate(external),
  plugins: createCommonPlugins().concat([
    ignore(["stream"]),
    uglify(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    resolve({
      preferBuiltins: false
    })
  ])
});

export default [main, module, unpkg];
