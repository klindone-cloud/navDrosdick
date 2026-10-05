import { useState } from "react";
import NavBar from "../components/NavBar";
import { connectNode, sendCommand, disconnectNode } from "../bluetooth";
import floorPlan from "../assets/drosdick-floor1.png";
import "../css/Lighttest.css";

// coords are pixels on the floor plan (1643 x 957), routes start at the front entrance
const START = "320,800 320,690";
const ROOMS = [
    {
        id: "room105",
        name: "Demo Room 105",
        where: "Multispace Lab, floor 1",
        box: { x: 920, y: 350, w: 157, h: 200 },
        path: START + " 390,690 390,570 1000,570 1000,552",
    },
    {
        id: "holygrounds",
        name: "Holy Grounds",
        where: "Dining, floor 1",
        box: { x: 470, y: 650, w: 195, h: 140 },
        path: START + " 480,690 530,710",
    },
    {
        id: "elevator3",
        name: "Elevator 3",
        where: "Elevator, floor 1",
        box: { x: 305, y: 145, w: 45, h: 40 },
        path: START + " 390,690 390,240 370,240 370,170 350,170",
    },
];

function LightTest() {
    const [connected, setConnected] = useState(false);
    const [guiding, setGuiding] = useState(false);
    const [status, setStatus] = useState("Not connected");
    const [room, setRoom] = useState(ROOMS[0]);

    async function handleConnect() {
        try {
            const name = await connectNode(
                (msg) => setStatus("Lights: " + msg),
                () => { setConnected(false); setGuiding(false); setStatus("Disconnected"); }
            );
            setConnected(true);
            setStatus("Connected to " + name);
        } catch (err) {
            setStatus("Error: " + err.message);
        }
    }

    async function send(cmd) {
        try {
            await sendCommand(cmd);
            setGuiding(cmd.cmd === "nav");
        } catch (err) {
            setStatus("Error: " + err.message);
        }
    }

    function pickRoom(r) {
        setRoom(r);
        setGuiding(false); // reset the map until they hit guide again
    }

    const b = room.box;

    return (
        <>
        <NavBar />
        <main className="page light-test">
            <h1>Light Test</h1>

            <section className="lt-card">
                <p className="lt-label">1. Connect</p>
                {connected
                    ? <button className="lt-btn" onClick={disconnectNode}>Disconnect</button>
                    : <button className="lt-btn" onClick={handleConnect}>Connect to lights</button>}
                <p className="lt-sub">{connected ? "Lights online" : "Lights offline"}</p>
            </section>

            <section className="lt-card">
                <p className="lt-label">2. Where to?</p>
                {ROOMS.map((r) => (
                    <div
                        key={r.id}
                        className={r.id === room.id ? "room selected" : "room"}
                        onClick={() => pickRoom(r)}
                    >
                        <strong>{r.name}</strong>
                        <small>{r.where}</small>
                    </div>
                ))}
            </section>

            <section className="lt-card">
                <p className="lt-label">3. Follow the lights</p>

                {/* map is display only, no clicking */}
                <svg className="lt-map" viewBox="0 0 1643 957">
                    <image href={floorPlan} width="1643" height="957" />
                    <rect
                        className={guiding ? "dest active" : "dest"}
                        x={b.x} y={b.y} width={b.w} height={b.h}
                    />
                    {guiding && (
                        <>
                            <polyline className="route" points={room.path} />
                            <circle cx="320" cy="800" r="18" className="start" />
                        </>
                    )}
                </svg>

                <div className="lt-actions">
                    <button
                        className="lt-btn guide"
                        disabled={!connected}
                        onClick={() => send({ cmd: "nav", dest: room.id, color: "#00ff00", mode: "chase" })}
                    >
                        Guide me
                    </button>
                    <button className="lt-btn clear" disabled={!connected} onClick={() => send({ cmd: "clear" })}>
                        Clear
                    </button>
                </div>
            </section>

            <p className="lt-status">{status}</p>
        </main>
        </>
    );
}

export default LightTest;