import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">🍕 Pizza Valley</div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#menu">Menu</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="nav-buttons">
          <button className="btn-login">Login</button>
          <button className="btn-order">Order Now</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero" id="home">
        <div className="hero-content">
          <h1>Fresh & Hot Pizza<br/>Delivered to Your Door</h1>
          <p>Order your favorite pizza online and get it delivered in 30 minutes or less!</p>
          <div className="hero-buttons">
            <button className="btn-order-big">Order Now 🍕</button>
            <button className="btn-menu">View Menu</button>
          </div>
        </div>
        <div className="hero-image">🍕</div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature-card">
          <span>⚡</span>
          <h3>Fast Delivery</h3>
          <p>30 minutes or less guaranteed</p>
        </div>
        <div className="feature-card">
          <span>🔥</span>
          <h3>Fresh & Hot</h3>
          <p>Made fresh with quality ingredients</p>
        </div>
        <div className="feature-card">
          <span>💰</span>
          <h3>Best Prices</h3>
          <p>Affordable prices for everyone</p>
        </div>
        <div className="feature-card">
          <span>📱</span>
          <h3>Easy Ordering</h3>
          <p>Order from any device anytime</p>
        </div>
      </section>

      {/* MENU PREVIEW */}
      <section className="menu" id="menu">
        <h2>Our Popular Pizzas</h2>
        <div className="menu-grid">
          <div className="menu-card">
            <div className="menu-img">🍕</div>
            <h3>Margherita Classic</h3>
            <p>Fresh tomatoes, mozzarella, basil</p>
            <div className="menu-footer">
              <span className="price">Rs. 850</span>
              <button className="btn-add">Add to Cart</button>
            </div>
          </div>
          <div className="menu-card">
            <div className="menu-img">🍕</div>
            <h3>BBQ Chicken</h3>
            <p>Grilled chicken, BBQ sauce, onions</p>
            <div className="menu-footer">
              <span className="price">Rs. 1100</span>
              <button className="btn-add">Add to Cart</button>
            </div>
          </div>
          <div className="menu-card">
            <div className="menu-img">🍕</div>
            <h3>Pepperoni Feast</h3>
            <p>Double pepperoni, cheese burst</p>
            <div className="menu-footer">
              <span className="price">Rs. 1250</span>
              <button className="btn-add">Add to Cart</button>
            </div>
          </div>
          <div className="menu-card">
            <div className="menu-img">🍕</div>
            <h3>Veggie Supreme</h3>
            <p>Bell peppers, mushrooms, olives</p>
            <div className="menu-footer">
              <span className="price">Rs. 950</span>
              <button className="btn-add">Add to Cart</button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div>
            <h3>🍕 Pizza Valley</h3>
            <p>Best pizza in town since 2024</p>
          </div>
          <div>
            <h4>Contact</h4>
            <p>📞 0300-1234567</p>
            <p>📧 info@pizzavalley.pk</p>
            <p>📍 Rawalpindi, Pakistan</p>
          </div>
          <div>
            <h4>Order Now</h4>
            <p>Available on</p>
            <p>🌐 Website</p>
            <p>📱 Android & iOS</p>
            <p>💻 Desktop App</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 Pizza Valley. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;