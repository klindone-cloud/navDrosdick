import { useMemo, useState } from "react";
import L from "leaflet";
import {
	GeoJSON,
	ImageOverlay,
	MapContainer,
	Popup,
} from "react-leaflet";

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

const buildingRooms = {
	type: "FeatureCollection",
	features: [
		{
			type: "Feature",
			geometry: {
				type: "Polygon",
				coordinates: [
					[
						[0, 0],
						[0, MAP_HEIGHT],
						[MAP_WIDTH, MAP_HEIGHT],
						[MAP_WIDTH, 0],
						[0, 0]
					]
				]
			},
			properties: {
				name: "Drosdick Hall",
				id: "1",
				level: 1,
				type: "building",
				description: "Drosdick Hall is home to Villanova's College of Engineering. It houses various classrooms, offices, and facilities for students and faculty."

			}
		},
		{
			type: "Feature",
			geometry: {
				type: "Polygon",
				coordinates: [
					[
						[0, 0],
						[0, MAP_HEIGHT],
						[MAP_WIDTH, MAP_HEIGHT],
						[MAP_WIDTH, 0],
						[0, 0]
					]
				]
			},
			properties: {
				name: "Jones Family Learning Commons",
				id: "2",
				level: 1,
				type: "study space",
				description: "The Jones Family Learning Commons is a modern learning space designed to foster collaboration and innovation among students and faculty."

			}
		}
	]
};

function Maps() {
	const [selectedFloor, setSelectedFloor] = useState(1);

	const visibleRooms = useMemo(() => ({
		buildingRooms,
		features: buildingRooms.features.filter(
			(room) => room.properties.level === selectedFloor,
		),
	}),
	[selectedFloor],
	);

	function addRoomPopup(feature, layer) {
		layer.bindPopup(
			`<strong>${feature.properties.name}</strong><br/>
			Floor ${feature.properties.level}<br/>
			${feature.properties.type}`);
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

			<MapContainer
				crs={L.CRS.Simple}
				bounds={mapBounds}
				minZoom={-2}
				maxZoom={3}
				maxBounds={mapBounds}
				maxBoundsViscosity={1}
				className="indoor-map"
			>
				<ImageOverlay key={'image-${selectedFloor}'} url={floorPlans[selectedFloor]} bounds={mapBounds} />
				<GeoJSON key={'rooms-${selectedFloor}'} data={visibleRooms} style={{ color: "#172554", weight: 2, fillColor: "#3b82f6", fillOpacity: 0.2,}} onEachFeature={addRoomPopup} />
			</MapContainer>
		</main>
	);
}

export default Maps;
