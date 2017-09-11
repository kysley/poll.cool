import React from 'react'
import SVG from 'react-svg-inline'
import { Link } from 'react-router-dom'

const Header = () =>
	<header className="header fadeIn  d-2">
    <Link to='/'>
      <img className="logo" src={require('img/pollarity-proto.png')} />
    </Link>
  </header>


export default Header
