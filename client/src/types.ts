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
  err?: ErrorType
}

type ErrorType = {
  firstName: string
  email: string
  password: string
}

export type SetProps = {
  setActive: React.Dispatch<React.SetStateAction<boolean>>
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
  Category: { categoryTitle: string }
  Photos: PhotoType[]
}

export type SimplifiedThingType = {
  id: number
  userId?: number
  thingName: string
  categoryId: number
  thingAddress: string
  thingLat: number
  thingLon: number
  endDate: Date
  photoUrl: string
  inDeal?: boolean
  isApproved?: boolean
}

type OneDealSkeleton = {
  id: number
  thingId: number
  status: number
  initiatorId: number
  acceptedByInitiator: boolean
  acceptedByReceiver: boolean
  initiatorNote: boolean
  Thing: { thingName: string; photoUrl: string }
  recieverName: string
}

export type OneDealToMe = {
  initiatorName: string
  recieverNote: boolean
} & OneDealSkeleton

export type OneDealFromMe = {
  recieverName: string
  initiatorNote: boolean
} & OneDealSkeleton

export type MyDealsType = {
  fromMeDeals: OneDealFromMe[]
  toMeDeals: OneDealToMe[]
}
