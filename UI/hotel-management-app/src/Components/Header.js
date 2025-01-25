import React from "react";
import { NavLink } from "react-router-dom"; // Import NavLink
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket } from "@fortawesome/free-solid-svg-icons";
import "../Styles/Header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h1>FoodX</h1>
      </div>

      <nav className="header-details">
        <div className="links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Meals
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Orders
          </NavLink>
          <NavLink
            to="/staffs"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Staffs
          </NavLink>
        </div>

        <div className="cart-signup">
          <div className="cart">
            <FontAwesomeIcon className="icon" icon={faShoppingBasket} />
            <div className="cart-number">0</div>
          </div>
          <button className="signup-btn">Login</button>
          <button className="signup-btn">Sign Up</button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
