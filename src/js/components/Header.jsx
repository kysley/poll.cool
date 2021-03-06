import React from 'react'
import SVG from 'react-svg-inline'
import { Link } from 'react-router-dom'

const Header = () => (
  <header className="header fadeIn delay-2">
    <Link to="/">
      <SVG svg={'<svg viewBox="0 0 357 198" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><circle fill="#635EFF" cx="164.5" cy="111.5" r="78.5"/><path fill="#78E3FD" style="mix-blend-mode:multiply" d="M270 8l68 136H202"/><path fill="#5EFFC4" style="mix-blend-mode:screen" d="M19 23h135v135H19z"/></g></svg>'} width="25%" />
    </Link>
  </header>
)


export default Header
