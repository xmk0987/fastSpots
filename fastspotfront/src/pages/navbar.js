import { Link } from 'react-router-dom';

const Navbar = (props) => {
    const { baseURL } = props;

    return (
        <header>
             <nav className="navbar">
                <div className="nav-links">
                    <ul>
                        <li><Link to='/top-lists'>TOP LISTS</Link></li>
                        <li><Link to='/playlist'>PLAYLIST</Link></li>
                        <li><Link to={`${baseURL}/logout`}>LOGOUT</Link></li>
                    </ul>
                </div>
            </nav>
        </header>
       
    )
}

export default Navbar;