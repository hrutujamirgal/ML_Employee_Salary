import React from "react";
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
import { Flex } from "antd";

const JobLineChart = ({ data }) => {
  return (
    <>
        <Flex justify="space-evenly" align="center">
          <ResponsiveContainer width="50%" height={250}>
            <Text
              x={20}
              y={20}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: 20 }}
            >
              Jobs in the passing Year (2020-2024)
            </Text>
            <LineChart
              data={data}
              margin={{ top: 20, right: 50, left: 50, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="10 5" />
              <XAxis dataKey="year" />
              <YAxis dataKey="totalJobs" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="totalJobs"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="year" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="50%" height={250}>
            <Text
              x={20}
              y={20}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: 20 }}
            >
              Average Salary in the Passing Year(2020-2024)
            </Text>
            <LineChart
              data={data}
              margin={{ top: 30, right: 50, left: 50, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="20 5" />
              <XAxis dataKey="year" />
              <YAxis dataKey="averageSalary" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="totalJobs"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="averageSalary" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Flex>
    </>
  );
};

export default JobLineChart;
