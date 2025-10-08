import type { IDateValue, ISocialLink } from './common';

// ----------------------------------------------------------------------

export type ICustomerTableFilters = {
  name: string;
  role: string[];
  status: string;
};

export type ICustomerProfileCover = {
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
};

export type ICustomerProfile = {
  id: string;
  role: string;
  quote: string;
  email: string;
  school: string;
  country: string;
  company: string;
  totalFollowers: number;
  totalFollowing: number;
  socialLinks: ISocialLink;
};

export type ICustomerProfileFollower = {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
};

export type ICustomerProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: IDateValue;
};

export type ICustomerProfileFriend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type ICustomerProfilePost = {
  id: string;
  media: string;
  message: string;
  createdAt: IDateValue;
  personLikes: { name: string; avatarUrl: string }[];
  comments: {
    id: string;
    message: string;
    createdAt: IDateValue;
    author: { id: string; name: string; avatarUrl: string };
  }[];
};

export type ICustomerCard = {
  id: string;
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
};

export type ICustomerItem = {
  id: string;
  name: string;
  email: string;
  building: string;
  status: string;
  address: string;
  phone: string;
};

export type ICustomerAccountBillingHistory = {
  id: string;
  price: number;
  invoiceNumber: string;
  createdAt: IDateValue;
};
