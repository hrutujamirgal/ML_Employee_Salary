import React, { useState } from "react";
import Navbar from "./NavBar";
import axios from "axios";

function ChatApp() {
  const [prompt, setPrompt] = useState();
  const [insights, setInsights] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/query", {
        message: prompt,
      });
      console.log(response.data);
      const data = await response.json();
      setInsights(data.insights);
      setPrompt("");
    } catch (error) {
      console.error("Error making the POST request:", error);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="chat-app  mt-5  m-20 px-10 py-10">
        <h1 className="text-3xl font-serif font-bold">Chat App</h1>
        <form
          onSubmit={handleSubmit}
          className="px-10 py-10 flex-row justify-center"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="text-2xl font-serif border border-ligthBlue px-10 rounded-md w-3/4 h-16"
            placeholder="Ask about ML engineer salaries (beyond graphs)..."
          />
          <button
            type="submit"
            className="bg-lightBlue text-midnight text-2xl font-serif px-10 ml-10 rounded-md shadow-md hover:bg-veryLightBlue hover:text-midnight"
          >
            Ask
          </button>
        </form>
        <div className="insights-area">
          {insights && (
            <p className="border border-lightBlue text-xl font-serif">
              {insights}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatApp;
