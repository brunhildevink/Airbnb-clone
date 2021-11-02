import React from "react";
import { RouteComponentProps } from "react-router";
import { useQuery } from "@apollo/client";
import { Col, Layout, Row } from "antd";

import { USER } from "../../lib/graphql/queries";
import {
  User as UserData,
  UserVariables,
} from "../../lib/graphql/queries/User/__generated__/User";
import { UserProfile } from "./components/";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { Viewer } from "../../lib/types";

interface Props {
  viewer: Viewer;
}

interface MatchParams {
  id: string;
}

export const User = ({
  match,
  viewer,
}: Props & RouteComponentProps<MatchParams>) => {
  const { Content } = Layout;
  const { data, error, loading } = useQuery<UserData, UserVariables>(USER, {
    variables: {
      id: match.params.id,
    },
  });

  const user = data ? data.user : null;
  const viewerIsUser = viewer.id === match.params.id;
  const userProfileElement = user ? (
    <UserProfile user={user} viewerIsUser={viewerIsUser} />
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
      <Row gutter={12} justify="space-between">
        <Col xs={24}>{userProfileElement}</Col>
      </Row>
    </Content>
  );
};
