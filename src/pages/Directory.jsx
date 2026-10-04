import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useEffect, useMemo, useState } from 'react';

import {parseRoomsCSV} from "../data/createRooms";
//import "../css/directory.css";

function Directory() {
    return (
        <main className="directory-page">
            <NavBar />
            <header className="directory-header">
                <div>
                    <p className="directory-kicker">
                        Drosdick Hall
                    </p>
                    <h1>Directory</h1>
                    <p className="directory-description">
                        Search for classrooms, laboratories, offices, study spaces, and other locations.
                    </p>
                </div>
                <Link className="directory-map-link" to="/maps">
                View floor map
                </Link>
            </header>

            <section className="directory-search" aria-label="Search the location directory">
                <label htmlFor="location-search">
                    Search locations
                </label>

                <div className="search-input-wrapper">
                    <span className="search-icon" aria-hidden="true"> ⌕ </span>

                    <input 
                        id="location-search"
                        type="search"
                        value={searchQuery}
                        placeholder="Search by name, room, or category"
                        onChange={(event) => setSearchQuery(event.target.value)}
                    />
                </div>
            </section>
        </main>
    );
}
export default Directory;