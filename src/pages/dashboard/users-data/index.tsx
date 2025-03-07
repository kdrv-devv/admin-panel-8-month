import { useEffect, useState } from "react";
import { Table } from "antd";
import { useAxios } from "../../../hooks/useAxios";
import type { TableProps } from "antd";
import { MovieTicketData } from "../../../@types";

const columns: TableProps<MovieTicketData>["columns"] = [
  
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (text) => <span>{text}+</span>,
  },
  {
    title: "Phone number",
    dataIndex: "phonenumber",
    key: "phonenumber",
  },
];

const Orders = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();

  useEffect(() => {
    axios({
      url: "/user/get-all-users",
      method: "GET",
    }).then((data) => {
      setLoading(false), setTickets(data.data?.data);
    });
  }, []);

  return (
    <div>
      <h1 className="text-[30px] text-[#1677ff]">Available USERS</h1>
      <div className="list mt-4">
        <Table
          columns={columns}
          dataSource={tickets}
          loading={loading}
          rowKey="key"
          scroll={{ x: "max-content" }}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default Orders;
