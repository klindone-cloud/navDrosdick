import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Directory from "./pages/Directory";

import "./style.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/directory" element={<Directory />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;