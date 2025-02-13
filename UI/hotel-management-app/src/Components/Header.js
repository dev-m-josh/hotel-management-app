import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import "../Styles/Header.css";
import {useState} from "react";

function Header() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [isAdmin, setIsAdmin] = useState(false)
    console.log(user)
    const navigate = useNavigate();

    // Get the current path
    const currentPath = window.location.pathname;

    // Get the user's role
    if(user && user.role === 'admin'){
        setIsAdmin(true);
        return
    }

    // Get the cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = cartItems.length;

    // Handle logout
    const handleLogout = () => {
        // Clear user data from localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");

        // Redirect to the login page
        navigate("/login");
    };

    return (
        <header className="header">
            <div className="logo">
                <h1>FoodX</h1>
            </div>

            <nav className="header-details">
                <div className="links">
                    <a
                        href="/"
                        className={`nav-link ${currentPath === '/' ? 'active' : ''}`}
                    >
                        Home
                    </a>
                    <a
                        href="/orders"
                        className={`nav-link ${currentPath === '/orders' ? 'active' : ''}`}
                    >
                        Orders
                    </a>
                    <a
                        href="/staffs"
                        className={`nav-link ${currentPath === '/staffs' ? 'active' : ''}`}
                    >
                        Staffs
                    </a>

                    {/* Conditionally render Admin link */}
                    {isAdmin && (
                        <a
                            href="/admin"
                            className={`nav-link ${currentPath === '/admin' ? 'active' : ''}`}
                        >
                            Admin
                        </a>
                    )}

                    <div className="cart">
                        <FontAwesomeIcon className='icon' icon={faShoppingBasket} />
                        <div className="cart-number">{cartCount}</div>
                    </div>
                </div>

                <div className="cart-signup">
                    {user ? (
                        <button onClick={handleLogout} className="logout-btn">
                            Log Out
                        </button>
                    ) : (
                        <>
                            <a href="/login" className="signup-btn">Log In</a>
                            <a href="/sign-up" className="signup-btn">Sign Up</a>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Header;
