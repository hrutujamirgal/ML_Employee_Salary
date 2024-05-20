import React from "react";
import { useNavigate } from "react-router-dom";
import {
  DatabaseOutlined,
  LineChartOutlined,
  WechatWorkOutlined,
} from '@ant-design/icons';

const Navbar = () => {
  const navi = useNavigate();

  

  const handleHome = () => {
    navi("/");
  };

  const handleChart = ()=>{
      navi("/chart")
  }


  const handleChat = ()=>{
    navi("/chat")
}

  return (
    <>
      <nav className="mt-0 h-20 bg-veryLightBlue flex flex-row">

        <h1 className="text-midnight text-3xl font-serif hover:cursor-pointer align-right mt-5 font-extrabold">ML Data</h1>
        <ul className="list-none flex flex-row px-2 py-2 space-x-4 mt-4 ml-auto">
            
          <li
            className="text-midnight text-xl font-serif hover:cursor-pointer align-right"
            onClick={handleHome}
          >
            <span className="py-2 px-2 transition duration-500 ease-in-out hover:text-white"> <DatabaseOutlined className="mr-2" />
              
              Jobs 
            </span>
          </li>

          
          <li className="text-midnight text-xl font-serif hover:cursor-pointer" onClick={handleChart}>
            <span className="py-2 px-2 transition duration-500 ease-in-out hover:text-white"><LineChartOutlined className="mr-2"/>
              Chart 
            </span>
          </li>

          <li className="text-midnight text-xl font-serif hover:cursor-pointer" onClick={handleChat}>
            <span className="py-2 px-2 transition duration-500 ease-in-out hover:text-white"><WechatWorkOutlined className="mr-2"/>
              Chat 
            </span>
          </li>
          
        </ul>
      </nav>
    </>
  );
};

export default Navbar;

