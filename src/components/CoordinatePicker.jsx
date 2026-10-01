/*
This File helps users select coordinates on the map to then create polygons for the rooms
*/

import {useMapEvents} from "react-leaflet";

function CoordinatePicker({ imageHeight, onCoordinateChange}) {
    console.log("CoordinatePicker rendered");

    useMapEvents({
        click (event) {
            console.log("Raw leaflet click:", event.latlng);

            const x = Math.round(event.latlng.lng);
            const leaflety = Math.round(event.latlng.lat);

            //convert leaflet's bottom-left y to image top-left y
            const y = imageHeight - leaflety;

            console.log(`Converted coordinate: [${x}, ${y}]`);
            if (typeof onCoordinateChange === "function") {
                onCoordinateChange({ x, y });
            } else {
                console.log("onCoordinateChange is not a function");
            }
        },
    });

    return null; // This component does not render anything itself
}

export default CoordinatePicker;