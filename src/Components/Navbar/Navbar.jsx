import React from 'react';
import './Navbar.css';
import menu_icon from '../../assets/menu.png';
import logo from '../../assets/logo.png';
import upload_icon from '../../assets/upload.png';
import more_icon from '../../assets/more.png';
import notification from '../../assets/notification.png';
import profile_icon from '../../assets/jack.png';
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';

const Navbar = ({setSidebar, handleSearchResults}) => {
  return (
    <nav className='flex-div'>
        <div className="nav-left flex-div">
            <img className='menu-icon' onClick={()=>setSidebar(prev => prev === false ? true : false)} src={menu_icon} alt="menu" />
            <Link to={'/'}><img src={logo} alt="logo" className="logo" /></Link>
        </div>

        <div className="nav-middle flex-div">
            <div className="search-box flex-div">
                <SearchBar handleSearchResults={handleSearchResults} />
            </div>
        </div>

        <div className="nav-right flex-div">
            <img src={upload_icon} alt="upload_icon" />
            <img src={more_icon} alt="more_icon" />
            <img src={notification} alt="notification" />
            <img src={profile_icon} alt="profile_icon" className='user-icon' />
        </div>
    </nav>
  )
}

export default Navbar