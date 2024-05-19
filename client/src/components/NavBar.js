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
            <span className="py-2 px-2 transition duration-300 ease-in-out hover:shadow-xl">
              Year
            </span>
          </li>

          
          <li className="text-black text-xl font-serif hover:cursor-pointer" onClick={handleChart}>
            <span className="py-2 px-2 transition duration-300 ease-in-out hover:shadow-xl">
              Chart Display
            </span>
          </li>
          
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
