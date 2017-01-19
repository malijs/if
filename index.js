const conditionTest = require('mali-condition-test')

/**
 * Mali if middleware. Attach to any middleware and configure it to permit/pervent the
 * middleware in question to be executed.
 * @module mali-if
 *
 * @param {Object|String|RegExp|Function} options
 *        - If <code>string</code> and one of <code>Mali Call Types</code> do middleware
 *         only if call the specified call type
 *        - If <code>string</code> and not a call type, assumed to be a call name; and
 *        middleware is executed only if the call name is the name specified. Call names checks are not case sensitive.
 *        - If <code>function</code> it's a test function that returns <code>true</code> / <code>false</code>.
 *        If the function returns <code>true</code> for the given call, the middleware will run.
 *        The function will be passed the call context.
 *        - If <code>RegExp</code> instance, if call name matches the regexp the middleware is run.
 * @param {String|Regex|Array} options.name A <code>string</code>, a <code>RegExp</code> or an array of any of those.
 *                                          If the call name matches, the middleware will run.
 *                                          Call names checks are not case sensitive.
 * @param {String|Array} options.type A <code>string</code> or an array of strings.
 *                                     If the call type matches, the middleware will run.
 * @param {Function} options.custom A test function that returns <code>true</code> / <code>false</code>.
 *        If the function returns <code>true</code> for the given request, the middleware will run.
 *        The function will be passed the call context.
 * @return {Function} middleware
 *
 * @example
 * const requestId = require('mali-requestid')
 * const iff = require('mali-iff')
 * const CallType = require('mali-call-types')
 * const toJSON = require('mali-tojson')()
 *
 * const rid = requestId()
 * rid.iff = iff
 * app.use(rid.iff('SomeMethod'))
 *
 * toJSON.iff = iff
 * app.use(toJSON.iff({ type: [ CallType.UNARY, CallType.REQUEST_STREAM ] }))
 *
 */
function iffMiddleware (options) {
  const parent = this

  return function iff (ctx, next) {
    const runWm = conditionTest(ctx, options)

    if (runWm) {
      return parent(ctx, next)
    }

    return next()
  }
}

module.exports = iffMiddleware
