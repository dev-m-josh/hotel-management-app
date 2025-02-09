import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Meals from "./Components/Meals";
import Staffs from "./Components/Staffs";
// import Login from "./Components/Login";
// import SignUp from "./Components/SignUp";
import Orders from "./Components/Orders";
// import CreateOrder from "./Components/CreateOrder";

function App() {
  return (
    <>
      <Header />
      <div className="App">
        <div className="page-content">
          <Routes>
          <Route path="/" element={<Meals />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/staffs" element={<Staffs />} />
          {/*  <Route path="/login" element={<Login />} />*/}
          {/*  <Route path="/sign-up" element={<SignUp />} />*/}
          {/*  <Route path="/create-order" element={<CreateOrder />} />            */}
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
