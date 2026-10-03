import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import {
	GeoJSON,
	ImageOverlay,
	MapContainer,
	Popup,
} from "react-leaflet";
import {useMapEvents} from "react-leaflet";
import CoordinatePicker from "../components/CoordinatePicker";
import {parseRoomsCSV} from "../data/createRooms";
import "leaflet/dist/leaflet.css";

const MAP_WIDTH = 1600;
const MAP_HEIGHT = 1000;

const mapBounds = [
	[0, 0],
	[MAP_HEIGHT, MAP_WIDTH],
];

const floorPlans = {
	1: "/floors/DrosdickFirstFloor.png"
};

const emptyRooms = {
	type: "FeatureCollection",
	features: []
};

//creating a legend for the map
const ROOM_COLORS = {
	"Administrative Offices": "#e01111",
	"Classroom": "#da5400",
	"Dining": "#31a9e5",
	"Elevator": "#bd13db",
	"Graduate Space": "#e01111",
	"Laboratory": "#73a880",
	"Meeting Room": "#f50b7c",
	"Restroom": "#fbff00",
	"Stairs": "#b0740e",
	"Study Space": "#1b0bf1",
};

function getRoomColor(type) {
	return ROOM_COLORS[type] ?? "#ffffff"; // Default color if type is not found
}

function Maps() {
	const [selectedFloor, setSelectedFloor] = useState(1);
	const [buildingRooms, setBuildingRooms] = useState(emptyRooms);
	const [hiddenTypes, setHiddenTypes] = useState(new Set());

	const roomTypes = useMemo(() => {
		const types = buildingRooms.features.map((room) => room.properties.type);

		return [...new Set(types)].sort();
	}, [buildingRooms]);

	useEffect(() => {
		async function loadRooms() {
			try {
				const response = await fetch("../data/FirstFloor2.csv");

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const csvText = await response.text();

if (csvText.trimStart().startsWith("<")) {
    throw new Error("Got HTML instead of CSV; check that the file is in public/data/");
}
				console.log("Loaded CSV text:", csvText);
				const rooms = parseRoomsCSV(csvText, MAP_HEIGHT);

				console.log("Parsed room data:", rooms);
				setBuildingRooms(rooms);
			} catch (error) {
				console.error("Error loading room data:", error);
			}
		}
		loadRooms();
	}, []);
	
	const visibleRooms = useMemo(() => ({
		...buildingRooms,
		features: buildingRooms.features.filter(
			(room) => room.properties.level === selectedFloor &&
				!hiddenTypes.has(room.properties.type)
		),
	}),
	[buildingRooms, selectedFloor],
	);

	//toggles the visibility of a room type on the map
	function toggleRoomType(type) {
		setHiddenTypes((currentTypes) => {
			const updatesTypes = new Set(currentTypes);

			if(updatedTypes.has(type)) {
				updatedTypes.delete(type);
			} else {
				updatedTypes.add(type);
			}

			return updatedTypes;
		});
	}

	function showAllRoomTypes() {
		setHiddenTypes(new Set());
	}

	function hideAllRoomTypes() {
		setHiddenTypes(new Set(roomTypes));
	}

	//creates overlay popups for each room on the map
	function addRoomPopup(feature, layer) {
		console.log(`Description:${feature.properties.description}`);
		layer.bindPopup(
			`<strong>${feature.properties.name}</strong><br/>
			Floor ${feature.properties.level}<br/>
			Location: ${feature.properties.description}<br/>
			${feature.properties.type}`);
	}
	//prints coordinates of the point clicked on the map to the console
	function handleCoordinateChange(coordinate) {
		console.log(`Map point: [${coordinate.x}, ${coordinate.y}]`);
	}

	return (
		<main className="maps-page">
			<header className="maps-header">
				<div>
					<h1>Drosdick Hall Map</h1>
					<p>Select a floor, then choose a room.</p>
				</div>

				<div className="floor-selector" aria-label="Choose a floor">
					{Object.keys(floorPlans).map((floor) => {
						const floorNumber = Number(floor);

						return (
							<button
								key={floor} type="button"
								className={selectedFloor === floorNumber ? "active-floor" : ""}
								onClick={() => setSelectedFloor(floorNumber)}
								> Floor {floor} </button>
						);
					})}
				</div>
			</header>
			<div className="map-wrapper">
				<aside className="room-type-legend">
					<div className="legend-header">
						<h2>Room Types</h2>

						<div className="legend-actions">
							<button type="button" onClick={showAllRoomTypes}>Show All</button>
							<button type="button" onClick={hideAllRoomTypes}>Hide All</button>
						</div>
					</div>

					<div className="legend-options">
						{roomTypes.map((type) => (
							<label key={type} className="legend-option">
								<input type="checkbox"
									checked={!hiddenTypes.has(type)}
									onChange={() => toggleRoomType(type)}
									/>
								<span className="legend-color" style={{ backgroundColor: getRoomColor(type) }}>{type}</span>
							</label>
						))}
					</div>
				</aside>
			<MapContainer
				crs={L.CRS.Simple}
				bounds={mapBounds}
				minZoom={-2}
				maxZoom={4}
				maxBounds={mapBounds}
				maxBoundsViscosity={1}
				className="indoor-map"
			>
				<ImageOverlay key={`image-${selectedFloor}`} url={floorPlans[selectedFloor]} bounds={mapBounds} />
				<CoordinatePicker imageHeight={MAP_HEIGHT} onCoordinateChange={handleCoordinateChange} />
				
				<GeoJSON key={`rooms-${selectedFloor}-${visibleRooms.features.map((room) => room.properties.id).join('-')}`} data={visibleRooms} style={(feature)=>({ color: "#172554", weight: 2, fillColor: feature.properties.type === "Classroom" ? "#da5400": feature.properties.type === "Meeting Room" ? "#f50b7c" : feature.properties.type === "Elevator" ? "#bd13db" : feature.properties.type === "Laboratory" ? "#73a880" : feature.properties.type === "Study Space" ? "#1b0bf1" : feature.properties.type === "Stairs" ? "#b0740e" : feature.properties.type === "Restroom" ? "#fbff00" : (feature.properties.type === "Graduate Space" || feature.properties.type === "Administrative Offices") ? "#e01111" : "#31a9e5", fillOpacity: 0.2,})} onEachFeature={addRoomPopup} />
			</MapContainer>
			</div>
		</main>
	);
}

export default Maps;
