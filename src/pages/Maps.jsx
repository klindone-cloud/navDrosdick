import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { useSearchParams } from "react-router-dom";
import {
	GeoJSON,
	ImageOverlay,
	MapContainer,
	Popup,
	useMap,
} from "react-leaflet";
import {useMapEvents} from "react-leaflet";
import CoordinatePicker from "../components/CoordinatePicker";
import {parseRoomsCSV} from "../data/createRooms";
import Navbar from "../components/NavBar";
import "leaflet/dist/leaflet.css";
import "../css/maps.css";

const MAP_WIDTH = 1600;
const MAP_HEIGHT = 1000;

const mapBounds = [
	[0, 0],
	[MAP_HEIGHT, MAP_WIDTH],
];

const floorPlans = {
	0: {
		url: "/floors/DrosdickGroundFloor.png",
		name: "Ground Floor"
	},
	1: {
		url: "/floors/DrosdickFirstFloor.png",
		name: "First Floor"
	}
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

function normalizeRoomType(type) {
	return String(type ?? "Unknown").trim();
}

function RoomLayer({
	room,
	selected,
	getRoomColor,
	addRoomPopup,
}) {
	const layerRef = useRef(null);
	const map = useMap();

	const roomType = room.properties?.type ?? "Unknown";

	useEffect(() => {
		if (!selected || !layerRef.current) {
			return;
		}

		const roomLayer = layerRef.current;
		const bounds = roomLayer.getBounds();

		map.fitBounds(bounds, {
			padding: [80, 80],
			maxZoom: 2,
			animate: true,
		});

		roomLayer.eachLayer((layer) => {
			layer.openPopup();
		});
	}, [selected, map]);

	return(
		<GeoJSON
			ref={layerRef}
			data={room}
			style={{
				color: getRoomColor(roomType),
				weight: 2,
				fillColor: getRoomColor(roomType),
				fillOpacity: 0.3,
			}}
			onEachFeature={addRoomPopup}
		/>
	);
}

function Maps() {
	const [selectedFloor, setSelectedFloor] = useState(1);
	const [buildingRooms, setBuildingRooms] = useState(emptyRooms);
	const [hiddenTypes, setHiddenTypes] = useState(new Set());
	const [searchParams,setSearchParams] = useSearchParams();
	const selectedRoomId = searchParams.get("room");

	const roomTypes = useMemo(() => {
		const types = buildingRooms.features.map((room) => room.properties.type);

		return [...new Set(types)].sort();
	}, [buildingRooms]);


	useEffect(() => {
		if(!selectedRoomId) {
			return;
		}

		const selectedRoom = buildingRooms.features.find(
			(room) => String(room.properties.id) === String(selectedRoomId),
		);

		if (selectedRoom) {
			setSelectedFloor(
				Number(selectedRoom.properties.level),
			);
		}
	}, [buildingRooms, selectedRoomId]);
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

	const visibleRoomFeatures = useMemo(() => {
		return buildingRooms.features.filter((room) => {
			const roomId = String(room.properties.id);
			const roomType = normalizeRoomType(room.properties.type);

			const correctFloor = Number(room.properties.level) === selectedFloor;

			const isSelected = roomId === String(selectedRoomId);

			const typeIsVisible = !hiddenTypes.has(roomType);

			return (
				correctFloor && (isSelected || typeIsVisible)
			);
		});
	},	[buildingRooms, selectedFloor, hiddenTypes, selectedRoomId,]);
	/*
	const visibleRooms = useMemo(() => ({
		...buildingRooms,
		features: buildingRooms.features.filter(
			(room) => room.properties.level === selectedFloor &&
				!hiddenTypes.has(room.properties.type)
		),
	}),
	[buildingRooms, selectedFloor],
	);
	*/

	//toggles the visibility of a room type on the map
	function toggleRoomType(type) {
		const normalizedType = normalizeRoomType(type);

		setHiddenTypes((currentTypes) => {
			const updatedTypes = new Set(currentTypes);

			if(updatedTypes.has(normalizedType)) {
				updatedTypes.delete(normalizedType);
			} else {
				updatedTypes.add(normalizedType);
			}

			return updatedTypes;
		});
	}

	function showAllRoomTypes() {
		setHiddenTypes(new Set());
	}

	function hideAllRoomTypes() {
		setHiddenTypes(new Set(roomTypes));

		//remove the selected room from the url
		const updatedParams = new URLSearchParams(searchParams,);

		updatedParams.delete("room");

		setSearchParams(updatedParams, {
			replace: true,
		});
	}

	//creates overlay popups for each room on the map
	function addRoomPopup(feature, layer) {
		const properties = feature?.properties ?? {};
		const name = properties.name || "Unnamed location";
		const roomNumber = properties.locationNumber || "";
		const type = properties.type || "Unknown";
		const level = floorPlans[properties.level].name || "";

		layer.bindPopup(
			`<strong>${name}</strong><br/>
			Floor ${level}<br/>
			Location: ${roomNumber}<br/>
			${type}`);
	}
	//prints coordinates of the point clicked on the map to the console
	function handleCoordinateChange(coordinate) {
		console.log(`Map point: [${coordinate.x}, ${coordinate.y}]`);
	}

	console.log("Hidden types:", [...hiddenTypes]);

console.log(
  "Visible rooms:",
  visibleRoomFeatures.map((room) => ({
    name: room.properties.name,
    type: room.properties.type,
  })),
);

	return (
		<main className="maps-page">
			<Navbar />
			<header className="maps-header">
				<div>
					<h1>Drosdick Hall Map</h1>
					<br/>
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
								> {floorPlans[floor].name} </button>
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
						{roomTypes.map((normalizedType) => (
							<label key={normalizedType} className="legend-option">
								<input type="checkbox"
									checked={!hiddenTypes.has(normalizedType)}
									onChange={() => toggleRoomType(normalizedType)}
									/>
								<span className="legend-color" style={{ backgroundColor: getRoomColor(normalizedType) }}/>

								<span className="legend-text">
									{normalizedType}
								</span>
							</label>
						))}
					</div>
						<div className="clear-location">
							<button type="button" onClick={hideAllRoomTypes}>Clear Room Location</button>
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
				<ImageOverlay key={`image-${selectedFloor}`} url={floorPlans[selectedFloor].url} bounds={mapBounds} />
				<CoordinatePicker imageHeight={MAP_HEIGHT} onCoordinateChange={handleCoordinateChange} />
				{visibleRoomFeatures.map((room) => {
					const roomId = String(room.properties.id);

					return (
						<RoomLayer key={`${selectedFloor}-${roomId}`} room={room} selected={roomId === String(selectedRoomId)}
					getRoomColor={getRoomColor}
					addRoomPopup={addRoomPopup}/>
					/*<GeoJSON
						key={`${selectedFloor}-${roomId}`}
						data={room}
						style={{
							color: getRoomColor(roomType),
							weight: 2,
							fillColor: getRoomColor(roomType),
							fillOpacity: 0.3,
						}}
						onEachFeature={addRoomPopup}
					/>*/
					);
				})}
			</MapContainer>
			</div>
		</main>
	);
}

export default Maps;
