import React, { useState, useEffect } from "react";
import { Table, Spin, Alert, Space, Radio } from "antd";
import axios from "axios";
import { useCookies } from "react-cookie";
import Navbar from "./NavBar";

const columns = [
  {
    title: "Year",
    dataIndex: "year",
    key: "year",
  },
  {
    title: "Job Title",
    dataIndex: "jobTitle",
    key: "jobTitle",
  },
  {
    title: "No of Jobs in Year",
    dataIndex: "totalJobs",
    key: "totalJobs",
  },
  {
    title: "Average Salary in USD",
    dataIndex: "averageSalary",
    key: "averageSalary",
  },
];

const YearData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cookies] = useCookies(["year"]);
  const [isAscending, setIsAscending] = useState(true);
  const [sortColumn, setSortColumn] = useState("");

  useEffect(() => {
    const year = cookies.year;
    if (year) {
      axios
        .get(`http://localhost:5000/jobYear/${year}`)
        .then((response) => {
          setData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [cookies]);

  if (loading) {
    return <Spin tip="Loading..." className="center"/>;
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description="Failed to fetch data from the server."
        type="error"
        showIcon
      />
    );
  }

  const handleSort = (columnKey) => {
    setSortColumn(columnKey);

    const sortedData = [...data].sort((a, b) => {
      if (isAscending) {
        return a[columnKey] < b[columnKey]
          ? -1
          : a[columnKey] > b[columnKey]
          ? 1
          : 0;
      } else {
        return a[columnKey] > b[columnKey]
          ? -1
          : a[columnKey] < b[columnKey]
          ? 1
          : 0;
      }
    });
    setData(sortedData);
  };

  const toggleSortOrder = () => {
    setIsAscending(!isAscending);
    handleSort(sortColumn);
  };

  return (
    <>
      <Navbar />
      <div className="flex-row px-10 m-10 border-black">
        <span className="font-2xl">Sort According: </span>
        <select
          name="SortAccording"
          className="ml-10 w-30 h-30 border border-lightBlue rounded-md"
          onChange={(e) => handleSort(e.target.value)}
        >
          <option value="totalJobs">No of Jobs</option>
          <option value="averageSalary">Average Salary in USD</option>
        </select>

        <Space className="ml-10">
          <Radio.Group onChange={toggleSortOrder}>
            <Radio.Button value="aes">Ascending</Radio.Button>
            <Radio.Button value="des">Descending</Radio.Button>
          </Radio.Group>
        </Space>
      </div>

      <div className="w-100 m-10 border border-veryLightBlue rounded-md">
        <Table columns={columns} dataSource={data} rowKey="_id" />
      </div>
    </>
  );
};

export default YearData;
