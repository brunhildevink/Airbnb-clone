import { useState } from "react";
import { server } from "../../lib/api";
import {
  DeleteListingData,
  DeleteListingVariables,
  Listing,
  ListingsData,
} from "./types";

const LISTINGS = `
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBaths
      numOfBeds
      rating
    }
  }
`;

const DELETE_LISTING = `
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

export interface Props {
  title: string;
}

export const Listings = ({ title }: Props) => {
  const [listings, setListings] = useState<Listing[]>([]);

  const fetchListings = async () => {
    const { data } = await server.fetch<ListingsData>({ query: LISTINGS });
    if (data.listings) setListings(data.listings);
  };

  const deleteListing = async (id: string) => {
    const { data } = await server.fetch<DeleteListingData>({
      query: DELETE_LISTING,
      variables: {
        id,
      },
    });

    fetchListings();
  };

  const listingsList = listings.map((listing) => (
    <li
      key={listing.id}
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "300px",
        minHeight: "300px",
        justifyContent: "space-between",
        margin: "20px",
      }}
    >
      <img src={listing.image} alt="listing" />
      <span>{listing.title}</span>
      <button onClick={() => deleteListing(listing.id)}>Delete</button>
    </li>
  ));

  return (
    <div>
      <h2>{title}</h2>
      <button onClick={fetchListings}>Query Listings</button>
      {listings.length > 0 ? (
        <ul style={{ display: "flex" }}>{listingsList}</ul>
      ) : (
        <div>No listings</div>
      )}
    </div>
  );
};
