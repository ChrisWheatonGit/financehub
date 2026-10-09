import test from 'node:test';import assert from 'node:assert/strict';
import {generateInvitationToken,hashToken,normalizeEmail,validateAllocations} from '../src/lib/household-helpers.mjs';
test('tokens are high entropy and hashed',()=>{const a=generateInvitationToken(),b=generateInvitationToken();assert.notEqual(a,b);assert.equal(a.length,43);assert.notEqual(hashToken(a),a);});
test('normalized invitation emails',()=>assert.equal(normalizeEmail(' A@Example.COM '),'a@example.com'));
test('splits cannot overcount or omit dollars',()=>{assert.equal(validateAllocations(20000,[{userId:'a',amountCents:12000},{userId:'b',amountCents:8000}]),true);assert.equal(validateAllocations(20000,[{userId:'a',amountCents:12000},{userId:'b',amountCents:9000}]),false);assert.equal(validateAllocations(20000,[{userId:'a',amountCents:10000},{userId:'a',amountCents:10000}]),false);});
