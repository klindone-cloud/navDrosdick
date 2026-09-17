import { Link } from "react-router-dom";

function Directory() {
    return (
        <main className="page">
            <header className="header">
                <h1>Directory</h1>
            </header>
            <Link to="/">Home</Link>
            <p>Directory content goes here.</p>
        </main>
    );
}
export default Directory;