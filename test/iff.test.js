import test from 'ava'
import path from 'path'
import caller from 'grpc-caller'
import CallType from '@malijs/call-types'

import Mali from 'mali'
import iff from '../'

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getHostport (port) {
  return '0.0.0.0:'.concat(port || getRandomInt(1000, 60000))
}

const PROTO_PATH = path.resolve(__dirname, './iff.proto')

async function mw (ctx, next) {
  ctx.res = { executed: true }
  await next()
}

function testCall (ctx) {
  if (!ctx.res) {
    ctx.res = { executed: false }
  }
}

mw.iff = iff

test('should call when string param as call method name', async t => {
  t.plan(1)
  const host = getHostport()
  const app = new Mali(PROTO_PATH, 'Tester')
  app.use(mw.iff('TestCall'))
  app.use({ testCall })
  app.start(host)

  const client = caller(host, PROTO_PATH, 'Tester')
  const response = await client.testCall({ message: 'hello' })
  t.true(response.executed)
  await app.close()
})

test('should call when string param as call method name different case', async t => {
  t.plan(1)
  const host = getHostport()
  const app = new Mali(PROTO_PATH, 'Tester')
  app.use(mw.iff('testCall'))
  app.use({ testCall })
  app.start(host)

  const client = caller(host, PROTO_PATH, 'Tester')
  const response = await client.testCall({ message: 'hello' })
  t.true(response.executed)
  await app.close()
})

test('should call when string param as call method type', async t => {
  t.plan(1)
  const host = getHostport()
  const app = new Mali(PROTO_PATH, 'Tester')
  app.use(mw.iff(CallType.UNARY))
  app.use({ testCall })
  app.start(host)

  const client = caller(host, PROTO_PATH, 'Tester')
  const response = await client.testCall({ message: 'hello' })
  t.true(response.executed)
  await app.close()
})

test('should call when function param', async t => {
  t.plan(1)
  const host = getHostport()
  const app = new Mali(PROTO_PATH, 'Tester')
  app.use(mw.iff(ctx => ctx.type === CallType.UNARY))
  app.use({ testCall })
  app.start(host)

  const client = caller(host, PROTO_PATH, 'Tester')
  const response = await client.testCall({ message: 'hello' })
  t.true(response.executed)
  await app.close()
})

test('should call when matching regexp param', async t => {
  t.plan(1)
  const host = getHostport()
  const app = new Mali(PROTO_PATH, 'Tester')
  app.use(mw.iff(/stc/ig))
  app.use({ testCall })
  app.start(host)

  const client = caller(host, PROTO_PATH, 'Tester')
  const response = await client.testCall({ message: 'hello' })
  t.true(response.executed)
  await app.close()
})

test('should not call when string param as call method name and does not match a method', async t => {
  t.plan(1)
  const host = getHostport()
  const app = new Mali(PROTO_PATH, 'Tester')
  app.use(mw.iff('TestCallFake'))
  app.use({ testCall })
  app.start(host)

  const client = caller(host, PROTO_PATH, 'Tester')
  const response = await client.testCall({ message: 'hello' })
  t.false(response.executed)
  await app.close()
})

test('should not call when string param as call method type no match', async t => {
  t.plan(1)
  const host = getHostport()
  const app = new Mali(PROTO_PATH, 'Tester')
  app.use(mw.iff(CallType.DUPLEX))
  app.use({ testCall })
  app.start(host)

  const client = caller(host, PROTO_PATH, 'Tester')
  const response = await client.testCall({ message: 'hello' })
  t.false(response.executed)
  await app.close()
})

test('should not call when function param returns false', async t => {
  t.plan(1)
  const host = getHostport()
  const app = new Mali(PROTO_PATH, 'Tester')
  app.use(mw.iff(ctx => ctx.type === CallType.DUPLEX))
  app.use({ testCall })
  app.start(host)

  const client = caller(host, PROTO_PATH, 'Tester')
  const response = await client.testCall({ message: 'hello' })
  t.false(response.executed)
  await app.close()
})

test('should not call when regexp param and no match', async t => {
  t.plan(1)
  const host = getHostport()
  const app = new Mali(PROTO_PATH, 'Tester')
  app.use(mw.iff(/fake/ig))
  app.use({ testCall })
  app.start(host)

  const client = caller(host, PROTO_PATH, 'Tester')
  const response = await client.testCall({ message: 'hello' })
  t.false(response.executed)
  await app.close()
})

test('should call when specifying name option', async t => {
  t.plan(1)
  const host = getHostport()
  const app = new Mali(PROTO_PATH, 'Tester')
  app.use(mw.iff({ name: 'TestCall' }))
  app.use({ testCall })
  app.start(host)

  const client = caller(host, PROTO_PATH, 'Tester')
  const response = await client.testCall({ message: 'hello' })
  t.true(response.executed)
  await app.close()
})

test('should call when specifying name option as an array', async t => {
  t.plan(1)
  const host = getHostport()
  const app = new Mali(PROTO_PATH, 'Tester')
  app.use(mw.iff({ name: ['OtherTestCall', 'TestCall'] }))
  app.use({ testCall })
  app.start(host)

  const client = caller(host, PROTO_PATH, 'Tester')
  const response = await client.testCall({ message: 'hello' })
  t.true(response.executed)
  await app.close()
})

test('should call when specifying name option as an array with regexp', async t => {
  t.plan(1)
  const host = getHostport()
  const app = new Mali(PROTO_PATH, 'Tester')
  app.use(mw.iff({ name: ['OtherTestCall', /stc/ig] }))
  app.use({ testCall })
  app.start(host)

  const client = caller(host, PROTO_PATH, 'Tester')
  const response = await client.testCall({ message: 'hello' })
  t.true(response.executed)
  await app.close()
})

test('should call when specifying type option', async t => {
  t.plan(1)
  const host = getHostport()
  const app = new Mali(PROTO_PATH, 'Tester')
  app.use(mw.iff({ type: CallType.UNARY }))
  app.use({ testCall })
  app.start(host)

  const client = caller(host, PROTO_PATH, 'Tester')
  const response = await client.testCall({ message: 'hello' })
  t.true(response.executed)
  await app.close()
})

test('should call when specifying name type as an array', async t => {
  t.plan(1)
  const host = getHostport()
  const app = new Mali(PROTO_PATH, 'Tester')
  app.use(mw.iff({ type: [CallType.DUPLEX, CallType.UNARY] }))
  app.use({ testCall })
  app.start(host)

  const client = caller(host, PROTO_PATH, 'Tester')
  const response = await client.testCall({ message: 'hello' })
  t.true(response.executed)
  await app.close()
})

test('should call when specifying custom function', async t => {
  t.plan(1)
  const host = getHostport()
  const app = new Mali(PROTO_PATH, 'Tester')
  app.use(mw.iff({
    type: [CallType.DUPLEX, CallType.REQUEST_STREAM],
    name: ['OtherTestCall', /fake/ig],
    custom: ctx => ctx.type === CallType.UNARY
  }))
  app.use({ testCall })
  app.start(host)

  const client = caller(host, PROTO_PATH, 'Tester')
  const response = await client.testCall({ message: 'hello' })
  t.true(response.executed)
  await app.close()
})

test('should not call when specifying all options and no match', async t => {
  t.plan(1)
  const host = getHostport()
  const app = new Mali(PROTO_PATH, 'Tester')
  app.use(mw.iff({
    type: [CallType.DUPLEX, CallType.REQUEST_STREAM],
    name: ['OtherTestCall', /fake/ig],
    custom: ctx => ctx.type === CallType.DUPLEX
  }))
  app.use({ testCall })
  app.start(host)

  const client = caller(host, PROTO_PATH, 'Tester')
  const response = await client.testCall({ message: 'hello' })
  t.false(response.executed)
  await app.close()
})
