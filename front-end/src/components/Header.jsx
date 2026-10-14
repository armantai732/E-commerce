import React, { useEffect, useState } from 'react';
import { ShoppingBag, User, LogOut, Store, Menu, X, Heart } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getWishlist } from '../api/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [wishlistCount, setWishlistCount] = useState(0);


  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/product' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Order', path: '/my-orders' }
  ];

  const handleLogout = () => {
    alert("Logout successfully!");
    localStorage.removeItem("token");
    navigate("/auth");
  };


  useEffect(() => {
    const fetchWishlistCount = async () => {
      if (!localStorage.getItem("token")) {
        setWishlistCount(0);
        return;
      }

      try {
        const response = await getWishlist();
        const products = response?.products || [];

        setWishlistCount(products.length);
      } catch (error) {
        console.log("Wishlist error:", error.message);
      }
    };

    fetchWishlistCount();

    // Wishlist add/remove hone par count update hoga
    window.addEventListener("wishlistUpdated", fetchWishlistCount);

    return () => {
      window.removeEventListener("wishlistUpdated", fetchWishlistCount);
    };
  }, [location.pathname]);

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="py-3 px-4 sm:px-6 md:px-12 flex items-center justify-between">

        {/* Left: Logo & Brand Name */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-amber-100/70 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
            <Store size={20} />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            ShopNest
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`transition - colors hover: text - black ${location.pathname === link.path ? 'text-black font-bold' : ''
                } `}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right: Action Icons & Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:gap-4 text-gray-700">

          {/* Auth Button (Login / Logout) */}
          {token ? (
            <button
              onClick={handleLogout}
              aria-label="Logout"
              title="Logout"
              className="p-1.5 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
            >
              <LogOut size={20} />
            </button>
          ) : (
            <Link to="/auth" onClick={closeMenu}>
              <button
                aria-label="User Profile"
                title="Login"
                className="p-1.5 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
              >
                <User size={20} />
              </button>
            </Link>
          )}

          {/* Wishlist Icon Button */}
          <Link to={token ? "/wishlist" : "/auth"} onClick={closeMenu}>
            <button
              aria-label="Wishlist"
              title="Wishlist"
              className="p-1.5 hover:text-black hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <Heart size={20} />

              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </button>
          </Link>

          {/* Shopping Cart Icon Button */}
          <Link to={token ? "/cart" : "/auth"} onClick={closeMenu}>
            <button
              aria-label="Shopping Cart"
              title="Cart"
              className="p-1.5 hover:text-black hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <ShoppingBag size={20} />
              {/* Cart Badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-600 rounded-full"></span>
            </button>
          </Link>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            onClick={toggleMenu}
            aria-label="Toggle Navigation Menu"
            className="p-1.5 md:hidden hover:text-black hover:bg-gray-100 rounded-xl transition-colors text-gray-700"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Drawer / Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 shadow-lg space-y-3 transition-all duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={closeMenu}
              className={`block text - sm font - bold py - 2 border - b border - gray - 50 last: border - none transition - colors ${location.pathname === link.path
                  ? 'text-black'
                  : 'text-gray-600 hover:text-black'
                } `}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;