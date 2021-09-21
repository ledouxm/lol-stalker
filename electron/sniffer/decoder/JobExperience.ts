import ByteBuffer from "bytebuffer";
import { readVarLong } from "./utils";

export const getObjectQuantity = (baseBuffer: Buffer) => {
    const buf = ByteBuffer.wrap(baseBuffer);

    const jobId = buf.readUint8();
    const jobLevel = buf.readUint8();

    const jobXp = readVarLong(buf);

    const jobXpLevelFloor = readVarLong(buf);
    const jobXpNextLevelFloor = readVarLong(buf);

    return { jobId, jobLevel, jobXp, jobXpLevelFloor, jobXpNextLevelFloor };
};
