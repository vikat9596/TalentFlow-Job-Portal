import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.user);

  const handleLinkClick = () => {
    setShow(!show);
  };

  return (
    <>
      <nav className={show ? 'navbar show_navbar' : 'navbar'}>
        <div className="logo">
          {/* <img src="/logo.png" alt="logo" /> */}
          <h4>TalentFlow</h4>
        </div>
        <div className="links">
          <ul>
            <li>
              <Link to="/" onClick={handleLinkClick}>
                HOME
              </Link>
            </li>
            <li>
              <Link to="/jobs" onClick={handleLinkClick}>
                JOBS
              </Link>
            </li>
            {isAuthenticated ? (
              <li>
                <Link to="/dashboard" onClick={handleLinkClick}>
                  DASHBOARD
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/login" onClick={handleLinkClick}>
                  LOGIN
                </Link>
              </li>
            )}
          </ul>
        </div>
        <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
      </nav>
    </>
  );
};

export default Navbar;
