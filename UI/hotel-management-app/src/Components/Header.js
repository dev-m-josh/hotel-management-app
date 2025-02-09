import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import "../Styles/Header.css";

function Header() {
    // Get the current path
    const currentPath = window.location.pathname;

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
                    <div className="cart">
                        <FontAwesomeIcon className='icon' icon={faShoppingBasket} />
                        <div className="cart-number">0</div>
                    </div>
                </div>

                <div className="cart-signup">
                    <a href="login" className="signup-btn">Log In</a>
                    <a href="/sign-up" className="signup-btn">Sign Up</a>
                </div>
            </nav>
        </header>
    );
}

export default Header;
