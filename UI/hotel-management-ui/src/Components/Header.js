import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h1>FoodX</h1>
      </div>

      <nav className="header-details">
        <div className="links">
          <a href="/" className="nav-link active">Home</a>
          <a href="/menu" className="nav-link">Menu</a>
          <a href="/staffs" className="nav-link">Staffs</a>
        </div>

        <div className="cart-signup">
          <div className="cart">
            <FontAwesomeIcon className='icon' icon={faShoppingBasket} />
            <div className="cart-number">0</div>
          </div>
          <button className="signup-btn">Sign Up</button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
