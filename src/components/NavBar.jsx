import { Link } from "react-router-dom";
import "../css/style.css";

function NavBar() {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <a href="/" className="logo">
                    Navigating Drosdick
                </a>
            </div>
            <div className="navbar-links">
                <ul className="nav-menu">
                    <li className="nav-item"><Link to="/">Home</Link></li>
                    <li className="nav-item"><Link to="/directory">Directory</Link></li>
                    <li className="nav-item"><Link to="/guide">Guide</Link></li>
                    <li className="nav-item"><Link to="/maps">Maps</Link></li>
                    <li className="nav-item"><Link to="/lights">Light Test</Link></li>
                </ul>
            </div>
        </nav>
    );
}
export default NavBar;