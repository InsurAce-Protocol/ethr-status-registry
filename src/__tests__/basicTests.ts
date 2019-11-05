import 'jest-extended'

import { EthrStatusRegistry } from '../index'
import * as HttpProvider from 'ethjs-provider-http'

test('should be able to instantiate Status using infura ID', () => {
  expect(new EthrStatusRegistry({ infuraProjectId: 'none' })).not.toBeNil()
})

test('should be able to instantiate Status using single network definition', () => {
  expect(new EthrStatusRegistry({ rpcUrl: 'example.com' })).not.toBeNil()
})

test('should be able to instantiate Status using multiple network definitions', () => {
  expect(
    new EthrStatusRegistry({
      networks: [
        { name: 'mainnet', rpcUrl: 'example.com' },
        { name: 'rinkeby', rpcUrl: 'rinkeby.example.com' },
        { name: 'local', provider: new HttpProvider('http://localhost:8545') }
      ]
    })
  ).not.toBeNil()
})

test('asMethodName should have proper signature', () => {
  let mapping = new EthrStatusRegistry({ infuraProjectId: 'none' })
    .asStatusMethod
  expect(mapping['EthrStatusRegistry2019']).toBeFunction
})

test(`should reject unknown status method`, async () => {
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1NzI5NjY3ODAsInN0YXR1cyI6eyJ0eXBlIjoidW5rbm93biIsImlkIjoic29tZXRoaW5nIHNvbWV0aGluZyJ9LCJpc3MiOiJkaWQ6ZXRocjoweGYzYmVhYzMwYzQ5OGQ5ZTI2ODY1ZjM0ZmNhYTU3ZGJiOTM1YjBkNzQifQ.WO4kUEYy3xzZR1VlofOm3e39e1XM227uIr-Z7Yb9YQcJJ-2PRcnQmecW5fDjIfF3EInS3rRd4TZmuVQOnhaKQAE'
  const statusChecker = new EthrStatusRegistry({ infuraProjectId: 'none' })
  await expect(statusChecker.checkStatus(token)).rejects.toMatch(
    'unsupported credential status method'
  )
})

it(`should reject unknown networkIDs`, async () => {
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1NzI5NzM2MjMsInN0YXR1cyI6eyJ0eXBlIjoiRXRoclN0YXR1c1JlZ2lzdHJ5MjAxOSIsImlkIjoicmlua2VieToweDFFNDY1MWRjYTVFZjM4NjM2ZTJFNEQ3QTZGZjRkMjQxM2ZDNTY0NTAifSwiaXNzIjoiZGlkOmV0aHI6MHhmM2JlYWMzMGM0OThkOWUyNjg2NWYzNGZjYWE1N2RiYjkzNWIwZDc0In0.CFDlVKGWBiJwUwq14waLQ2fqLljhJG3Qci5KFhcF8zM916sN7MWFESdF1TseIOPmIcteQ_99m61dTTJ0YMY0rwE'
  const statusChecker = new EthrStatusRegistry({
    networks: [{ name: 'some net', rpcUrl: 'example.com' }]
  })
  await expect(statusChecker.checkStatus(token)).rejects.toMatch(
    'networkId (rinkeby) for status check not configured'
  )
})

it(`should do something`, async () => {
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1NzI5NzM2MjMsInN0YXR1cyI6eyJ0eXBlIjoiRXRoclN0YXR1c1JlZ2lzdHJ5MjAxOSIsImlkIjoicmlua2VieToweDFFNDY1MWRjYTVFZjM4NjM2ZTJFNEQ3QTZGZjRkMjQxM2ZDNTY0NTAifSwiaXNzIjoiZGlkOmV0aHI6MHhmM2JlYWMzMGM0OThkOWUyNjg2NWYzNGZjYWE1N2RiYjkzNWIwZDc0In0.CFDlVKGWBiJwUwq14waLQ2fqLljhJG3Qci5KFhcF8zM916sN7MWFESdF1TseIOPmIcteQ_99m61dTTJ0YMY0rwE'
  const statusChecker = new EthrStatusRegistry({
    networks: [{ name: 'rinkeby', rpcUrl: 'https://rinkeby.infura.io/ethr-did' }]
  })
  const result = await statusChecker.checkStatus(token)
  console.log(result)
  expect(await statusChecker.checkStatus(token)).toMatchObject({'0':false})
})
