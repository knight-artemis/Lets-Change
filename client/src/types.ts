export type UserType = {
  id: number
  firstName: string
  email: string
  middleName?: string
  lastName?: string
  userAddress?: string
  userLat?: number
  userLon?: number
  phone?: string
  avatarUrl?: string
  dealsCount?: number
  charityCount?: number
  thingsCount?: number
  subStatus?: number
  subExp?: Date
  rating?: number
}

export type UserDataType = {
  firstName?: string
  email: string
  password: string
}

export type CategoryType = {
  id: number
  categoryTitle: string
}

export type PhotoType = {
  id: number
  photoUrl: string
}

export type ShortUserType = {
  firstName: string
  middleName: string
  lastName: string
}

 export type ThingType = {
    id: number
    userId: number
    categoryId: number
    thingName: string
    description: string
    thingAddress: string
    thingLat: number
    thingLon: number
    startDate: Date
    endDate: Date
    isApproved: boolean
    inDeal: boolean
    User: ShortUserType
    Category: {categoryTitle: string}
    Photos: PhotoType[]
  }


  export type SimplifiedThingType = {
    id: number
    thingName: string
    categoryId: number
    thingAddress: string
    thingLat: number
    thingLon: number
    endDate: Date
    photoUrl: string
    inDeal?: boolean
  }
