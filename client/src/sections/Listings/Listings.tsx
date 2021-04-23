import { useQuery, useMutation, gql } from "@apollo/client";
import {
  DeleteListingData,
  DeleteListingVariables,
  ListingsData,
} from "./types";

const LISTINGS = gql`
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

const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

const imageStyle = {
  height: "200px",
  maxWidth: "100%",
};

const listingsStyle = {
  display: "flex",
  flexFlow: "row wrap",
  padding: "0",
};

const buttonStyle = {
  display: "block",
  width: "100%",
  marginTop: "8px",
  background: "#c64756",
  padding: "8px",
  borderRadius: "4px",
  border: "none",
  color: "white",
  cursor: "pointer",
};

const cardStyle = {
  display: "flex",
  flexFlow: "column",
  maxWidth: "300px",
  minHeight: "300px",
  justifyContent: "space-between",
  margin: "20px 40px 20px 0",
  boxShadow: "2px 2px 8px 4px rgba(0,0,0,0.15)",
  borderRadius: "4px",
  overflow: "hidden",
};

const contentStyle = {
  padding: "20px",
};

const wrapperStyle = {
  padding: "0 200px",
  margin: "0 auto",
  maxWidth: "1400px",
};

export interface Props {
  title: string;
}

export const Listings = ({ title }: Props) => {
  const { data, error, loading, refetch } = useQuery<ListingsData>(LISTINGS);

  const listings = data ? data.listings : [];

  const [
    deleteListing,
    { loading: deleteListingLoading, error: deleteListingError },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

  const handleDeleteListing = async (id: string) => {
    await deleteListing({ variables: { id } });
    refetch();
  };

  const listingsList = listings.map((listing) => (
    <li key={listing.id} style={cardStyle}>
      <img style={imageStyle} src={listing.image} alt="listing" />
      <div style={contentStyle}>
        <span>{listing.title}</span>
        <button
          style={buttonStyle}
          onClick={() => handleDeleteListing(listing.id)}
        >
          Delete
        </button>
      </div>
    </li>
  ));

  const deleteListingLoadingMessage = deleteListingLoading ? (
    <h4>Deleting...</h4>
  ) : null;

  const deleteListingErrorMessage = deleteListingError ? (
    <h4>Uh oh! Something went wrong while deleting this listing...</h4>
  ) : null;

  if (loading) return <h2>Loading...</h2>;

  if (error)
    return <h2>Uh oh! Something went wrong - please try again later :(</h2>;

  return (
    <div style={wrapperStyle}>
      <h2>{title}</h2>
      {listings.length > 0 ? (
        <>
          <ul style={listingsStyle}>{listingsList}</ul>
          {deleteListingLoadingMessage}
          {deleteListingErrorMessage}
        </>
      ) : (
        <div>No listings</div>
      )}
    </div>
  );
};
