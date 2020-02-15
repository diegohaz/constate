# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
