import React, { useEffect, useRef } from "react";
import { Button, Card, DatePicker, Divider, Typography } from "antd";
import moment, { Moment } from "moment";
import { Listing as ListingData } from "../../../../lib/graphql/queries/Listing/__generated__/Listing";
import { displayErrorMessage, formatListingPrice } from "../../../../lib/utils";
import { Viewer } from "../../../../lib/types";
import { BookingsIndex } from "./types";

const { Paragraph, Text, Title } = Typography;
const { RangePicker } = DatePicker;

interface Props {
  viewer: Viewer;
  host: ListingData["listing"]["host"];
  price: number;
  bookingsIndex: ListingData["listing"]["bookingsIndex"];
  checkInDate: Moment | null;
  checkOutDate: Moment | null;
  setCheckInDate: (checkInDate: Moment | null) => void;
  setCheckOutDate: (checkOutDate: Moment | null) => void;
  setModalVisible: (modalVisible: boolean) => void;
}

export const ListingCreateBooking = ({
  viewer,
  host,
  price,
  bookingsIndex,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
  setModalVisible,
}: Props) => {
  const bookingsIndexJSON: BookingsIndex = JSON.parse(bookingsIndex);
  const setCheckOutDateRef = useRef(setCheckOutDate);

  useEffect(() => {
    if (checkInDate) {
      setCheckOutDateRef.current(null);
    }
  }, [checkInDate, setCheckOutDateRef]);

  const dateIsBooked = (currentDate: Moment) => {
    const year = moment(currentDate).year();
    const month = moment(currentDate).month();
    const day = moment(currentDate).date();

    if (bookingsIndexJSON[year] && bookingsIndexJSON[year][month]) {
      return Boolean(bookingsIndexJSON[year][month][day]);
    } else {
      return false;
    }
  };

  const disabledDate = (currentDate?: Moment) => {
    if (currentDate) {
      const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf("day"));
      const dateIsMoreThanThreeMonthsAhead = moment(currentDate).isAfter(
        moment().endOf("day").add(90, "days")
      );

      return (
        dateIsBeforeEndOfDay ||
        dateIsMoreThanThreeMonthsAhead ||
        dateIsBooked(currentDate)
      );
    } else {
      return false;
    }
  };

  const verifyOverlappingDates = (
    cursor: Moment,
    selectedDate: Moment
  ): boolean => {
    let dateCursor = cursor;

    while (moment(dateCursor).isBefore(selectedDate, "days")) {
      dateCursor = moment(dateCursor).add(1, "days");

      const year = moment(dateCursor).year();
      const month = moment(dateCursor).month();
      const day = moment(dateCursor).date();

      if (
        bookingsIndexJSON[year] &&
        bookingsIndexJSON[year][month] &&
        bookingsIndexJSON[year][month][day]
      ) {
        return true;
      }
    }

    return false;
  };

  const verifyAndSetCheckInDate = (selectedCheckInDate: Moment) => {
    if (checkOutDate) {
      if (verifyOverlappingDates(checkOutDate, selectedCheckInDate)) {
        return displayErrorMessage(
          "You can't book a period of time that overlaps existing bookings. Please try again!"
        );
      }
    }

    setCheckInDate(selectedCheckInDate);
  };

  const verifyAndSetCheckOutDate = (selectedCheckOutDate: Moment) => {
    if (checkInDate) {
      if (moment(selectedCheckOutDate).isBefore(checkInDate, "days")) {
        return displayErrorMessage(
          `You can't book date of check out to be prior to check in!`
        );
      }

      if (verifyOverlappingDates(checkInDate, selectedCheckOutDate)) {
        return displayErrorMessage(
          "You can't book a period of time that overlaps existing bookings. Please try again!"
        );
      }
    }

    setCheckOutDate(selectedCheckOutDate);
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
      "The host has disconnected from Stripe and thus won't be able to receive payments!";
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
          <div>
            <Paragraph strong>Choose dates</Paragraph>
            <RangePicker
              value={[checkInDate, checkOutDate]}
              format={"YYYY/MM/DD"}
              disabled={checkInInputDisabled}
              size="large"
              disabledDate={disabledDate}
              onCalendarChange={(dates) => {
                if (dates) {
                  dates[0] && verifyAndSetCheckInDate(dates[0]);
                  dates[1] && verifyAndSetCheckOutDate(dates[1]);
                }
              }}
              renderExtraFooter={() => (
                <div>
                  <Text type="secondary" className="ant-calendar-footer-text">
                    You can only book a listing within 90 days from today.
                  </Text>
                </div>
              )}
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
