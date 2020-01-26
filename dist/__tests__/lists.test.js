"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _helpers_1 = require("./_helpers");
test('get a page of users', async () => {
    const res = await _helpers_1.zendeskAPI('/users');
    expect(res.body.users.length).toBeGreaterThan(0);
});
test('get a page of tickets', async () => {
    const res = await _helpers_1.zendeskAPI('/tickets');
    expect(res.body.tickets.length).toBeGreaterThan(0);
});
