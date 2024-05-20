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
import Navbar from "./NavBar";
import axios from "axios";

const Chart = () => {
  const [x, setX] = useState(null);
  const y = "averageSalary"
  const [data, setData] = useState()

  useEffect(()=>{
    axios
      .get(`http://localhost:5000/getInsight/${x}`)
      .then((response) => {
        setData(response.data);
        console.log(response.data)
      })
  }, [x])

  const handlex = (value) => {
    setX(value);
  };



  const listx = ([
     {key:"experience_level", value: "Experience Level"},

     {key:"employment_type", value: "Employment Type"},

     {key:"job_title", value: "Job title"},

     {key:"company_size", value: "Company Size"},

     {key:"company_location", value: "Company Location"},

  ])



  return (
    <>
      <Navbar />

      <div className="container m-10">

      
      <div className="input m-10 ">
        <span className="text-xl font-serif">Select the graph Beetween: </span>
        <select
          name="Select X-axis"
          className="ml-10 w-30 h-30 border border-lightBlue rounded-md px-2 py-2"
          onChange={(e) => handlex(e.target.value)}
        >
            {listx.map((val) => (<option value={val.key} >{val.value}</option>))}
          
        </select>

        <span className="ml-5 text-xl font-serif">
          vs Salary in USD
        </span>
        
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
          <CartesianGrid stroke="#ccc" horizontal={true} vertical={false}/>
          <XAxis dataKey={x} />
          <YAxis dataKey={y} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="totalJobs"
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
