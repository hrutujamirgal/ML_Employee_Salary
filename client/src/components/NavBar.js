import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navi = useNavigate();

  

  const handleHome = () => {
    navi("/");
  };

  const handleChart = ()=>{
      navi("/chart")
  }
  return (
    <>
      <nav className="mt-0 h-20 bg-veryLightBlue flex flex-row">

        <h1 className="text-black text-3xl font-serif hover:cursor-pointer align-right mt-5 font-extrabold">ML Data</h1>
        <ul className="list-none flex flex-row px-2 py-2 space-x-4 mt-4 ml-auto">
            
          <li
            className="text-black text-xl font-serif hover:cursor-pointer align-right"
            onClick={handleHome}
          >
            <span className="py-2 px-2 transition duration-500 ease-in-out hover:text-white">
              Jobs in the Year
            </span>
          </li>

          
          <li className="text-black text-xl font-serif hover:cursor-pointer" onClick={handleChart}>
            <span className="py-2 px-2 transition duration-500 ease-in-out hover:text-white">
              Chart Insight
            </span>
          </li>
          
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
