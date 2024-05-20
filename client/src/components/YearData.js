import React, { useState, useEffect } from "react";
import { Table,  Space, Radio, Button } from "antd";
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
  const [sortColumn, setSortColumn] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    const year = cookies.year;
    if (year) {
      axios
        .get(`http://localhost:5000/jobYear/${year}`)
        .then((response) => {
          setData(response.data);
          
        })
    }
  }, [cookies]);



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


  const handleInsight = ()=>{

    setCookies("insight", cookies.year)
    navigate('/yearData')
    // <DataInsight/>
  }


  const toggleSortOrder = () => {
    setIsAscending(!isAscending);
    handleSort(sortColumn);
  };

  return (
    <>
      <Navbar />
      <h1 className="text-3xl text-left ml-10 mt-10 font-serif font-bold">Jobs in the {cookies.year}</h1>
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
          <Radio.Group onChange={toggleSortOrder}>
            <Radio.Button value="aes">Ascending</Radio.Button>
            <Radio.Button value="des">Descending</Radio.Button>
          </Radio.Group>
        </Space>


        <Button type="primary" shape="round"  size="medium" className = " ml-10" onClick={handleInsight} >
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
