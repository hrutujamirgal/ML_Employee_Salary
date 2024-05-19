import { React } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DataTable from "./components/DataTable";
import YearData from "./components/YearData";
import Chart from "./components/Chart";
 
function App() {
  return (
    <>
      <Router>
      <Routes>
        <Route exact path="/" element={<DataTable />} />
        <Route exact path="/year" element={<YearData />} />
        <Route exact path="/chart" element={<Chart />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
