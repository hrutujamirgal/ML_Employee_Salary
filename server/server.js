const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./config")
const { Configuration, OpenAI } = require('openai');
const faiss= require('faiss-node');
require('dotenv').config();

connectDB()


app.use(cors());
app.use(express.json()); 
const dataML = require("./MlSchema")

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



async function getData(){
    const data = await dataML.find(); 
    return data;
}



const maxRetries = 3;
const retryDelay = 1000; 

async function createEmbeddings(texts) {
  const responses = await Promise.all(
    texts.map(async (text) => {
      let retries = 0;
      while (retries < maxRetries) {
        try {
          const response = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: text,
          });
          return response;
        } catch (error) {
          if (error.code === 'ENOBUFS' && retries < maxRetries) {
            retries++;
            console.error(`Retry ${retries}/${maxRetries}: ${error.message}`);
            await new Promise(res => setTimeout(res, retryDelay));
          } else {
            throw error;
          }
        }
      }
    })
  );

  return responses.map(response => response.data.data[0].embedding);
}


async function vectorizeData() {
  const documents = await getData();
  const texts = documents.map(doc => doc.page_content); 
    const embeddings = await createEmbeddings(texts);
    
    const index = faiss.IndexFlatL2(embeddings[0].length);
    const vectors = new Float32Array(embeddings.flat());
    index.add(vectors);
    
    return { index, documents };
}

async function retrieveInfo(query) {
  const { index, documents } = await vectorizeData();
    const queryEmbedding = await createEmbeddings([query]);
    const { distances, neighbors } = index.search(queryEmbedding[0], 3);
    
    const similarDocuments = neighbors.map(neighborIndex => documents[neighborIndex]);
    return similarDocuments.map(doc => doc.page_content); 
}



const template = `
You are given a job to provide insights on machine learning engineer salaries from the year 2020 to 2024. 
I will provide you with a question regarding ML engineer salaries based on 
a dataset containing information like work experience, job titles, and salaries. 
Please analyze the data and use your knowledge to provide insightful answers.

**Question:**
{question}

**Available Data:**

* **Work Year:** This represents the year the data was collected or the year the engineer worked.
* **Experience Level:** This indicates the level of experience of the ML engineer (e.g., Entry-Level, Mid-Level, Senior).
* **Employment Type:** This specifies the employment arrangement (e.g., Full-Time, Contract).
* **Job Title:** This describes the specific role of the ML engineer (e.g., Machine Learning Engineer, Research Scientist).
* **Salary:** This represents the base salary of the ML engineer (might be in a specific currency).
* **Salary in USD:** This shows the salary converted to US Dollars (if applicable).
* **Employee Residence:** This indicates the country or region where the ML engineer resides.
* **Remote Ratio:** This represents the percentage of time the engineer works remotely.
* **Company Location:** This specifies the location of the company the engineer works for.
* **Company Size:** This indicates the size of the company (e.g., Startup, Enterprise).

**Insights:**

{insights}
`;

async function generateResponse(question) {
  console.log(question)
  const insights = await retrieveInfo(question);
  console.log(insights)
  const prompt = template.replace('{question}', question).replace('{insights}', insights.join('\n'));
  console.log(prompt)
  const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-16k-0613',
      messages: [
          { role: 'system', content: prompt },
      ],
  });
  
  return response.data.choices[0].message.content;
}

app.post("/query", async(req,res)=>{
  const {message}  = req.body;
  console.log(message)
    try {
        const result = await generateResponse(message);
        res.json({ result });
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})



app.get("/mainTable", async (req, res) => {
  try { 
    const data = await dataML.find().distinct('work_year'); 
    const result = [];
    for(const year of data){
      const jobs = await dataML.find({'work_year':year}).distinct('job_title');
      const totalJobs = jobs.length;

      const salary = await dataML.find({'work_year':year}, 'salary_in_usd');
      const totalSalary = salary.reduce((acc, curr) => acc + curr.salary_in_usd, 0);
      const averageSalary = Math.ceil(totalSalary / totalJobs);

      result.push({
        year: year,
        totalJobs: totalJobs,
        averageSalary: averageSalary
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
    const jobs = await dataML.distinct('job_title', { 'work_year': year }); 
    
    const result = [];
    for (const job of jobs) {
      const jobInYear = await dataML.find({ 'work_year': year, 'job_title': job });
      const totalJobs = jobInYear.length;
      const totalSalary = jobInYear.reduce((acc, curr) => acc + curr.salary_in_usd, 0);
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
    const para = req.params.key
    const data = await dataML.find().distinct(para);


    const result = [];
    for (const obj of data) {
      const salary = await dataML.find({ [para]: obj }, 'salary_in_usd');
      const totalSalary = salary.reduce((acc, curr) => acc + curr.salary_in_usd, 0);
      const averageSalary = Math.ceil(totalSalary / salary.length);

      result.push({
        [para]: obj, 
        averageSalary: averageSalary
      });
    }

    res.json(result);
  } catch (error) {
    console.error("Error retrieving data from Collection 2:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
