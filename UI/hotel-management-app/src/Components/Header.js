import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom"; // Import NavLink from react-router-dom
import "../App.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h1>FoodX</h1>
      </div>

      <nav className="header-details">
        <div className="links">
          {/* Use className function to add 'active' class when the link is active */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Menu
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
          <NavLink className='login' to="/login">Login</NavLink>
          <NavLink className='login' to="/sign-up">Sign Up</NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Header;
