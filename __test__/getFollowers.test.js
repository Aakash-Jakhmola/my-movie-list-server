const { getFollowing } = require('./../src/domain/user');

test('Getting Followers', async() => {
  const following = await getFollowing({username: 'sumitks866', viewer: 'aakash'});
  expect(following).toBe({});
})