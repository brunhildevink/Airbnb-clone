import React from "react";
import { Alert, Divider, Skeleton } from "antd";

import "./styles/listingsSkeleton.css";

export interface Props {
  title: string;
  error?: boolean;
}

export const ListingsSkeleton: React.FC<Props> = ({ title, error = false }) => {
  const errorAlert = error && (
    <Alert
      type="error"
      className="listings-skeleton-alert"
      message="Uh oh! Something went wrong - please try again later :("
    />
  );

  return (
    <div className="listings-skeleton">
      {errorAlert}
      <h2>{title}</h2>
      <Skeleton active paragraph={{ rows: 1 }} />
      <Divider />
      <Skeleton active paragraph={{ rows: 1 }} />
      <Divider />
      <Skeleton active paragraph={{ rows: 1 }} />
    </div>
  );
};
