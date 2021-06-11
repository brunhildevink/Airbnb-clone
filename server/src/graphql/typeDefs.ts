import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Listing {
    id: ID!
    address: String!
    admin: String!
    bookings: [ID]!
    city: String!
    country: String!
    description: String!
    host: String!
    image: String
    numOfGuests: Int
    price: Int!
    title: String!
    type: String
  }

  type Query {
    listings: [Listing!]!
  }

  type Mutation {
    deleteListing(id: ID!): Listing!
  }
`;
