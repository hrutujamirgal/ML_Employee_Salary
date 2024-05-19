import React, { useState, useEffect } from "react";
import { Table, Spin, Alert } from "antd";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import JobLineChart from "./JobLineChart";
import Navbar from "./NavBar";

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
  const [error, setError] = useState(null);

  const [, setCookie] = useCookies("year")

  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get("http://localhost:5000/mainTable")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);


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



  const handleRowClick = (record) => {
    setCookie("year",record.year);
    navigate("/year");
  };

  

  return (
    <>

    <Navbar/>
    <div className="m-10">

      <span className="font-3xl font-bold font-serif">No of Job in that Year</span>
      <div  className="m-5">
        <span className="font-2xl font-bold">Sort According: </span>
        <select
          name="SortAccording"
          className="ml-10 w-30 h-30 border border-lightBlue rounded-md"
          onChange={(e) => handleSort(e.target.value)}
        >
          <option value="year" className="font-xl">
            Year
          </option>
          <option value="totalJobs">No of Jobs in that Year</option>
          <option value="averageSalary">Average Salary in USD</option>
        </select>
      </div>

      <div className="w-100 m-10 border border-veryLightBlue rounded-md" >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="_id"
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      </div>
      <div>
        <JobLineChart data = {data} />
      </div>
      </div>
    </>
  );
};

export default DataTable;