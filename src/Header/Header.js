import React from 'react'
import './Header.css'
import logo from '../images/barrel.png'
import { NavLink } from 'react-router-dom'

const Header = () => {
  return (
    <header>
      <section className='header-logo'>
        <h1>BEERCATION</h1>
        <img src={logo} alt='BEERCATION'/>
      </section>
      <nav>
          <NavLink to='/' className='nav-link'>HOME</NavLink>
        <NavLink to='/to-visit' className='nav-link'>TO VISIT</NavLink>
        <NavLink to='visited' className='nav-link'>VISITED</NavLink>
      </nav>
    </header>
  )
}

export default Header