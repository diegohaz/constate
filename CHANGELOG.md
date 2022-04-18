# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.3.2](https://github.com/diegohaz/constate/compare/v3.3.1...v3.3.2) (2022-04-18)


### Bug Fixes

* Allow React 18 as a peer dependency ([6611f1c](https://github.com/diegohaz/constate/commit/6611f1c74f12281d6e7e7d0c2633f9d7178d2efb))

### [3.3.1](https://github.com/diegohaz/constate/compare/v3.3.0...v3.3.1) (2022-04-18)


### Bug Fixes

* Fix `React.FC` types for React 18 ([#155](https://github.com/diegohaz/constate/issues/155)) ([77de7c7](https://github.com/diegohaz/constate/commit/77de7c7c666545f92e2c4338096e39980dbadcff))

## [3.3.0](https://github.com/diegohaz/constate/compare/v3.2.0...v3.3.0) (2021-06-24)


### Features

* Add debug message for no provider case ([#138](https://github.com/diegohaz/constate/issues/138)) ([dcdf1fb](https://github.com/diegohaz/constate/commit/dcdf1fb62660a530f04eea5bfff3b6f3a9a45d84))

## [3.2.0](https://github.com/diegohaz/constate/compare/v3.1.0...v3.2.0) (2021-03-01)


### Features

* Show displayName for each context in React Developer Tools ([#128](https://github.com/diegohaz/constate/issues/128)) ([6c1d5e0](https://github.com/diegohaz/constate/commit/6c1d5e0f22d07c57e85c6784b00e27958596e51b))

## [3.1.0](https://github.com/diegohaz/constate/compare/v3.0.1...v3.1.0) (2020-10-22)


### Features

* Allow React 17 as a peerDependency ([#122](https://github.com/diegohaz/constate/issues/122)) ([0f69b83](https://github.com/diegohaz/constate/commit/0f69b8336a53a6ef8797795bc618dc3b884a189c))

### [3.0.1](https://github.com/diegohaz/constate/compare/v3.0.0...v3.0.1) (2020-09-08)


### Bug Fixes

* Use empty object instead of string for NO_PROVIDER value ([28dd2f8](https://github.com/diegohaz/constate/commit/28dd2f8c8c59e17bd0f025f7e5df08bf381c77c9))

## [3.0.0](https://github.com/diegohaz/constate/compare/v2.0.0...v3.0.0) (2020-09-08)


### ⚠ BREAKING CHANGES

* Types now depend on TypeScript v4.0.
* The deprecated function/object API has been removed.

  **Before**:
  ```jsx
  import createUseContext from "constate";
  const useCounterContext = createUseContext(useCounter);
  <useCounterContext.Provider>
    ...
  </useCounterContext.Provider>
  ```

  **After**:
  ```jsx
  import constate from "constate";
  const [CounterProvider, useCounterContext] = constate(useCounter);
  <CounterProvider>
    ...
  </CounterProvider>
  ```

### Features

* Upgrade to TypeScript 4 and remove deprecated API ([#118](https://github.com/diegohaz/constate/issues/118)) ([19e6b6a](https://github.com/diegohaz/constate/commit/19e6b6a0645b61e6163be5ad80a789cb3aa2a40d)), closes [#109](https://github.com/diegohaz/constate/issues/109) [#117](https://github.com/diegohaz/constate/issues/117)

## [2.0.0](https://github.com/diegohaz/constate/compare/v1.3.2...v2.0.0) (2020-02-15)


### ⚠ BREAKING CHANGES

* Support for the `createMemoDeps` parameter has been dropped.

  **Before**:
  ```jsx
  const useCounterContext = createUseContext(useCounter, value => [value.count]);
  ```

  **After**:
  ```jsx
  const useCounterContext = createUseContext(() => {
    const value = useCounter();
    return useMemo(() => value, [value.count]);
  });
  ```

### Features

* Deprecate old function/object API ([#101](https://github.com/diegohaz/constate/issues/101)) ([c102a31](https://github.com/diegohaz/constate/commit/c102a31d00b23026256f09bbede11488e04f6dc2))
* Remove deprecated `createMemoDeps` parameter ([#100](https://github.com/diegohaz/constate/issues/100)) ([553405d](https://github.com/diegohaz/constate/commit/553405df07144cde2009a9e2590012cd1fee548f))

### [1.3.2](https://github.com/diegohaz/constate/compare/v1.3.1...v1.3.2) (2019-10-20)


### Bug Fixes

* Remove unnecessary code from production ([a0d22bf](https://github.com/diegohaz/constate/commit/a0d22bfebc409dbea081c13ac61a84ca2022bc0b))

### [1.3.1](https://github.com/diegohaz/constate/compare/v1.3.0...v1.3.1) (2019-10-20)


### Bug Fixes

* Fix invalid attempt to destructure non-iterable instance ([67001c4](https://github.com/diegohaz/constate/commit/67001c46f981ce378538136b0dcb9f9864d54c10))

## [1.3.0](https://github.com/diegohaz/constate/compare/v1.2.0...v1.3.0) (2019-10-20)


### Features

* Add `sideEffects` field to `package.json` ([97c0af5](https://github.com/diegohaz/constate/commit/97c0af5b60d102471ec91690172c3bb57d386c2c))
* Expose API for splitting custom hook into multiple contexts ([#97](https://github.com/diegohaz/constate/issues/97)) ([fc3426e](https://github.com/diegohaz/constate/commit/fc3426ed2a9e5f7c05b2a069efb00c6b4d4e76cd)), closes [#93](https://github.com/diegohaz/constate/issues/93)



## [1.2.0](https://github.com/diegohaz/constate/compare/v1.1.1...v1.2.0) (2019-06-29)


### Features

* Set displayName of Context and Provider ([#79](https://github.com/diegohaz/constate/issues/79)) ([#80](https://github.com/diegohaz/constate/issues/80)) ([fc6595f](https://github.com/diegohaz/constate/commit/fc6595f))



## [1.1.1](https://github.com/diegohaz/constate/compare/v1.1.0...v1.1.1) (2019-04-14)


### Bug Fixes

* Fix React peer dependency range ([7132e3d](https://github.com/diegohaz/constate/commit/7132e3d))



# [1.1.0](https://github.com/diegohaz/constate/compare/v1.0.0...v1.1.0) (2019-04-14)


### Features

* Return a hook from the createContainer method ([#78](https://github.com/diegohaz/constate/issues/78)) ([8de6eb6](https://github.com/diegohaz/constate/commit/8de6eb6)), closes [#77](https://github.com/diegohaz/constate/issues/77)



# [1.0.0](https://github.com/diegohaz/constate/compare/v0.9.0...v1.0.0) (2019-02-06)

First official release.
