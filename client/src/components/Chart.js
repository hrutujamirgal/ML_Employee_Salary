import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Text,
  ResponsiveContainer,
} from "recharts";
import Navbar from "./NavBar";
import axios from "axios";

const Chart = () => {
  const [x, setX] = useState(null);
  const [y, setY] = useState(null);
  const [data, setData] = useState()

  useEffect(()=>{
    axios
      .get("http://localhost:5000/mainTable")
      .then((response) => {
        setData(response.data);
        console.log(response.data)
      })
  }, [])

  const handlex = (value) => {
    setX(value);
  };

  const handley = (value) => {
    setY(value);
  };



  const listx = ([
     {key:"totalJobs", value: "No of Jobs"},
     {key:"averageSalary", value: "Average Salary in USD"},
     {key:"year", value: "Years"},
  ])

  const listy = ([
    {key:"totalJobs", value: "No of Jobs"},
    {key:"averageSalary", value: "Average Salary in USD"},
 ])



  return (
    <>
      <Navbar />

      <div className="container m-10">

      
      <div className="input m-10 ">
        <span className="font-2xl">Select X_Axis: </span>
        <select
          name="Select X-axis"
          className="ml-10 w-30 h-30 border border-lightBlue rounded-md"
          onChange={(e) => handlex(e.target.value)}
        >
            {listx.map((val) => (<option value={val.key} >{val.value}</option>))}
          
        </select>
        <span className="font-2xl ml-10">Select Y_Axis: </span>
        <select
          name="Select Y-axis"
          className="ml-10 w-30 h-30 border border-lightBlue rounded-md"
          onChange={(e) => handley(e.target.value)}
        >
            {listy.map((val) => (<option value={val.key} >{val.value}</option>))}
          
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
          <CartesianGrid strokeDasharray="10 5" />
          <XAxis dataKey={x} />
          <YAxis dataKey={y} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="totalJobs"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey={y} stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    )}
      </div>
    </>
  );
};

export default Chart;
