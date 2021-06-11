import { useQuery, useMutation, gql } from "@apollo/client";
import { Alert, Avatar, Button, List, Spin } from "antd";

import { Listings as ListingsData } from "./__generated__/Listings";
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from "./__generated__/DeleteListing";

import { ListingsSkeleton } from "./components";

import "./styles/listings.css";

const LISTINGS = gql`
  query Listings {
    listings {
      id
      address
      image
      numOfGuests
      price
      title
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

  const listingsList = (
    <List
      itemLayout="horizontal"
      dataSource={listings}
      renderItem={(listing) => (
        <List.Item
          actions={[
            <Button
              style={{ borderRadius: "4px" }}
              type="primary"
              onClick={() => handleDeleteListing(listing.id)}
            >
              Delete listing
            </Button>,
          ]}
        >
          <List.Item.Meta
            avatar={
              <Avatar
                src={listing.image}
                size={48}
                shape="square"
                style={{ borderRadius: "4px" }}
              />
            }
            title={listing.title}
            description={listing.address}
          />
        </List.Item>
      )}
    />
  );

  const deleteListingErrorAlert = deleteListingError && (
    <Alert
      type="error"
      className="listings-skeleton-alert"
      message="Uh oh! Something went wrong - please try again later :("
    />
  );

  if (loading)
    return (
      <div className="listings">
        <ListingsSkeleton title={title} />
      </div>
    );

  if (error)
    return (
      <div className="listings">
        <ListingsSkeleton title={title} error />
      </div>
    );

  return (
    <div className="listings">
      <Spin spinning={deleteListingLoading}>
        {deleteListingErrorAlert}
        <h2>{title}</h2>
        {listings.length > 0 ? <>{listingsList}</> : <div>No listings</div>}
      </Spin>
    </div>
  );
};
