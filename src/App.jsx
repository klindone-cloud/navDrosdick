import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Directory from "./pages/Directory";
import Guide from "./pages/Guide";
import Maps from "./pages/Maps";
import LightTest from "./pages/LightTest";

import "./style.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/directory" element={<Directory />} />
                <Route path="/guide" element={<Guide />} />
                <Route path="/maps" element={<Maps />} />
                <Route path="/lights" element={<LightTest />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;