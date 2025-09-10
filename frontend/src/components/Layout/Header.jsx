import React, { useState, useEffect } from 'react'

import '../../App.css'

import { Link, useNavigate } from 'react-router-dom'


// import { getUser, logout } from '../../utils/helpers'
const Header = () => {
   
   
    return (
        <>
            <nav className="navbar row">
                <div className="col-12 col-md-3">
                    <div className="navbar-brand">
                        <Link to="/">
                            <img src="./images/shopit_logo.png" />
                        </Link>

                    </div>
                </div>
                
            </nav>
        </>
    )
}

export default Header