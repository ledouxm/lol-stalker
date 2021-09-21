import ByteBuffer from "bytebuffer";
import { readVarInt } from "./utils";

export const getObjectQuantity = (baseBuffer: Buffer) => {
    const buf = ByteBuffer.wrap(baseBuffer);

    const objectUID = readVarInt(buf);
    const quantity = readVarInt(buf);
    const origin = buf.readUint8();

    return { objectUID, quantity, origin };
};
