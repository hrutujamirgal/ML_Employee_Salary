import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import Navbar from "./NavBar";
import axios from "axios";
import { useCookies } from "react-cookie";

const DataInsight = () => {
  const [x, setX] = useState(null);
  const [y, setY] = useState(null);
  const [data, setData] = useState([]);

  const [cookies] = useCookies(["insight"]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/jobYear/${cookies.year}`)
      .then((response) => {
        setData(response.data);
      });
  }, [cookies.year]);

  const handlefind = (value) => {
    const parsedValue = JSON.parse(value);
    setX(parsedValue.x);
    setY(parsedValue.y);
  };

  const list = [

    { key: "select", value: "Select Insight" },
    { key: JSON.stringify({ x: "jobTitle", y: "totalJobs" }), value: "Job Titles vs No of Jobs" },
    { key: JSON.stringify({ x: "jobTitle", y: "averageSalary" }), value: "Job Title vs Salary" },
  ];

  return (
    <>
      <Navbar />

      <div className="container m-10">
        <h1 className="text-2xl font-serif font-bold ">{cookies.year} Data Insights</h1>

        <div className="input m-10 ">
          <span className="text-2xl font-serif">Select the Parameter: </span>
          <select
            name="Select X-axis"
            className="ml-10 w-30 h-30 border border-lightBlue rounded-md px-2 py-2"
            onChange={(e) => handlefind(e.target.value)}
          >
            {list.map((val) => (
              <option key={val.key} value={val.key}>
                {val.value}
              </option>
            ))}
          </select>
        </div>
        {x && y && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '10px', fontSize: '20px' }}>
              {x.toUpperCase()} vs {y.toUpperCase()} ({cookies.year})
            </div>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={data} margin={{ top: 50, right: 50, left: 50, bottom: 5 }}>
              <CartesianGrid stroke="#ccc" horizontal={true} vertical={false}/>
                <XAxis dataKey={x} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey={y} stroke="#3b3d99" />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </>
  );
};

export default DataInsight;
