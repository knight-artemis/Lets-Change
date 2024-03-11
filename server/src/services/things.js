function stripThings(thingsRaw, options = {}) {
  const { filter = true} = options
  const things = thingsRaw
    .map((thing) => {
      const plainThing = thing.get({ plain: true })
      const photoUrl = thing.Photos.length > 0 ? thing.Photos[0].photoUrl : 'null.jpg'
      delete plainThing.Photos
      return { ...plainThing, photoUrl }
    })
  return filter
    ? things.filter((thing) => thing.isApproved && !thing.inDeal)
    : things
}

module.exports = { stripThings }
