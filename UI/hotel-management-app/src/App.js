
import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Meals from "./Components/Meals";  
import Staffs from "./Components/Staffs";
import "./App.css";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import Orders from "./Components/Orders";

function App() {
  return (
    <>
      <Header />
      <div className="App">
        <Routes>
          <Route path="/" element={<Meals />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/staffs" element={<Staffs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

