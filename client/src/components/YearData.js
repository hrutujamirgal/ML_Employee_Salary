/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import { Table, Space, Radio, Button } from "antd";
import axios from "axios";
import { useCookies } from "react-cookie";
import Navbar from "./NavBar";
import { useNavigate } from "react-router-dom";

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
  const [cookies, setCookies] = useCookies(["year"]);
  const [isAscending, setIsAscending] = useState(true);
  const [sortColumn, setSortColumn] = useState("totalJobs");
  const navigate = useNavigate();

  // Fetch data only once on component mount
  useEffect(() => {
    const year = cookies.year;
    if (year) {
      axios
        .get(`http://localhost:5000/jobYear/${year}`)
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [cookies.year]);

  const handleSort = useCallback((columnKey) => {
    setSortColumn(columnKey);
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const sortedData = [...data].sort((a, b) => {
        if (isAscending) {
          return a[sortColumn] < b[sortColumn]
            ? -1
            : a[sortColumn] > b[sortColumn]
            ? 1
            : 0;
        } else {
          return a[sortColumn] > b[sortColumn]
            ? -1
            : a[sortColumn] < b[sortColumn]
            ? 1
            : 0;
        }
      });
      setData(sortedData);
    }
  }, [isAscending, sortColumn]);

  const toggleSortOrder = (val) => {
    setIsAscending(val === "aes");
  };

  const handleInsight = () => {
    setCookies("insight", cookies.year);
    navigate("/yearData");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Navbar />

      <Button
          type="default"
          shape="round"
          size="medium"
          className="ml-10 mt-5"
          onClick={handleBack}
        >
          Back
        </Button>
      <h1 className="text-3xl text-left ml-10 mt-5 font-serif font-bold">
        Jobs in the {cookies.year}
      </h1>
      <div className="flex-row px-10 m-10 border-black">
        <span className="text-xl font-serif">Sort According: </span>
        <select
          name="SortAccording"
          className="ml-10 w-30 h-30 border border-lightBlue rounded-md px-2 py-2"
          onChange={(e) => handleSort(e.target.value)}
        >
          <option value="totalJobs">No of Jobs</option>
          <option value="averageSalary">Average Salary in USD</option>
        </select>

        <Space className="ml-10">
          <Radio.Group onChange={(e) => toggleSortOrder(e.target.value)}>
            <Radio.Button value="aes">Ascending</Radio.Button>
            <Radio.Button value="des">Descending</Radio.Button>
          </Radio.Group>
        </Space>

        <Button
          type="primary"
          shape="round"
          size="medium"
          className="ml-10"
          onClick={handleInsight}
        >
          Chart Insights
        </Button>

        
      </div>

      <div className="w-100 m-10 border border-veryLightBlue rounded-md">
        <Table columns={columns} dataSource={data} rowKey="_id" />
      </div>
    </>
  );
};

export default YearData;
