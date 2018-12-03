# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.0.0-alpha.5"></a>
# [1.0.0-alpha.5](https://github.com/diegohaz/constate/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2018-12-03)


### Bug Fixes

* Fix `useContextState` not supporting lazy initialization ([#54](https://github.com/diegohaz/constate/issues/54)) ([059216d](https://github.com/diegohaz/constate/commit/059216d)), closes [#53](https://github.com/diegohaz/constate/issues/53)


### Code Refactoring

* Replace `useMutationEffect` by `useLayoutEffect` ([4dada0f](https://github.com/diegohaz/constate/commit/4dada0f))


### BREAKING CHANGES

* `useContextMutationEffect` has been removed. `React.useMutationEffect` will be removed from React hooks, so this is just to reflect that (see https://github.com/facebook/react/pull/14336).



<a name="1.0.0-alpha.4"></a>
# [1.0.0-alpha.4](https://github.com/diegohaz/constate/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2018-11-27)


### Features

* Add new `useContextKey` hook ([e0d8cd8](https://github.com/diegohaz/constate/commit/e0d8cd8))


### BREAKING CHANGES

* Removed `unstable_` prefix from `useContextEffect` hooks. They're no longer using React internal stuff, but now they require `useContextKey`. See [docs](https://github.com/diegohaz/constate#usecontexteffect).



<a name="1.0.0-alpha.3"></a>
# [1.0.0-alpha.3](https://github.com/diegohaz/constate/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2018-11-25)


### Bug Fixes

* Accept arguments other than objects in `createContext` ([93327a3](https://github.com/diegohaz/constate/commit/93327a3))



<a name="1.0.0-alpha.2"></a>
# [1.0.0-alpha.2](https://github.com/diegohaz/constate/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2018-11-22)


### Bug Fixes

* Fix Redux DevTools creating unnecessary entries ([7162ad2](https://github.com/diegohaz/constate/commit/7162ad2))
* Fix usage of `useContext(Context)` ([3ff531a](https://github.com/diegohaz/constate/commit/3ff531a))
* Make `initialAction` on `useContextReducer` synchronous on render ([bde4b3c](https://github.com/diegohaz/constate/commit/bde4b3c))


### BREAKING CHANGES

* `createContext` doesn't accept a `name` argument anymore.



<a name="1.0.0-alpha.1"></a>
# [1.0.0-alpha.1](https://github.com/diegohaz/constate/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2018-11-21)


### Bug Fixes

* Fix `useContextEffect` when it's used more than once ([3a28d2d](https://github.com/diegohaz/constate/commit/3a28d2d))


### BREAKING CHANGES

* Renamed `useContextEffect` and its variations to `unstable_useContextEffect`



<a name="1.0.0-alpha.0"></a>
# [1.0.0-alpha.0](https://github.com/diegohaz/constate/compare/v0.9.0...v1.0.0-alpha.0) (2018-11-21)


### Features

* Hooks ([#51](https://github.com/diegohaz/constate/issues/51)) ([10dd41d](https://github.com/diegohaz/constate/commit/10dd41d)), closes [#48](https://github.com/diegohaz/constate/issues/48)



<a name="0.9.0"></a>
# [0.9.0](https://github.com/diegohaz/constate/compare/v0.8.2...v0.9.0) (2018-10-03)


### Features

* Add `pure` prop to `Container` ([#44](https://github.com/diegohaz/constate/issues/44)) ([262d931](https://github.com/diegohaz/constate/commit/262d931))


### BREAKING CHANGES

* If you're using TypeScript, `ActionMap` no longer accepts the short version of action (i.e. returning an object directly).



<a name="0.8.2"></a>
## [0.8.2](https://github.com/diegohaz/constate/compare/v0.8.1...v0.8.2) (2018-09-10)


### Features

* **typescript:** Export `ProviderProps` type from Provider component ([#41](https://github.com/diegohaz/constate/issues/41)) ([ab132f6](https://github.com/diegohaz/constate/commit/ab132f6))



<a name="0.8.1"></a>
## [0.8.1](https://github.com/diegohaz/constate/compare/v0.8.0...v0.8.1) (2018-08-29)


### Bug Fixes

* Make Container work on server side ([#40](https://github.com/diegohaz/constate/issues/40)) ([9ed0e7b](https://github.com/diegohaz/constate/commit/9ed0e7b)), closes [#38](https://github.com/diegohaz/constate/issues/38)



<a name="0.8.0"></a>
# [0.8.0](https://github.com/diegohaz/constate/compare/v0.7.2...v0.8.0) (2018-08-23)


### Features

* Rewrite the library in TypeScript ([#36](https://github.com/diegohaz/constate/issues/36)) ([de1cd09](https://github.com/diegohaz/constate/commit/de1cd09))


### BREAKING CHANGES

* Experimental `mount` module has been removed.



<a name="0.7.2"></a>
## [0.7.2](https://github.com/diegohaz/constate/compare/v0.7.1...v0.7.2) (2018-07-20)


### Bug Fixes

* onUpdate should be called if shouldUpdate returns true ([446c871](https://github.com/diegohaz/constate/commit/446c871))



<a name="0.7.1"></a>
## [0.7.1](https://github.com/diegohaz/constate/compare/v0.7.0...v0.7.1) (2018-07-10)


### Features

* Add shouldUpdate ([#32](https://github.com/diegohaz/constate/issues/32)) ([88d49f8](https://github.com/diegohaz/constate/commit/88d49f8))
