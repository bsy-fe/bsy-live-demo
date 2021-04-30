export const filterRole = (list, userID) => {
  let shouldRole = ''
  const comparedId = String(userID)

  const compareResult = list.some(item => {
    const itemId = String(item.userID || item.buid)
    if (itemId === comparedId) {
      shouldRole = String(item.role || item.roleType)
    }
    return itemId === comparedId
    // return item
  })

  // console.log('=============filterRole::', list, userID, compareResult, shouldRole)

  return shouldRole || '4'
}
