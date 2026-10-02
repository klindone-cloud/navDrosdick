// BLE connection to the ESP32 light node
// UUIDs have to match the ones in the firmware (main.cpp)
const SERVICE_UUID = "6e400001-d705-4a1b-9c1e-0d705d0c0001";
const CMD_UUID = "6e400002-d705-4a1b-9c1e-0d705d0c0001";
const STATUS_UUID = "6e400003-d705-4a1b-9c1e-0d705d0c0001";
 
let cmdChar = null;
 
export async function connectNode(onMessage, onDisconnect) {
    const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [SERVICE_UUID] }],
    });
    device.addEventListener("gattserverdisconnected", () => {
        cmdChar = null;
        onDisconnect();
    });
 
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);
    cmdChar = await service.getCharacteristic(CMD_UUID);
 
    // node sends back acks like {"ok":true,"cmd":"nav"}
    const statusChar = await service.getCharacteristic(STATUS_UUID);
    await statusChar.startNotifications();
    statusChar.addEventListener("characteristicvaluechanged", (e) => {
        onMessage(new TextDecoder().decode(e.target.value));
    });
 
    return device.name;
}
 
export async function sendCommand(cmd) {
    if (!cmdChar) throw new Error("not connected");
    const text = JSON.stringify(cmd);
    await cmdChar.writeValue(new TextEncoder().encode(text));
    return text;
}
 