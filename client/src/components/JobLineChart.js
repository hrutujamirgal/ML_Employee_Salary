import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Text,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Button } from "antd";
import Navbar from "./NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Chart = () => {
  const x = "year";
  const [y, setY] = useState(null);
  const [data, setData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/mainTable").then((response) => {
      setData(response.data);
      console.log(response.data);
    });
  }, []);

  const handley = (value) => {
    setY(value);
  };

  const listy = [
    { key: "select", value: "Select" },
    { key: "totalJobs", value: "Total Jobs in Year" },
    { key: "averageSalary", value: "Average Salary in USD" },
  ];

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

      <div className="container m-8">
        <div className="input m-10 ">
          <span className="text-2xl  font-serif"> X_Axis: Year</span>

          <span className="text-2xl font-serif ml-10">Select Y_Axis: </span>
          <select
            name="Select Y-axis"
            className="ml-10 w-30 h-30 border border-lightBlue rounded-md px-2 py-2"
            onChange={(e) => handley(e.target.value)}
          >
            {listy.map((val) => (
              <option value={val.key}>{val.value}</option>
            ))}
          </select>
        </div>
        {x && y && (
          <ResponsiveContainer width="100%" height={500}>
            <Text
              x={20}
              y={20}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: 20 }}
            >
              {x.toUpperCase() + " vs " + y.toUpperCase() + "(2020-2024)"}
            </Text>
            <LineChart
              data={data}
              margin={{ top: 50, right: 50, left: 50, bottom: 5 }}
            >
              <CartesianGrid stroke="#ccc" horizontal={true} vertical={false} />
              <XAxis dataKey={x} />
              <YAxis dataKey={y} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={x}
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey={y} stroke="#3b3d99" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </>
  );
};

export default Chart;
