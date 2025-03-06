import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { RiMovie2AiFill } from "react-icons/ri";
import { FaUsersBetweenLines } from "react-icons/fa6";

import { LuTickets } from "react-icons/lu";

import { Button, Layout, Menu, theme } from "antd";

import headerImg from "../../assets/header-logo.png";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  return (
    <Layout>
      <Sider
        trigger={null}
        className="h-screen"
        collapsible
        collapsed={collapsed}
      >
        <div className="flex items-center justify-start p-4">
          <img src={headerImg} className="mb-4" alt="" />
        </div>

        <Menu
          theme="dark"
          mode="inline"
          onClick={(e: any) => navigate(e.key)}
          defaultSelectedKeys={["/"]}
          items={[
            {
              key: "/",
              icon: <LuTickets />,
              label: "Tickets",
            },
            {
              key: "/movies",
              icon: <RiMovie2AiFill />,
              label: "Movies",
            },
            {
              key: "/users",
              icon: <FaUsersBetweenLines />,
              label: "Users data",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
