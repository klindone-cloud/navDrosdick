import NavBar from "../components/NavBar";
import "../css/style.css";
import {Link} from "react-router-dom";

function Guide() {
	return <main className="page">
		<NavBar />
		<div style = {{textAlign:"center"}}>
			<h1>Guide</h1>
			<p>Guide content will go here.</p>
			<button style={{marginTop: "20px", backgroundColor: "#94b7fda7", borderRadius: "4px", width: "300px", height: "70px", border: "solid", borderColor: "#002884", borderWidth: "1px"}}><Link style={{color: "#ffffff", fontSize:"20px", textDecoration:"none"}} to="../"> Return to Home </Link></button>
		</div>
		</main>;
}

export default Guide;
