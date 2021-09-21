// @ts-ignore
import { Cap, decoders } from "cap";
import { Packet } from "./killian";
const ip = require("ip");

const c = new Cap();
console.log(ip.address(), c);
const device = Cap.findDevice(ip.address());
const { PROTOCOL } = decoders;

const filter = "tcp port 5555";
const bufSize = 10 * 1024 * 1024;
const buffer = new Buffer(65535);

const linkType = c.open(device, filter, bufSize, buffer);

c.setMinBytes && c.setMinBytes(0);

export type Listener = {
    filters: string | string[];
    callback: (packet: Packet) => void;
};
const listeners: { current: Listener[] } = {
    current: [],
};

export const createListener = () => {
    c.on("packet", () => {
        if (linkType === "ETHERNET") {
            var ret = decoders.Ethernet(buffer);

            if (ret.info.type === PROTOCOL.ETHERNET.IPV4) {
                ret = decoders.IPV4(buffer, ret.offset);

                if (ret.info.protocol === PROTOCOL.IP.TCP) {
                    var datalen = ret.info.totallen - ret.hdrlen;

                    ret = decoders.TCP(buffer, ret.offset);
                    datalen -= ret.hdrlen;

                    const str = buffer.toString("hex", ret.offset, datalen + ret.offset);
                    if (!str.length) return;
                    const kPacket = new Packet(Buffer.from(str, "hex"));
                    console.log(kPacket.label || kPacket.packetId);
                    listeners.current.forEach((listener) => {
                        if (!listener) return;
                        if (!kPacket.label) return;
                        if (
                            Array.isArray(listener.filters) &&
                            !listener.filters.includes(kPacket.label)
                        )
                            return;
                        if (!Array.isArray(listener.filters) && listener.filters != kPacket.label)
                            return;
                        listener.callback(kPacket);
                    });
                } else if (ret.info.protocol === PROTOCOL.IP.UDP) {
                    ret = decoders.UDP(buffer, ret.offset);
                } else console.log("Unsupported IPv4 protocol: " + PROTOCOL.IP[ret.info.protocol]);
            } else console.log("Unsupported Ethertype: " + PROTOCOL.ETHERNET[ret.info.type]);
        }
    });
};

export const addListener = (listener: Listener) => {
    listeners.current.push(listener);
};
