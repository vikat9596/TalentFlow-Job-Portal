import React from 'react'
import { Link } from "react-router-dom";
import {useSelector} from "react-redux"
import {FaSquareXTwitter, FaSquareInstagram, FaSquareYoutube, FaLinkedin, FaTwitter} from "react-icons/fa6"


const Footer = () => {

  const {isAuthenticated} = useSelector(state => state.user)
  return (
    <>
    <footer>
      <div>
        <img src="/logo.png" alt="logo" />
      </div>
      <div>
        <h4>Support</h4>
        <ul>
          <li>Viras InfoTech, Nagpur, India</li>
          <li>support@virasinfotech.com</li>
          <li>+91 8669999596</li>
        </ul>
      </div>

      <div>
        <h4>Quick Links</h4>
        <ul>
          <li ><Link to={"/"}>Home</Link></li>
          <li><Link to={"/jobs"}>Jobs</Link></li>
          {
            isAuthenticated && <li><Link to={"/dashboard"}>Dashboard</Link></li>
          }
          
        </ul>
      </div>

      <div>
        <h4>
          Follow us
        </h4>
        <ul>
          <li><Link to={"/"}>
            <span><FaSquareXTwitter/></span>
            <span>Twitter (X)</span>
            </Link>
          </li>
          <li><Link to={"/"}>
            <span><FaSquareInstagram/></span>
            <span>Instagram</span>
            </Link>
          </li>
          <li><Link to={"/"}>
            <span><FaSquareYoutube/></span>
            <span>Youtube</span>
            </Link>
          </li>
          <li><Link to={"/"}>
            <span><FaLinkedin/></span>
            <span>LinkedIn</span>
            </Link>
          </li>
        </ul>
      </div>
    </footer>
    <div className="copyright">
      &copy; CopyRight 2024. All Rights Reserved By Viras InfoTech
    </div>
    </>
  )
}

export default Footer