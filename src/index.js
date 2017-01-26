const djb2Hash = str => {
  var hash = 5381
  for (var i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) + hash) + char
  }
  return hash
}

// returns 0 or 1, grouping users into unique groups.
// Example usage:
//  if (groupUser(user.id, 'Popular Skill Engagement Module') === 1) {
//    ... display module ...
// }
export const groupUser = (id, groupName, n = 2) =>
  Math.abs(((Number(id) * djb2Hash(groupName)) >> 3)) % n
