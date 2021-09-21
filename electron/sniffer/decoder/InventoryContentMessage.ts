import ByteBuffer from "bytebuffer";

import protocolTypes from "../../data/protocolTypeManager.json";
import { makeArrayOf } from "@pastable/core";
import { readVarShort, readVarInt, readVarLong, readUtf } from "./utils";

import fs from "fs";
import path from "path";

import items from "../../data/item.min.json";
import translations from "../../data/i18n_fr.json";

export const getNameId = (gid: number) => (items as any[]).find((item) => item.id === gid)?.nameId;
//@ts-ignore
export const getTranslation = (nameId: number) => translations.texts[String(nameId)];

export const getItemsFromBuffer = (baseBuffer: Buffer) => {
    const buf = ByteBuffer.wrap(baseBuffer);

    const nbItems = buf.readUint16();

    const items = makeArrayOf(nbItems).map(() => {
        const position = buf.readUint16();

        const objectGID = readVarShort(buf);

        const nameId = getNameId(Number(objectGID));
        const name = getTranslation(nameId);

        const nbEffects = buf.readUint16();
        const effects = makeArrayOf(nbEffects).map(() => {
            const typeId = buf.readUint16();
            console.log(typeId);
            const actionId = readVarShort(buf);

            //@ts-ignore
            const effectType = protocolTypes[String(typeId)] as EffectTypes;

            return { typeId, actionId, effectType, ...actionByTypeId[effectType]?.(buf) };
        });

        const objectUID = readVarInt(buf);
        const quantity = readVarInt(buf);

        return { position, objectGID, effects, objectUID, quantity, name, nameId };
    });

    const kamas = readVarInt(buf);

    return { items, kamas };
};

type EffectTypes =
    | "ObjectEffect"
    | "ObjectEffectInteger"
    | "ObjectEffectCreature"
    | "ObjectEffectLadder"
    | "ObjectEffectMinMax"
    | "ObjectEffectDuration"
    | "ObjectEffectString"
    | "ObjectEffectDice"
    | "ObjectEffectDate"
    | "ObjectEffectMount";

const actionByTypeId: Record<EffectTypes, (buf: ByteBuffer) => any> = {
    ObjectEffect: () => {
        return {};
    },
    ObjectEffectInteger: (buf) => {
        const value = readVarInt(buf);

        return { value };
    },
    ObjectEffectCreature: (buf) => {
        const value = readVarShort(buf);

        return { value };
    },
    ObjectEffectLadder: (buf) => {
        const value = readVarInt(buf);

        return { value };
    },
    ObjectEffectMinMax: (buf) => {
        const min = readVarInt(buf);
        const max = readVarInt(buf);

        return { min, max };
    },
    ObjectEffectDuration: (buf) => {
        const days = readVarShort(buf);
        const minutes = buf.readByte();
        const seconds = buf.readByte();

        return { days, minutes, seconds };
    },
    ObjectEffectString: (buf) => {
        const value = readUtf(buf);

        return { value };
    },
    ObjectEffectDice: (buf) => {
        const num = readVarInt(buf);
        const side = readVarInt(buf);
        const constValue = readVarInt(buf);

        return { num, side, constValue };
    },
    ObjectEffectDate: (buf) => {
        const year = readVarShort(buf);
        const month = buf.readByte();
        const day = buf.readByte();
        const hour = buf.readByte();
        const minute = buf.readByte();

        return { year, month, day, hour, minute };
    },
    ObjectEffectMount: (buf) => {
        const byteBoxes = buf.readByte();

        const id = readVarLong(buf);

        const expirationDate = readVarLong(buf);

        const model = readVarInt(buf);
        const name = readUtf(buf);
        const owner = readUtf(buf);
        const level = buf.readUint8();

        const reproductionCount = readVarInt(buf);
        const reproductionCountMax = readVarInt(buf);

        const nbEffects = buf.readUint16();
        const effects = makeArrayOf(Number(nbEffects)).map(() =>
            actionByTypeId["ObjectEffectInteger"](buf)
        );

        const nbCapacities = buf.readUint16();
        const capacities = makeArrayOf(Number(nbCapacities)).map(() => readVarInt(buf));

        return {
            id,
            expirationDate,
            model,
            name,
            owner,
            level,
            byteBoxes,
            reproductionCount,
            reproductionCountMax,
            nbEffects,
            effects,
            nbCapacities,
            capacities,
        };
    },
};
export const parseInventory = () => {
    const packet = JSON.parse(
        fs.readFileSync(path.join(__dirname, "sample", "2mounts.json"), "utf-8")
    );
    const buff = Buffer.from(packet.message.data);
    console.log(buff);
    console.log(getItemsFromBuffer(buff));
};
