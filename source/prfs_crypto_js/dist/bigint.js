import { toUtf8Bytes } from "ethers/lib/utils";
export function bnToBuf(bn) {
    // The handy-dandy `toString(base)` works!!
    var hex = BigInt(bn).toString(16);
    // But it still follows the old behavior of giving
    // invalid hex strings (due to missing padding),
    // but we can easily add that back
    if (hex.length % 2) {
        hex = "0" + hex;
    }
    // The byteLength will be half of the hex string length
    var len = hex.length / 2;
    var u8 = new Uint8Array(len);
    // And then we can iterate each element by one
    // and each hex segment by two
    var i = 0;
    var j = 0;
    while (i < len) {
        u8[i] = parseInt(hex.slice(j, j + 2), 16);
        i += 1;
        j += 2;
    }
    // Tada!!
    return u8;
}
export function stringToBigInt(str) {
    const bytes = toUtf8Bytes(str);
    return bytesToBigInt(bytes);
}
export const bytesToBigInt = (bytes) => BigInt("0x" + Buffer.from(bytes).toString("hex"));
export const bytesLeToBigInt = (bytes) => {
    const b = new Uint8Array(bytes);
    const reversed = b.reverse();
    return bytesToBigInt(reversed);
};
export const bigIntToBytes = (n, size) => {
    const hex = n.toString(16);
    const hexPadded = hex.padStart(size * 2, "0");
    return Buffer.from(hexPadded, "hex");
};
export const bigIntToLeBytes = (n, size) => {
    const bytes = bigIntToBytes(n, size);
    return bytes.reverse();
};
export function numToUint8Array(num) {
    let arr = new Uint8Array(8);
    for (let i = 0; i < 8; i++) {
        arr[i] = num % 256;
        num = Math.floor(num / 256);
    }
    return arr;
}
export function uint8ArrayToNum(arr) {
    let num = 0;
    for (let i = 7; i >= 0; i--) {
        num = num * 256 + arr[i];
    }
    return num;
}
