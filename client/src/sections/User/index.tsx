import React, { useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@apollo/client";
import { Col, Layout, Row } from "antd";

import { USER } from "../../lib/graphql/queries";
import {
  User as UserData,
  UserVariables,
} from "../../lib/graphql/queries/User/__generated__/User";
import { UserBookings, UserListings, UserProfile } from "./components/";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { Viewer } from "../../lib/types";
import { useScrollToTop } from "../../lib/hooks";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

interface MatchParams {
  id: string;
}

export const User = ({ viewer, setViewer }: Props) => {
  const { id } = useParams<MatchParams>();
  const [listingsPage, setListingsPage] = useState<number>(1);
  const [bookingsPage, setBookingsPage] = useState<number>(1);
  const PAGE_LIMIT: number = 4;
  const { Content } = Layout;
  const { data, error, loading, refetch } = useQuery<UserData, UserVariables>(
    USER,
    {
      variables: {
        id,
        bookingsPage,
        listingsPage,
        limit: PAGE_LIMIT,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  useScrollToTop();

  const user = data ? data.user : null;
  const viewerIsUser = viewer.id === id;

  const userListings = user ? user.listings : null;
  const userBookings = user ? user.bookings : null;

  const stripeError = new URL(window.location.href).searchParams.get(
    "stripe_error"
  );

  const handleUserRefetch = async () => {
    await refetch();
  };

  const stripeErrorBanner = stripeError ? (
    <ErrorBanner description="We had an issue connecting with Stripe. Please try again soon." />
  ) : null;

  const userProfileElement = user ? (
    <UserProfile
      user={user}
      viewer={viewer}
      viewerIsUser={viewerIsUser}
      setViewer={setViewer}
      handleUserRefetch={handleUserRefetch}
    />
  ) : null;

  const userListingsElement = userListings ? (
    <UserListings
      userListings={userListings}
      listingsPage={listingsPage}
      limit={PAGE_LIMIT}
      setListingsPage={setListingsPage}
    />
  ) : null;

  const userBookingsElement = userBookings ? (
    <UserBookings
      userBookings={userBookings}
      bookingsPage={bookingsPage}
      limit={PAGE_LIMIT}
      setBookingsPage={setBookingsPage}
    />
  ) : null;

  if (loading) {
    return (
      <Content className="user">
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="user">
        <ErrorBanner description="This user might not exist or we've encountered an error. Please try again later." />
      </Content>
    );
  }

  return (
    <Content className="user">
      {stripeErrorBanner}
      <Row gutter={12} justify="space-between">
        <Col xs={24}>{userProfileElement}</Col>
        <Col xs={24}>{userListingsElement}</Col>
        <Col xs={24}>{userBookingsElement}</Col>
      </Row>
    </Content>
  );
};
