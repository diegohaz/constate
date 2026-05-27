---
"constate": major
---

ESM-only package

**BREAKING** if you load `constate` via `require()`, a `<script src="https://unpkg.com/constate">` UMD tag, or a bundler that resolves package entries through the legacy `main`/`module`/`types` fields instead of the `exports` map.

The package now ships a single ESM build and only declares the `exports` map; the legacy `main`, `module`, `jsnext:main`, `unpkg`, and top-level `types` fields have been removed from `package.json`. Switch to ESM imports, or load the package from an ESM-aware CDN such as `https://esm.sh/constate`. The public `constate(useValue, ...selectors)` API, the runtime implementation, and the React peer-dependency range (`^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0`) are unchanged.

Before:

```js
const constate = require("constate");
```

After:

```js
import constate from "constate";
```

Before, loading from a CDN:

```html
<script src="https://unpkg.com/constate"></script>
```

After:

```html
<script type="module">
  import constate from "https://esm.sh/constate";
</script>
```
