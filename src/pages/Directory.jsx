import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useEffect, useMemo, useState } from 'react';

import {parseCSV} from "../data/createRooms";
import "../css/directory.css";

const emptyRooms = {
    type: "FeatureCollection",
    features: [],
};

const levels = {
    "0" : {
        name: "Ground Floor",
    },
    "1": {
        name: "First Floor",
    },
    "2": {
        name: "Second Floor",
    },
    "3": {
        name: "Third Floor",
    },
    "4": {
        name: "Basement Floor",
    }
};

function Directory() {
    //create constants
    const [rooms, setRooms] = useState(emptyRooms);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function loadRooms() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "data/FirstFloor.csv",
                    {
                        signal: controller.signal,
                    },
                );

                if(!response.ok){
                    throw new Error(
                        `Unable to load directory: HTTP ${response.status}`,
                    );
                }

                const csvText = await response.text();

                const parsedRooms = parseCSV(
                    csvText
                );

                //checks to see if html was returned instead of csv data
                if (csvText.trimStart().startsWith("<")) {
                    throw new Error (
                        "Expected CSV data but received HTML.",
                    );
                }

                setRooms(parsedRooms);
            } catch (error) {
                if (error.name != "AbortError") {
                    console.error(
                        "Directory loading error: ",
                        error,
                    );

                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        }

        loadRooms();

        return () => controller.abort();
    }, []);

    const locations = useMemo(() => {
        return rooms.features.map((room) => room.properties).sort((first, second) => first.name.localeCompare(second.name),);
    }, [rooms]);

    const filteredLocations = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        if(!normalizedQuery){
            return locations;
        }

        return locations.filter((location) => {
            const searchableText = [
                location.name,
                location.locationNumber,
                location.type,
                location.level, //note that since it is only parsing through first floor there is only one level
            ].filter(Boolean).join(" ").toLowerCase();

            return searchableText.includes(normalizedQuery);
        });
    }, [locations, searchQuery]);

    //function to clear the search
    function clearSearch() {
        setSearchQuery("");
    }

    return (
        <main className="directory-page">
            <NavBar />
            <header className="directory-header">
                <div>
                    <h1>Location Directory</h1>
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
                    {searchQuery && (
                        <button
                            type="button"
                            className="clear-search"
                            onClick={clearSearch}
                            aria-label="Clear search"
                        >Clear</button>
                    )}
                </div>
            </section>

            {loading && (
                <p className="directory-status">
                    Loading locations...
                </p>
            )}

            {error && (
                <div className="directory-error" role="alert">
                    <strong>Directory unavailable</strong>
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    <div className="directory-results-heading">
                        <h2>Locations</h2>

                        <p>
                            {filteredLocations.length}{" "}
                            {filteredLocations.length === 1 ? "result" : "results"}
                        </p>
                    </div>

                    {filteredLocations.length > 0 ? (
                        <div className="location-grid">
                            {filteredLocations.map((location) => (
                                <article key={location.id} className="location-card">
                                    <div className="location-card-heading">
                                        <div>
                                            <p className="location-type">
                                                {location.type}
                                            </p>

                                            <h3>{location.name}</h3>
                                        </div>

                                        {location.locationNumber && (
                                            <span className="location-number">
                                                {location.locationNumber}
                                            </span>
                                        )}
                                    </div>
                                        <div className="location-card-footer">
                                            <span>{levels[location.level].name}</span>

                                            <Link to={`/maps?room=${encodeURIComponent(location.id,)}`}>View on map</Link>
                                        </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="no-directory-results">
                            <h2>No locations found</h2>

                            <p>
                                Try searching with a different room, name, number, or category.
                            </p>

                            <button type="button" onClick={clearSearch}>Clear search</button>
                        </div>
                    )}
                </>
            )}
        </main>
    );
}
export default Directory;