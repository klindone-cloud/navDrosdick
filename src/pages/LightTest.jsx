import { useState } from "react";
import NavBar from "../components/NavBar";
import { connectNode, sendCommand } from "../bluetooth";

function LightTest() {
    const [connected, setConnected] = useState(false);
    const [status, setStatus] = useState("Not connected");

    async function handleConnect() {
        try {
            const name = await connectNode(
                (msg) => setStatus("Lights: " + msg),
                () => { setConnected(false); setStatus("Disconnected"); }
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
        } catch (err) {
            setStatus("Error: " + err.message);
        }
    }

    return (
        <>
        <NavBar />
        <main className="page light-test">
            
            <h1>Light Test</h1>

            <button onClick={handleConnect} disabled={connected}>
                {connected ? "Connected" : "Connect to lights"}
            </button>
            <button onClick={() => send({ cmd: "nav", dest: "room101", color: "#00ff00", mode: "chase" })} disabled={!connected}>
                Guide me to Room 101
            </button>
            <button onClick={() => send({ cmd: "clear" })} disabled={!connected}>
                Clear
            </button>

            <p>{status}</p>
        </main>
    </>
    );
}

export default LightTest;