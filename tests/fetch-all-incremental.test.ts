import { zendeskAPI } from './_helpers'

test('fetchAllIncrementalTickets', async () => {
  await zendeskAPI.fetchAllIncrementalTickets({
    startDate: '2022-01-01',
    endDate: '2022-02-03',
    onPage: async (tickets) => {
      expect(tickets.length).toBeGreaterThanOrEqual(1)
    },
  })
}, 10000)

test('fetchAllIncrementalUsers', async () => {
  await zendeskAPI.fetchAllIncrementalUsers({
    startDate: '2022-08-01',
    endDate: '2022-08-03',
    onPage: async (users) => {
      expect(users[0].updated_at?.includes('2022-08-01')).toBeTruthy()
      expect(users.length).toBeGreaterThanOrEqual(1)
    },
  })
}, 10000)
