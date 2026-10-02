//used to parse the csv file and create a map of the points of interest
import Papa from "papaparse";

const coordinate_cols = [
    "p1",
    "p2",
    "p3",
    "p4",
    "p5",
];

function parseCoordinate(value) {
    console.log("Value", value);
    console.log(`Parsing coordinate: ${value}`);
    //check that there is a coordinate value
    if (!value) {
        throw new Error(`Coordinate value is missing`);
    }

    const parts = value.split(",");

    const imageX = Number(parts[0].trim());
    const imageY = Number(parts[1].trim());

    //check that the coordinate is valid
    if (!Number.isFinite(imageX) || !Number.isFinite(imageY)){
        throw new Error(`Invalid coordinate: ${value}`);
    }

    return [imageX, imageY];
}

export function parseRoomsCSV(csvText, mapHeight) {
    const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().toLowerCase(),
    });

    console.log("CSV parsing error:", result.errors);
    console.log("Parsed CSV rows:", result.data);

    const features = result.data.map((row, index) => {
        console.log(`Parsing row ${index+2}:`, row);
        const points = coordinate_cols.map((column) => {
            console.log("Column:", column);
            return parseCoordinate(row[column]);
        });

        return {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [points],
            },
            properties: {
                id: String(row.id),
                name: row.location(),
                level: 1,
                type: row.category.trim(),
            },
        };
    });

    return {
        type: "FeatureCollection",
        features,
    };
};