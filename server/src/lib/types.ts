import { Collection, ObjectId } from "mongodb";

export enum ListingType {
  Apartment = "APARTMENT",
  House = "HOUSE",
}

export interface BookingsIndexMonth {
  [key: string]: boolean;
}

export interface BookingsIndexYear {
  [key: string]: BookingsIndexMonth;
}

export interface BookingIndex {
  [key: string]: BookingsIndexYear;
}

export interface Listing {
  _id: ObjectId;
  address: string;
  admin: string;
  bookings: ObjectId[];
  bookingsIndex: BookingIndex;
  city: string;
  country: string;
  description?: string;
  host: string;
  image?: string;
  numOfGuests?: number;
  price: number;
  title: string;
  type?: ListingType;
}

export interface Booking {
  _id: ObjectId;
  checkIn: string;
  checkOut: string;
  listing: ObjectId;
  tenant: string;
}

export interface User {
  _id: string;
  avatar: string;
  bookings: ObjectId[];
  contact: string;
  income: number;
  listings: ObjectId[];
  name: string;
  token: string;
  walletId?: string;
}

export interface Database {
  bookings: Collection<Booking>;
  listings: Collection<Listing>;
  users: Collection<User>;
}
