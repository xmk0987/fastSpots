import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Navbar = (props) => {
    const navigate = useNavigate();


    const handleLogout = async () => {
        // Make an HTTP GET request to the /api/logout route to log the user out.
        try {
            const response = await fetch('/api/logout', {
                method: 'GET',
            });
            if (response.status === 200) {
                navigate('/login');
            } else {
                console.log("Couldn't log out");
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const buttonStyle = {
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        textDecoration: 'underline', // Add an underline to mimic link style
        color: 'blue', // Adjust the color to match your link style
    };

    return (
        <header>
            <nav className="navbar">
                <div className="nav-links">
                    <ul>
                        <li><Link to='/top-lists'>TOP LISTS</Link></li>
                        <li><Link to='/playlist'>PLAYLIST</Link></li>
                        <li>
                            <button style={buttonStyle} onClick={handleLogout}>
                                LOGOUT
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;