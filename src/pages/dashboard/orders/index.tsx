import { useEffect, useState } from "react";
import { Table } from "antd";
import { useAxios } from "../../../hooks/useAxios";
import type { TableProps } from "antd";
import { MovieTicketData } from "../../../@types";

const columns: TableProps<MovieTicketData>["columns"] = [
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    render: (text) => (
      <img
        className="w-[50px] h-[50px] object-cover"
        src={text}
        alt="Movie Poster"
      />
    ),
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Age Restriction",
    dataIndex: "ageRestriction",
    key: "ageRestriction",
    render: (text) => <span>{text}+</span>,
  },
  {
    title: "Available Date",
    dataIndex: "availableDate",
    key: "availableDate",
  },
  {
    title: "Available Time",
    dataIndex: "availableTime",
    key: "availableTime",
  },
  {
    title: "Country",
    dataIndex: "country",
    key: "country",
  },
  {
    title: "Hall Number",
    dataIndex: "hallNumber",
    key: "hallNumber",
  },
  {
    title: "Price ($)",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Ticket Count",
    dataIndex: "ticket_count",
    key: "ticket_count",
  },
];

const Orders = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();

  useEffect(() => {
    axios({
      url: "/admin/get-movies",
      method: "GET",
    }).then((data) => {
      setLoading(false), setTickets(data.data?.data);
    });
  }, []);

  return (
    <div>
      <h1 className="text-[30px] text-[#1677ff]">Available tickets</h1>
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
