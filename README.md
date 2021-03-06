# mali-iff

Conditionally add [Mali](https://github.com/malijs/mali) middleware.

Opposite of [@malijs/unless](https://github.com/malijs/unless).

[![npm version](https://img.shields.io/npm/v/@malijs/iff.svg?style=flat-square)](https://www.npmjs.com/package/@malijs/iff)
[![build status](https://img.shields.io/travis/malijs/iff/master.svg?style=flat-square)](https://travis-ci.org/malijs/iff)

## Installation

```
npm install @malijs/iff
```

## API

<a name="module_@malijs/iff"></a>

### @malijs/iff ⇒ <code>function</code>
Mali if middleware. Attach to any middleware and configure it to permit/pervent the
middleware in question to be executed.

**Returns**: <code>function</code> - middleware  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> \| <code>String</code> \| <code>RegExp</code> \| <code>function</code> | - If <code>string</code> and one of <code>Mali Call Types</code> do middleware         only if call the specified call type        - If <code>string</code> and not a call type, assumed to be a call name; and        middleware is executed only if the call name is the name specified. Call names checks are not case sensitive.        - If <code>function</code> it's a test function that returns <code>true</code> / <code>false</code>.        If the function returns <code>true</code> for the given call, the middleware will run.        The function will be passed the call context.        - If <code>RegExp</code> instance, if call name matches the regexp the middleware is run. |
| options.name | <code>String</code> \| <code>Regex</code> \| <code>Array</code> | A <code>string</code>, a <code>RegExp</code> or an array of any of those.                                          If the call name matches, the middleware will run.                                          Call names checks are not case sensitive. |
| options.type | <code>String</code> \| <code>Array</code> | A <code>string</code> or an array of strings.                                     If the call type matches, the middleware will run. |
| options.custom | <code>function</code> | A test function that returns <code>true</code> / <code>false</code>.        If the function returns <code>true</code> for the given request, the middleware will run.        The function will be passed the call context. |

**Example**  
```js
const requestId = require('@malijs/requestid')
const iff = require('@malijs/iff')
const CallType = require('@malijs/call-types')
const toJSON = require('@malijs/tojson')

const rid = requestId()
rid.iff = iff
app.use(rid.iff('SomeMethod'))

toJSON.iff = iff
app.use(toJSON.iff({ type: [ CallType.UNARY, CallType.REQUEST_STREAM ] }))
```
## License

  Apache-2.0
