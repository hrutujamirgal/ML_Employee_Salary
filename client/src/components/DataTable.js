import React, { useState, useEffect } from "react";
import { Table, Spin, Alert } from "antd";
import axios from "axios";

const columns = [
  {
    title: "Year",
    dataIndex: "year",
    key: "year",
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

const DataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/mainTable")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spin tip="Loading..." />;
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
    const sortedData = [...data].sort((a, b) => {
      if (a[columnKey] < b[columnKey]) {
        return -1;
      }
      if (a[columnKey] > b[columnKey]) {
        return 1;
      }
      return 0;
    });
    setData(sortedData);
  };

  return (
    <>
      <div className="flex-row px-10 m-10 border-black">
        <span className="font-2xl">Sort According: </span>
        <select
          name="SortAccording"
          className="ml-10 w-30 h-30"
          onChange={(e) => handleSort(e.target.value)}
        >
          <option value="year" className="font-20">
            Year
          </option>
          <option value="totalJobs">No of Jobs in that Year</option>
          <option value="averageSalary">Average Salary in USD</option>
        </select>

      </div>

      <div className="w-2/3 m-10 border border-midnight">

        <Table columns={columns} dataSource={data} rowKey="_id" />
      </div>
    </>
  );
};

export default DataTable;
