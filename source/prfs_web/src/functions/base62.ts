// base-x encoding / decoding
// Copyright (c) 2021 AJ ONeal
// Copyright (c) 2018 base-x contributors
// Copyright (c) 2014-2018 The Bitcoin Core developers (base58.cpp)
// Distributed under the MIT software license, see the accompanying
// file LICENSE or http://www.opensource.org/licenses/mit-license.php.

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const Base62 = {
  createEncoder: function (ALPHABET?: string) {
    if (!ALPHABET) {
      ALPHABET = BASE62;
    }

    if (ALPHABET.length >= 255) {
      throw new TypeError("Alphabet too long");
    }

    const BASE_MAP = new Uint8Array(256);
    for (var j = 0; j < BASE_MAP.length; j += 1) {
      BASE_MAP[j] = 255;
    }

    for (var i = 0; i < ALPHABET.length; i += 1) {
      const x = ALPHABET.charAt(i);
      const xc = x.charCodeAt(0);
      if (BASE_MAP[xc] !== 255) {
        throw new TypeError(x + " is ambiguous");
      }
      BASE_MAP[xc] = i;
    }

    const BASE = ALPHABET.length;
    const LEADER = ALPHABET.charAt(0);
    const FACTOR = Math.log(BASE) / Math.log(256); // log(BASE) / log(256), rounded up
    const iFACTOR = Math.log(256) / Math.log(BASE); // log(256) / log(BASE), rounded up

    function encode(source: any) {
      if (Array.isArray(source) || !(source instanceof Uint8Array)) {
        source = Uint8Array.from(source);
      }

      if (!(source instanceof Uint8Array)) {
        throw new TypeError("Expected Uint8Array");
      }

      if (source.length === 0) {
        return "";
      }

      // Skip & count leading zeroes.
      let zeroes = 0;
      let length = 0;
      let pbegin = 0;
      let pend = source.length;

      while (pbegin !== pend && source[pbegin] === 0) {
        pbegin += 1;
        zeroes += 1;
      }

      // Allocate enough space in big-endian base58 representation.
      let size = ((pend - pbegin) * iFACTOR + 1) >>> 0;
      let b58 = new Uint8Array(size);

      // Process the bytes.
      while (pbegin !== pend) {
        var carry = source[pbegin];
        // Apply "b58 = b58 * 256 + ch".
        var i = 0;
        for (var it1 = size - 1; (carry !== 0 || i < length) && it1 !== -1; it1 -= 1, i += 1) {
          carry += (256 * b58[it1]) >>> 0;
          b58[it1] = carry % BASE >>> 0;
          carry = (carry / BASE) >>> 0;
        }
        if (carry !== 0) {
          throw new Error("Non-zero carry");
        }
        length = i;
        pbegin += 1;
      }
      // Skip leading zeroes in base58 result.
      let it2 = size - length;
      while (it2 !== size && b58[it2] === 0) {
        it2 += 1;
      }
      // Translate the result into a string.
      let str = LEADER.repeat(zeroes);
      for (; it2 < size; it2 += 1) {
        str += ALPHABET!.charAt(b58[it2]);
      }
      return str;
    }

    function decodeUnsafe(source: string) {
      if (typeof source !== "string") {
        throw new TypeError("Expected String");
      }

      if (source.length === 0) {
        return new Uint8Array(0);
      }

      let psz = 0;
      // Skip and count leading '1's.
      let zeroes = 0;
      let length = 0;

      while (source[psz] === LEADER) {
        zeroes += 1;
        psz += 1;
      }

      // Allocate enough space in big-endian base256 representation.
      let size = ((source.length - psz) * FACTOR + 1) >>> 0; // log(58) / log(256), rounded up.
      let b256 = new Uint8Array(size);

      // Process the characters.
      while (source[psz]) {
        // Decode character
        var carry = BASE_MAP[source.charCodeAt(psz)];
        // Invalid character
        if (carry === 255) {
          return;
        }
        var i = 0;
        for (var it3 = size - 1; (carry !== 0 || i < length) && it3 !== -1; it3 -= 1, i += 1) {
          carry += (BASE * b256[it3]) >>> 0;
          b256[it3] = carry % 256 >>> 0;
          carry = (carry / 256) >>> 0;
        }
        if (carry !== 0) {
          throw new Error("Non-zero carry");
        }
        length = i;
        psz += 1;
      }
      // Skip leading zeroes in b256.
      var it4 = size - length;
      while (it4 !== size && b256[it4] === 0) {
        it4 += 1;
      }

      var vch = new Uint8Array(zeroes + (size - it4));
      var j = zeroes;
      while (it4 !== size) {
        vch[j] = b256[it4];
        j += 1;
        it4 += 1;
      }

      return vch;
    }

    function decode(string: string) {
      var buffer = decodeUnsafe(string);

      if (buffer) {
        return buffer;
      }

      throw new Error("Non-base" + BASE + " character");
    }

    return {
      encode,
      decodeUnsafe,
      decode,
    };
  },
};

const b62 = Base62.createEncoder();

export default b62;
