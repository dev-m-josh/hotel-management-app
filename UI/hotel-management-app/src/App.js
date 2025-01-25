import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Meals from "./Components/Meals";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <div className="App">
        <Routes>
          <Route path="/" element={<Meals />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
