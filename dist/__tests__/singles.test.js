"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _helpers_1 = require("./_helpers");
test('get a user', async () => {
    const res = await _helpers_1.zendeskAPI('/users/397525155434');
    expect(res.body.user.id).toBeTruthy();
});
test('get a page of tickets', async () => {
    const res = await _helpers_1.zendeskAPI('/tickets/1');
    expect(res.body.ticket.id).toBeTruthy();
});
