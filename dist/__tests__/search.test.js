"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _helpers_1 = require("./_helpers");
test('search users', async () => {
    const res = await _helpers_1.zendeskAPI(`/search.json?query=${encodeURIComponent('test type:user')}`);
    const object = res.body.results[0];
    expect(object.result_type).toBe('user');
    expect(object.name).toBeTruthy(); // only users have :name
});
test('search tickets', async () => {
    const res = await _helpers_1.zendeskAPI(`/search.json?query=${encodeURIComponent('test type:ticket')}`);
    const object = res.body.results[0];
    expect(object.result_type).toBe('ticket');
    expect(object.subject).toBeTruthy(); // only tickets have :subject
});
