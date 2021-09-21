import ByteBuffer from "bytebuffer";
import { readVarInt, readVarShort } from "./utils";

export const getUseEndedMessage = (baseBuffer: Buffer) => {
    const buf = ByteBuffer.wrap(baseBuffer);

    const elemId = readVarInt(buf);
    const skillId = readVarShort(buf);

    return { elemId, skillId };
};
