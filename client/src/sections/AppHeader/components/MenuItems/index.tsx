import React from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Avatar, Button, Menu } from "antd";
import { LogOut as LogOutData } from "../../../../lib/graphql/mutations/LogOut/__generated__/LogOut";
import { LOG_OUT } from "../../../../lib/graphql/mutations";
import {
  displayErrorMessage,
  displaySuccessNotification,
} from "../../../../lib/utils";
import { HomeOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";

import { Viewer } from "../../../../lib/types";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Item, SubMenu } = Menu;

export const MenuItems = ({ viewer, setViewer }: Props) => {
  const [logOut] = useMutation<LogOutData>(LOG_OUT, {
    onCompleted: (data) => {
      if (data && data.logOut && data.logOut.token) {
        setViewer(data.logOut);
        sessionStorage.removeItem("token");
        displaySuccessNotification("You were succesfully signed out!");
      }
    },
    onError: () => {
      displayErrorMessage(
        "Uh oh, something went wrong while trying to log you out, please try again later."
      );
    },
  });

  const handleLogOut = () => {
    logOut();
  };

  const subMenuLogin =
    viewer.id && viewer.avatar ? (
      <SubMenu title={<Avatar src={viewer.avatar} />}>
        <Item key="/user">
          <Link to={`/user/${viewer.id}`}>
            <UserOutlined />
            Profile
          </Link>
        </Item>
        <Item key="/logout">
          <div onClick={handleLogOut}>
            <LogoutOutlined />
            Log out
          </div>
        </Item>
      </SubMenu>
    ) : (
      <Item>
        <Link to="/login">
          <Button type="primary">Sign in</Button>
        </Link>
      </Item>
    );

  return (
    <Menu mode="horizontal" selectable={false} className="menu">
      <Item key="host">
        <Link to="/host">
          <HomeOutlined />
          Host
        </Link>
      </Item>
      {subMenuLogin}
    </Menu>
  );
};
