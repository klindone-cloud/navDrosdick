import { Link } from "react-router-dom";

function NavCard({ title, description, link, image }){
    return (
        <Link className="nav-card" to={link}>
            <div className="nav-card-image">
                <img src={image} alt={title} />
            </div>
            <div className="nav-card-content">
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
        </Link>
    );
}

export default NavCard;