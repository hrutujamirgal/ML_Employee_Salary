// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./config")

connectDB()

// Middleware
app.use(cors());
app.use(express.json()); //body parser
const dataML = require("./MlSchema")



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
    const year = parseInt(req.params.year); // Ensure year is treated as a number
    const jobs = await dataML.distinct('job_title', { 'work_year': year }); // Find unique job titles for the specified year
    
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


// app.get("/profileDate/:key", async (req, res) => {
//   try {
//     const key = req.params.key;

//     if (!key) {
//       return res.status(400).json({ error: "Invalid key" });
//     }

//     const getDate = await Attendance.findOne({ employee: key });

//     if (!getDate) {
//       return res.status(404).json({ error: "Profile date not found" });
//     }

//     return res.send(getDate);
//   } catch (error) {
//     console.error("Error retrieving profile date:");
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });


// app.get("/getTaskMy/:key", async (req, res) => {
//   try {
//     const getTask = await Task.find({
//       from: req.params.key 
//     });

//     return res.send(getTask);

//   } catch (error) {
//     console.error("Error detecting employee:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });



// app.get("/getTask/:key", async (req, res) => {
//   try {
//     console.log(req.params.key);
//     const getTask = await Task.findOne({ _id: req.params.key });
//     console.log(getTask); // Log the retrieved task

//     return res.send(getTask);
//   } catch (error) {
//     console.error("Error getting task:");
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });


// app.get("/getEmpTask/:key", async (req, res) => {
//   try {
//     const getTasks = await Task.find({ to: req.params.key });

//     return res.send(getTasks);
//   } catch (error) {
//     console.error("Error detecting employee:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });



// app.get("/getLeave/:key", async (req, res) => {
//   try {
//     const getTasks = await Leave.find({ employeeDepartment: req.params.key });

//     return res.send(getTasks);
//   } catch (error) {
//     console.error("Error detecting employee:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });


// app.get("/getLeaveStatus/:key", async (req, res) => {
//   try {
//     const getStat = await Leave.findOne({ _id: req.params.key });

//     return res.send(getStat);
//   } catch (error) {
//     console.error("Error detecting employee:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });




// app.get("/GetEmp/:key", async (req, res) => {
//   try {
//     const key = req.params.key;

//     if (!key) {
//       return res.status(400).json({ error: "Invalid key" });
//     }

//     const getTasks = await User.findOne({ _id: key });

//     if (!getTasks) {
//       return res.status(404).json({ error: "Document not found" });
//     }

//     return res.send(getTasks);
//   } catch (error) {
//     console.error("Error detecting employee:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });







// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
