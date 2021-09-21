import messageTypes from "../data/messageReceiver.json";

function extract_bits(number: number, number_of_bits: number, bits_to_skip: number) {
    const mask = (1 << number_of_bits) - 1;
    return (number >> bits_to_skip) & mask;
}

class ServerChatMessage {
    chatMessageCanal: number;
    chatMessageLength: number;
    chatMessage: Buffer;
    chatMessageAuthor: Buffer;

    constructor(message_buffer: Buffer) {
        const message_canal_offset = 0x0;
        const message_length_offset = 0x2;
        const message_length_size = 0x1;
        const message_unk_data_size = 24;
        var offset = 0;

        console.log("MessageBuffer: ", message_buffer);

        this.chatMessageCanal = message_buffer.readInt8();
        this.chatMessageLength = message_buffer.readIntBE(
            message_length_offset,
            message_length_size
        );

        offset += message_length_offset;
        offset += message_length_size;

        this.chatMessage = message_buffer.subarray(offset, offset + this.chatMessageLength);

        offset += this.chatMessageLength;
        offset += message_unk_data_size;

        this.chatMessageAuthor = message_buffer.subarray(offset, offset + 12);
        console.log("ChatMessageCanal:", this.chatMessageCanal);
        console.log("ChatMessageLength:", this.chatMessageLength);
        console.log("ChatMessage: ", this.chatMessage.toString());
        console.log("ChatMessageAuthor: ", this.chatMessageAuthor.toString());
    }
}

export class Packet {
    packetId: number;
    label: string;
    lengthByteSize: number;
    messageLength?: number;
    message: Buffer;
    constructor(packet_buffer: Buffer) {
        const header_size = 0x2;
        const header = packet_buffer.readInt16BE();

        this.packetId = extract_bits(header, 14, 2);
        //@ts-ignore
        this.label = messageTypes[String(this.packetId)];
        this.lengthByteSize = extract_bits(header, 2, 0);
        if (this.lengthByteSize)
            this.messageLength = packet_buffer.readIntBE(header_size, this.lengthByteSize);
        this.message = Buffer.from(
            packet_buffer.subarray(
                header_size + this.lengthByteSize,
                header_size + this.lengthByteSize + (this.messageLength || 0)
            )
        );
    }
}
