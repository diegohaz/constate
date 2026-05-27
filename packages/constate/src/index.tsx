import * as React from "react";

// constate(useCounter, value => value.count)
//                      ^^^^^^^^^^^^^^^^^^^^
type Selector<Value> = (value: Value) => any;

// const [Provider, useCount, useIncrement] = constate(...)
//                  ^^^^^^^^^^^^^^^^^^^^^^
type SelectorHooks<Selectors> = {
  [K in keyof Selectors]: () => Selectors[K] extends (...args: any) => infer R
    ? R
    : never;
};

// const [Provider, useCounterContext] = constate(...)
// or               ^^^^^^^^^^^^^^^^^
// const [Provider, useCount, useIncrement] = constate(...)
//                  ^^^^^^^^^^^^^^^^^^^^^^
type Hooks<
  Value,
  Selectors extends Selector<Value>[],
> = Selectors["length"] extends 0 ? [() => Value] : SelectorHooks<Selectors>;

// const [Provider, useContextValue] = constate(useValue)
//       ^^^^^^^^^^^^^^^^^^^^^^^^^^^
type ConstateTuple<Props, Value, Selectors extends Selector<Value>[]> = [
  React.FC<React.PropsWithChildren<Props>>,
  ...Hooks<Value, Selectors>,
];

const isDev = process.env.NODE_ENV !== "production";

const NO_PROVIDER = {};

// In dev mode, preserve the Provider/hook identities across HMR reloads of
// the caller's module so React doesn't unmount the mounted Provider on every
// edit. The cache key combines (a) the caller's source location
// (`file:line:col`), captured from `new Error().stack` after skipping this
// module's own frames, so a given call site finds its prior entry across
// re-evaluations and distinct call sites in the same process don't collide,
// and (b) a coarse structural signature (`useValue` name, selector arity,
// selector names, and hook counts for `useValue` and each selector) so the
// cache invalidates on changes that would otherwise crash React with
// "rendered more hooks". The hook count uses a regex over `fn.toString()`
// that matches `\buse[A-Z]\w*\s*\(`; it's a best-effort heuristic so it
// does not see React 19's `React.use(...)` (no capital after `use`),
// aliased hooks, or same-count reorderings, and a hook-named substring in
// a comment or string literal can inflate the count. The skip walk handles
// V8 / JSC / Firefox stack formats, recognises constate's frames by both
// function name (`getCallerLocation`, `getCacheKey`, `constate`) and — for
// frames whose name was elided by the engine — by file path under known
// dependency-resolver roots (`node_modules`, `.yarn`, `.vite`), so Vite's
// pre-bundled `node_modules/.vite/deps/constate*.js` frame doesn't end up
// returned as the user's call site, and bypasses the cache (returns
// `null`) whenever the stack is missing, the first non-internal frame
// can't be parsed, or `useValue` is anonymous.
type AnyFn = { name: string; toString(): string };
type CacheEntry = {
  useValueRef: { current: (props: any) => any };
  selectorsRef: { current: Selector<any>[] };
  result: ConstateTuple<any, any, Selector<any>[]>;
};
const hmrCache: Map<string, CacheEntry> | null = isDev ? new Map() : null;
const INTERNAL_FRAME_NAMES = new Set([
  "getCallerLocation",
  "getCacheKey",
  "constate",
]);

function countHookCalls(fn: AnyFn): number {
  // Strip a leading function declaration prefix so the declared name doesn't
  // get counted as a hook call (e.g. `function useTimer() {}` would
  // otherwise match `useTimer(`). Handles plain, async, and generator
  // declarations.
  const source = fn
    .toString()
    .replace(/^(?:async\s+)?function\s*\*?\s*\w+\s*\(/, "(");
  const matches = source.match(/\buse[A-Z]\w*\s*\(/g);
  return matches ? matches.length : 0;
}

function isConstateInternalFile(file: string): boolean {
  // Only treat paths under a known dependency-resolver root as constate's
  // own — without this gate, a user file at, for example,
  // `apps/constate/src/index.tsx` would be misclassified as internal and
  // skipped. The worktree case (`packages/constate/src/index.tsx`) is not
  // under any resolver root, so it's covered by the function-name skip in
  // `getCallerLocation` instead.
  const isUnderDepRoot =
    /(?:^|[/\\])node_modules[/\\]/.test(file) ||
    /(?:^|[/\\])\.yarn[/\\]/.test(file) ||
    /(?:^|[/\\])\.vite[/\\]/.test(file);
  if (!isUnderDepRoot) return false;
  return (
    /(?:^|[/\\])constate[/\\](?:src|dist)[/\\]index\.(?:tsx|js|mjs|cjs)$/.test(
      file,
    ) ||
    /(?:^|[/\\])constate(?:@[^/\\]*)?[/\\]index\.[mc]?js$/.test(file) ||
    /[/\\]\.vite[/\\]deps[/\\]constate[^/\\]*$/.test(file)
  );
}

// Last-segment capture of `[obj.]*fnName` so V8 member-call frames like
// `    at Object.constate (...)` or `    at Module.exports.constate (...)`
// reduce to `constate` for the internal-frame skip and for
// `parseStackFrame`'s `fnName` field. The lookahead `(?=\s+\()` requires a
// space and an opening paren after the name — V8 named frames always have
// that, while bare-path frames like `at file.js:1:2` (no parens) do not,
// so the regex doesn't manufacture a fake function name from a filename
// segment.
const V8_FN_NAME_RE =
  /at\s+(?:async\s+)?(?:new\s+)?(?:[\w$]+\.)*([\w$]+)(?=\s+\()/;
// Anchored at the start of the frame so it only matches JSC / SpiderMonkey
// `fnName@file:line:col` (or anonymous `@file:line:col` and member
// `obj.fn@file:line:col`) frames and not a V8 path that happens to contain
// `@`, e.g. pnpm's content-addressed `node_modules/.pnpm/constate@4.0.1/...`
// or scoped workspaces like `packages/@myorg/...`.
const JSC_FN_NAME_RE = /^\s*(?:[\w$]+\.)*([\w$]*)@/;

function parseStackFrame(
  frame: string,
): { fnName: string | null; file: string; line: string; col: string } | null {
  const fnMatch = frame.match(V8_FN_NAME_RE) || frame.match(JSC_FN_NAME_RE);
  const fnName = fnMatch ? fnMatch[1] || null : null;
  const locMatch =
    frame.match(/\(([^()]+):(\d+):(\d+)\)\s*$/) ||
    frame.match(/at\s+(?:[^()]+?\s+)?([^()\s]+):(\d+):(\d+)\s*$/) ||
    // Allow JSC/SpiderMonkey labels containing whitespace, e.g.
    // `global code@…` and `eval code@…`. Slashes are not in the
    // character class, so V8 paths like
    // `at /node_modules/.pnpm/constate@4.0.1/…` still don't match.
    frame.match(/^\s*[\w$.\s]*@([^()\s]+):(\d+):(\d+)\s*$/);
  if (!locMatch) return null;
  return {
    fnName,
    file: locMatch[1].replace(/\?.*$/, ""),
    line: locMatch[2],
    col: locMatch[3],
  };
}

function getCallerLocation(): string | null {
  const stack = new Error().stack;
  // Customised `Error.prepareStackTrace` can leave `stack` as a non-string
  // (V8 supports returning any value). Bail out rather than risk throwing
  // on `.split` and turning the dev-only cache into a runtime error.
  if (typeof stack !== "string") return null;
  const lines = stack.split("\n");
  for (let i = 1; i < lines.length; i += 1) {
    const frame = lines[i];
    // Skip frames whose function name is one of this module's internals.
    // In dev (the only mode where this runs), bundlers preserve function
    // names so this matches reliably.
    const fnMatch = frame.match(V8_FN_NAME_RE) || frame.match(JSC_FN_NAME_RE);
    if (fnMatch && fnMatch[1] && INTERNAL_FRAME_NAMES.has(fnMatch[1])) continue;
    const parsed = parseStackFrame(frame);
    if (!parsed) {
      // First non-internal frame is unparseable: bypass the cache rather
      // than risk returning a deeper, wrong frame as the call site.
      return null;
    }
    // Skip frames that resolve to constate's own shipped or pre-bundled
    // files in case the function-name skip missed them (anonymous
    // arrow-function frames have no name; some engines also omit it).
    if (isConstateInternalFile(parsed.file)) continue;
    if (parsed.file.startsWith("node:")) continue;
    // Include the column so two `constate(...)` calls on the same source
    // line (rare but legal, e.g. `const a = constate(useFoo), b =
    // constate(useFoo);`) get distinct cache keys. The cost is that LHS
    // edits which shift the column without moving the call to a new line
    // (e.g. renaming the destructured binding) invalidate the cache and
    // lose state, mirroring how React Refresh remounts on signature
    // changes — see the comment block above this function and the
    // changeset for the full set of trade-offs.
    return `${parsed.file}:${parsed.line}:${parsed.col}`;
  }
  return null;
}

function getCacheKey(useValue: AnyFn, selectors: AnyFn[]): string | null {
  if (!useValue.name) return null;
  const callerLocation = getCallerLocation();
  if (callerLocation === null) return null;
  const selectorNames = selectors.map((s) => s.name || "").join(",");
  const selectorHookCounts = selectors.map(countHookCalls).join(",");
  return `${callerLocation}|${useValue.name}|${selectors.length}|${selectorNames}|${countHookCalls(useValue)}|${selectorHookCounts}`;
}

function createUseContext(context: React.Context<any>): any {
  return () => {
    const value = React.useContext(context);
    if (isDev && value === NO_PROVIDER) {
      const warnMessage = context.displayName
        ? `The context consumer of ${context.displayName} must be wrapped with its corresponding Provider`
        : "Component must be wrapped with Provider.";
      // eslint-disable-next-line no-console
      console.warn(warnMessage);
    }
    return value;
  };
}

function constate<Props, Value, Selectors extends Selector<Value>[]>(
  useValue: (props: Props) => Value,
  ...selectors: Selectors
): ConstateTuple<Props, Value, Selectors> {
  let cacheKey: string | null = null;
  if (hmrCache) {
    cacheKey = getCacheKey(useValue, selectors);
    if (cacheKey) {
      const cached = hmrCache.get(cacheKey);
      if (cached) {
        cached.useValueRef.current = useValue;
        cached.selectorsRef.current = selectors;
        return cached.result as unknown as ConstateTuple<
          Props,
          Value,
          Selectors
        >;
      }
    }
  }

  const useValueRef = { current: useValue as (props: any) => any };
  const selectorsRef = { current: selectors as unknown as Selector<any>[] };

  const contexts = [] as React.Context<any>[];
  const hooks = [] as unknown as Hooks<Value, Selectors>;

  const createContext = (displayName: string) => {
    const context = React.createContext(NO_PROVIDER);
    if (isDev && displayName) {
      context.displayName = displayName;
    }
    contexts.push(context);
    hooks.push(createUseContext(context));
  };

  if (selectors.length) {
    selectors.forEach((selector) => createContext(selector.name));
  } else {
    createContext(useValue.name);
  }

  const Provider: React.FC<React.PropsWithChildren<Props>> = ({
    children,
    ...props
  }) => {
    const value = useValueRef.current(props as Props);
    let element = children as React.ReactElement;
    for (let i = 0; i < contexts.length; i += 1) {
      const context = contexts[i];
      const selector = selectorsRef.current[i] || ((v: Value) => v);
      element = (
        <context.Provider value={selector(value)}>{element}</context.Provider>
      );
    }
    return element;
  };

  if (isDev && useValue.name) {
    Provider.displayName = "Constate";
  }

  const result = [Provider, ...hooks] as ConstateTuple<Props, Value, Selectors>;

  if (hmrCache && cacheKey) {
    hmrCache.set(cacheKey, {
      useValueRef,
      selectorsRef,
      result: result as unknown as ConstateTuple<any, any, Selector<any>[]>,
    });
  }

  return result;
}

export default constate;
