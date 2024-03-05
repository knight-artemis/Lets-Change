export type UserType = {
  id: number;
  firstName: string;
  email: string;
  middleName?: string;
  lastName?: string;
  userAddress?: string;
  userLat?: number;
  userLon?: number;
  phone?: string;
  avatarUrl?: string;
  dealsCount?: number;
  charityCount?: number;
  thingsCount?: number;
  subStatus?: number;
  subExp?: Date;
  rating?: number;
};

export type UserDataType = {
  firstName?: string;
  email: string;
  password: string;
};
