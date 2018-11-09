# reflex [![Gitter][gitter.icon]][gitter.url] [![styled with prettier][prettier.icon]][prettier.url]

Reflex is a reactive UI library that is heavily inspired by (pretty much is a port of) [elm][] and it's amazingly simple yet powerful [architecture][elm architecture] where "[flux][]" (in [react][] terms) is simply a byproduct of a pattern. In order to keep a major attraction of [elm][] &mdash; [algebraic data types][] & type safety &mdash; the library uses [flow][], a static type checker, that being said it's your call whether you want to use [flow][] yourself or just happer a pure JS either way this library has things to offer.

Library is authored as pure ES modules and can be used with [import syntax][].

```js
import * as Reflex from "//reflex.hashbase.io/lib.js"
```

[elm]: http://elm-lang.org
[elm architecture]: http://elm-lang.org/guide/architecture
[react]: http://facebook.github.io/react/
[immutable.js]: https://facebook.github.io/immutable-js/
[flux]: https://facebook.github.io/flux/
[algebraic data types]: https://en.wikipedia.org/wiki/Algebraic_data_type
[flow]: http://flowtype.org
[gitter.url]: https://gitter.im/mozilla/reflex?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[gitter.icon]: https://badges.gitter.im/Join%20Chat.svg
[prettier.url]: https://github.com/prettier/prettier
[prettier.icon]: https://img.shields.io/badge/styled_with-prettier-ff69b4.svg
[import syntax]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
