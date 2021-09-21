const MASK_10000000 = 128;
const MASK_01111111 = 127;
const SHORT_SIZE = 16;

const INT_SIZE = 32;
const CHUNCK_BIT_SIZE = 7;
const SHORT_MAX_VALUE = 32767;
const UNSIGNED_SHORT_MAX_VALUE = 65536;

export const readVarInt = (bb: ByteBuffer) => {
    var _loc4_: number = 0;
    var _loc1_: number = 0;
    var _loc2_: number = 0;
    var _loc3_: boolean = false;
    while (_loc2_ < INT_SIZE) {
        _loc4_ = bb.readByte();
        _loc3_ = (_loc4_ & MASK_10000000) === MASK_10000000;
        if (_loc2_ > 0) {
            _loc1_ = _loc1_ + ((_loc4_ & MASK_01111111) << _loc2_);
        } else {
            _loc1_ = _loc1_ + (_loc4_ & MASK_01111111);
        }
        _loc2_ = _loc2_ + CHUNCK_BIT_SIZE;
        if (!_loc3_) {
            return _loc1_;
        }
    }
    throw new Error("Too much data");
};

export const readVarLong = (buf: ByteBuffer) => {
    let ret = 0n;

    for (let i = 0n; i < 64n; i += 7n) {
        const b = BigInt(buf.readUint8());
        ret += (b & 0x7fn) << i;

        if (!(b & 0x80n)) return Number(ret);
    }

    throw new Error("Can't read custom variable, too much data.");
};

export const readVarShort = (bb: ByteBuffer): Number => {
    var _loc4_: number = 0;
    var _loc1_: number = 0;
    var _loc2_: number = 0;
    var _loc3_: boolean = false;
    while (_loc2_ < SHORT_SIZE) {
        _loc4_ = bb.readByte();
        _loc3_ = (_loc4_ & MASK_10000000) === MASK_10000000;
        if (_loc2_ > 0) {
            _loc1_ = _loc1_ + ((_loc4_ & MASK_01111111) << _loc2_);
        } else {
            _loc1_ = _loc1_ + (_loc4_ & MASK_01111111);
        }
        _loc2_ = _loc2_ + CHUNCK_BIT_SIZE;
        if (!_loc3_) {
            if (_loc1_ > SHORT_MAX_VALUE) {
                _loc1_ = _loc1_ - UNSIGNED_SHORT_MAX_VALUE;
            }
            return _loc1_;
        }
    }
    throw new Error("Too much data");
};

export const readUtf = (buf: ByteBuffer) => {
    return buf.readUTF8String(buf.readShort());
};
