const express = require("express");
const cors = require("cors");
const app = express();
// const connectDB = require("./config")
const mongoose = require("mongoose");
const { Configuration, OpenAI } = require("openai");
const faiss = require("faiss-node");
require("dotenv").config();

mongoose.connect("mongodb+srv://hrutujamirgal21:R7DE5Z7pLAW31OQf@mlengineersalaries.pxfmwcu.mongodb.net/?retryWrites=true&w=majority&appName=MlEngineerSalaries");
const dataML = require("./MlSchema");

app.use(cors());
app.use(express.json());

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// async function getData() {
//   const data = await dataML.find();
//   return data;
// }

// const maxRetries = 3;
// const retryDelay = 1000;

// async function createEmbeddings(texts) {
//   const responses = await Promise.all(
//     texts.map(async (text) => {
//       let retries = 0;
//       while (retries < maxRetries) {
//         try {
//           const response = await openai.embeddings.create({
//             model: "text-embedding-ada-002",
//             input: text,
//           });
//           return response;
//         } catch (error) {
//           if (error.code === "ENOBUFS" && retries < maxRetries) {
//             retries++;
//             console.error(`Retry ${retries}/${maxRetries}: ${error.message}`);
//             await new Promise((res) => setTimeout(res, retryDelay));
//           } else {
//             throw error;
//           }
//         }
//       }
//     })
//   );

//   return responses.map((response) => response.data.data[0].embedding);
// }

// async function vectorizeData() {
//   const documents = await getData();
//   const texts = documents.map((doc) => doc.page_content);
//   const embeddings = await createEmbeddings(texts);

//   const index = faiss.IndexFlatL2(embeddings[0].length);
//   const vectors = new Float32Array(embeddings.flat());
//   index.add(vectors);

//   return { index, documents };
// }

// const query = `
// You are given a job to provide insights on machine learning engineer salaries from the year 2020 to 2024. Having th database name as ml_engineer_salaries
// I will provide you with a question regarding ML engineer salaries based on 
// a dataset containing information like work experience, job titles, employee residence country, salary in usd, average salary. 
// Give the equivalent mongodb command to fetch the requested data from the database .

// **Available Data columns:**

// * **Work Year:** This represents the year the data was collected or the year the engineer worked (eg. 2020, 20212, 2022, 2023, 2024).
// * **Experience Level:** This indicates the level of experience of the ML engineer (e.g., Entry-Level, Mid-Level, Senior).
// * **Employment Type:** This specifies the employment arrangement (e.g., Full-Time, Contract).
// * **Job Title:** This describes the specific role of the ML engineer (e.g., Machine Learning Engineer, Research Scientist).
// * **Salary:** This represents the base salary of the ML engineer (might be in a specific currency).
// * **Salary in USD:** This shows the salary converted to US Dollars (if applicable).
// * **Employee Residence:** This indicates the country or region where the ML engineer resides.
// * **Remote Ratio:** This represents the percentage of time the engineer works remotely.
// * **Company Location:** This specifies the location of the company the engineer works for.
// * **Company Size:** This indicates the size of the company (e.g., Startup, Enterprise).


// **Question:**
// {question}

// `;

// const response = `
// You are given a job to convert the the response from the mongodb after retrieval of data from the database to the english response. 

// ** Data Fields:**

// * **Work Year:** This represents the year the data was collected or the year the engineer worked (eg. 2020, 20212, 2022, 2023, 2024).
// * **Experience Level:** This indicates the level of experience of the ML engineer (e.g., Entry-Level, Mid-Level, Senior).
// * **Employment Type:** This specifies the employment arrangement (e.g., Full-Time, Contract).
// * **Job Title:** This describes the specific role of the ML engineer (e.g., Machine Learning Engineer, Research Scientist).
// * **Salary:** This represents the base salary of the ML engineer (might be in a specific currency).
// * **Salary in USD:** This shows the salary converted to US Dollars (if applicable).
// * **Employee Residence:** This indicates the country or region where the ML engineer resides.
// * **Remote Ratio:** This represents the percentage of time the engineer works remotely.
// * **Company Location:** This specifies the location of the company the engineer works for.
// * **Company Size:** This indicates the size of the company (e.g., Startup, Enterprise).

// **Response:**
// {response}
// `;

// async function generateResponseQuery(question) {
//   console.log(question);
//   const prompt = query
//     .replace("{question}", question);
//   const response = await openai.createChatCompletion({
//     model: "gpt-3.5-turbo",
//     messages: [{ role: "system", content: prompt }],
//   });
//   console.log(response)
//   return response.data.choices[0].message.content;
// }

// async function generateResponse(response) {
//   const prompt = responseTemplate.replace("{response}", response);
  
//   const responseMsg = await openai.createChatCompletion({
//     model: "gpt-3.5-turbo",
//     messages: [{ role: "user", content: prompt }],
//     temperature: 0,
//   });

//   return responseMsg.data.choices[0].message.content;
// }

// app.post("/query", async (req, res) => {
//   const { message } = req.body;
//   console.log(message);
//   try {
//     const result = await generateResponseQuery(message);
//     const humanReadableResponse = await generateResponse(queryResult);
//     console.log(result)
//     res.json({ result });
//   } catch (error) {
//     console.error("Error generating response:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.get("/mainTable", async (req, res) => {
  try {
    const data = await dataML.find().distinct("work_year");
    const result = [];
    for (const year of data) {
      const jobs = await dataML.find({ work_year: year }).distinct("job_title");
      const totalJobs = jobs.length;

      const salary = await dataML.find({ work_year: year }, "salary_in_usd");
      const totalSalary = salary.reduce(
        (acc, curr) => acc + curr.salary_in_usd,
        0
      );
      const averageSalary = Math.ceil(totalSalary / totalJobs);

      result.push({
        year: year,
        totalJobs: totalJobs,
        averageSalary: averageSalary,
      });
    }

    res.json(result);
  } catch (error) {
    console.error("Error retrieving data from Collection 2:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/jobYear/:year", async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const jobs = await dataML.distinct("job_title", { work_year: year });

    const result = [];
    for (const job of jobs) {
      const jobInYear = await dataML.find({ work_year: year, job_title: job });
      const totalJobs = jobInYear.length;
      const totalSalary = jobInYear.reduce(
        (acc, curr) => acc + curr.salary_in_usd,
        0
      );
      const averageSalary = Math.ceil(totalSalary / totalJobs); // Calculate average salary and format to 2 decimal places

      result.push({
        year: year,
        jobTitle: job,
        totalJobs: totalJobs,
        averageSalary: averageSalary,
      });
    }

    return res.send(result);
  } catch (error) {
    console.error("Error retrieving job data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getInsight/:key", async (req, res) => {
  try {
    const para = req.params.key;
    const data = await dataML.find().distinct(para);

    const result = [];
    for (const obj of data) {
      const salary = await dataML.find({ [para]: obj }, "salary_in_usd");
      const totalSalary = salary.reduce(
        (acc, curr) => acc + curr.salary_in_usd,
        0
      );
      const averageSalary = Math.ceil(totalSalary / salary.length);

      result.push({
        [para]: obj,
        averageSalary: averageSalary,
      });
    }

    res.json(result);
  } catch (error) {
    console.error("Error retrieving data from Collection 2:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const port = 5000 || 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
