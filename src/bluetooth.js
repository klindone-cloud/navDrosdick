// BLE connection to the ESP32 light node
// UUIDs have to match the ones in the firmware (main.cpp)
const SERVICE_UUID = "6e400001-d705-4a1b-9c1e-0d705d0c0001";
const CMD_UUID = "6e400002-d705-4a1b-9c1e-0d705d0c0001";
const STATUS_UUID = "6e400003-d705-4a1b-9c1e-0d705d0c0001";

let device = null;
let cmdChar = null;

export async function connectNode(onMessage, onDisconnect) {
    device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [SERVICE_UUID] }],
    });
    device.addEventListener("gattserverdisconnected", () => {
        cmdChar = null;
        onDisconnect();
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);
    cmdChar = await service.getCharacteristic(CMD_UUID);

    // node sends back status like {"ok":true,"cmd":"nav","room":2}
    const statusChar = await service.getCharacteristic(STATUS_UUID);
    await statusChar.startNotifications();
    statusChar.addEventListener("characteristicvaluechanged", (e) => {
        const text = new TextDecoder().decode(e.target.value);
        try {
            onMessage(JSON.parse(text));
        } catch {
            console.warn("bad status from node:", text);
        }
    });

    return device.name;
}

// commands are plain strings like "nav 2" or "clear"
export async function sendCommand(text) {
    if (!cmdChar) throw new Error("not connected");
    await cmdChar.writeValue(new TextEncoder().encode(text));
    return text;
}

export function disconnectNode() {
    if (device && device.gatt.connected) device.gatt.disconnect();
}
