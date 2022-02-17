import React from "react";
import { Button, Card, DatePicker, Divider, Typography } from "antd";
import moment, { Moment } from "moment";

import { displayErrorMessage, formatListingPrice } from "../../../../lib/utils";
import { Viewer } from "../../../../lib/types";
import { Listing as ListingData } from "../../../../lib/graphql/queries/Listing/__generated__/Listing";
import { BookingsIndex } from "./types";

const { Paragraph, Text, Title } = Typography;

interface Props {
  bookingsIndex: ListingData["listing"]["bookingsIndex"];
  checkInDate: Moment | null;
  checkOutDate: Moment | null;
  host: ListingData["listing"]["host"];
  price: number;
  setCheckInDate: (checkInDate: Moment | null) => void;
  setCheckOutDate: (checkOutDate: Moment | null) => void;
  setModalVisible: (modalVisible: boolean) => void;
  viewer: Viewer;
}

export const ListingCreateBooking = ({
  bookingsIndex,
  checkInDate,
  checkOutDate,
  host,
  price,
  setCheckInDate,
  setCheckOutDate,
  setModalVisible,
  viewer,
}: Props) => {
  const bookingsIndexJSON: BookingsIndex = JSON.parse(bookingsIndex);

  const dateIsBooked = (currentDate: Moment): boolean => {
    const year = moment(currentDate).year();
    const month = moment(currentDate).month();
    const day = moment(currentDate).date();

    if (bookingsIndexJSON[year] && bookingsIndexJSON[year][month]) {
      return Boolean(bookingsIndexJSON[year][month][day]);
    } else {
      return false;
    }
  };

  const disabledDate = (currentDate?: Moment): boolean => {
    if (currentDate) {
      const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf("day"));

      return dateIsBeforeEndOfDay || dateIsBooked(currentDate);
    } else {
      return false;
    }
  };

  const verifyAndSetCheckOutDate = (selectedCheckOutDate: Moment | null) => {
    if (checkInDate && selectedCheckOutDate) {
      if (moment(selectedCheckOutDate).isBefore(checkInDate, "days")) {
        return displayErrorMessage(
          `You can't book date of check out to be prior to check in!`
        );
      }
    }

    let dateCursor = checkInDate;

    while (moment(dateCursor).isBefore(selectedCheckOutDate, "days")) {
      dateCursor = moment(dateCursor).add(1, "days");
    }

    setCheckOutDate(selectedCheckOutDate);

    const year = moment(dateCursor).year().toString();
    const month = moment(dateCursor).month().toString();
    const day = moment(dateCursor).date().toString();

    console.log(bookingsIndexJSON[year][month]);

    if (
      bookingsIndexJSON[year] &&
      bookingsIndexJSON[year][month] &&
      bookingsIndexJSON[year][month][day]
    ) {
      return displayErrorMessage(
        "You can't book a period of time that overlaps existing bookings. Please try again!"
      );
    }
  };

  const viewerIsHost = viewer.id === host.id;
  const checkInInputDisabled = !viewer.id || viewerIsHost || !host.hasWallet;
  const checkOutInputDisabled = checkInInputDisabled || !checkInDate;
  const buttonDisabled = checkOutInputDisabled || !checkInDate || !checkOutDate;

  let buttonMessage = "You won't be charged yet";

  if (!viewer.id) {
    buttonMessage = "You have to be signed in to book a listing!";
  } else if (viewerIsHost) {
    buttonMessage = "You can't book your own listing!";
  } else if (!host.hasWallet) {
    buttonMessage =
      "The host has disconnected from Stripe and thus won't be able to receive payments.";
  }

  return (
    <div className="listing-booking">
      <Card className="listing-booking__card">
        <div>
          <Paragraph>
            <Title level={2} className="listing-booking__card-title">
              {formatListingPrice(price)}
              <span>/day</span>
            </Title>
          </Paragraph>
          <Divider />
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check In</Paragraph>
            <DatePicker
              disabled={checkInInputDisabled}
              disabledDate={disabledDate}
              format={"YYYY/MM/DD"}
              onOpenChange={() => setCheckOutDate(null)}
              onChange={(dateValue) => setCheckInDate(dateValue)}
              showToday={false}
              value={checkInDate ? checkInDate : undefined}
            />
          </div>
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check Out</Paragraph>
            <DatePicker
              disabled={checkOutInputDisabled}
              disabledDate={disabledDate}
              format={"YYYY/MM/DD"}
              value={checkOutDate ? checkOutDate : undefined}
              onChange={(dateValue) => verifyAndSetCheckOutDate(dateValue)}
              showToday={false}
            />
          </div>
        </div>
        <Divider />
        <Button
          disabled={buttonDisabled}
          size="large"
          type="primary"
          className="listing-booking__card-cta"
          onClick={() => setModalVisible(true)}
        >
          Request to book!
        </Button>
        <Text type="secondary" mark>
          {buttonMessage}
        </Text>
      </Card>
    </div>
  );
};
