import {
  CircuitString,
  Field,
  MerkleTree,
  MerkleWitness,
  Mina,
  Poseidon,
  PublicKey,
  fetchAccount,
} from "o1js";

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import {
  type MerkleSigPosRangeV1Contract,
  type MerkleSigPosRangeV1ContractUpdateArgs,
} from "@taigalabs/prfs-circuits-o1js/src/merkle_sig_pos_range_v1";
import { Witness } from "o1js/dist/node/lib/merkle-tree";

const state = {
  MerkleSigPosRangeV1Contract: null as
    | null
    | typeof MerkleSigPosRangeV1Contract,
  zkapp: null as null | MerkleSigPosRangeV1Contract,
  transaction: null as null | Transaction,
};

// ---------------------------------------------------------------------------------------
//
class MerkleWitness32 extends MerkleWitness(32) { }

const functions = {
  setActiveInstanceToBerkeley: async (args: {}) => {
    const Berkeley = Mina.Network(
      "https://api.minascan.io/node/berkeley/v1/graphql",
    );
    console.log("Berkeley Instance Created");
    Mina.setActiveInstance(Berkeley);
  },
  loadContract: async (args: {}) => {
    const { MerkleSigPosRangeV1Contract } = await import(
      "@taigalabs/prfs-circuits-o1js/build/src/merkle_sig_pos_range_v1.js"
    );
    state.MerkleSigPosRangeV1Contract = MerkleSigPosRangeV1Contract;
  },
  compileContract: async (args: {}) => {
    await state.MerkleSigPosRangeV1Contract!.compile();
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.MerkleSigPosRangeV1Contract!(publicKey);
  },

  getNum: async (args: {}) => {
    const currentNum = await state.zkapp!.num.get();
    return JSON.stringify(currentNum.toJSON());
  },

  getRoot: async (args: {}) => {
    const root = await state.zkapp!.root.get();
    return JSON.stringify(root.toJSON());
  },

  fn1: async (args: {}) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp!.fn1();
    });
    state.transaction = transaction;
  },

  fn2: async (args: {}) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp!.fn2(Field(0));
    });
    state.transaction = transaction;
  },

  fn3: async (args: {}) => {
    // class MerkleWitness32 extends MerkleWitness(32) {}
    const tree = new MerkleTree(32);
    tree.setLeaf(0n, Field(0));
    const merklePath = new MerkleWitness32(tree.getWitness(0n));
    const transaction = await Mina.transaction(() => {
      state.zkapp!.fn3(Field(0), merklePath);
    });
    state.transaction = transaction;
  },

  fn4: async (args: {}) => {
    const tree = new MerkleTree(32);
    const leaf = Field(10);
    tree.setLeaf(0n, leaf);
    const root = tree.getRoot();

    const merklePath = new MerkleWitness32(tree.getWitness(0n));
    const transaction = await Mina.transaction(() => {
      state.zkapp!.fn4(root, merklePath, leaf);
    });
    state.transaction = transaction;
  },

  fn5: async (args: {}) => {
    const idx0 = 0n;
    const tree = new MerkleTree(32);
    const sigpos = Field(10);
    const assetSize = Field(1521);
    const assetSizeGreaterEqThan = Field(1000);
    const assetSizeLessThan = Field(10000);
    const nonceRaw = "nonce";
    const nonceInt = Poseidon.hash(
      CircuitString.fromString(nonceRaw).toFields(),
    );
    const proofPubKey = "0x0";
    const proofPubKeyInt = Poseidon.hash(
      CircuitString.fromString(proofPubKey).toFields(),
    );

    const leaf = Poseidon.hash([sigpos, assetSize]);
    tree.setLeaf(idx0, leaf);
    tree.setLeaf(1n, Field(1));
    tree.setLeaf(2n, Field(2));
    tree.setLeaf(3n, Field(3));

    const sigposAndNonce = Poseidon.hash([sigpos, nonceInt]);
    const serialNo = Poseidon.hash([sigposAndNonce, proofPubKeyInt]);
    const root = tree.getRoot();
    const merklePath = new MerkleWitness32(tree.getWitness(idx0));

    const transaction = await Mina.transaction(() => {
      state.zkapp!.update(
        root,
        sigpos,
        merklePath,
        leaf,
        assetSize,
        assetSizeGreaterEqThan,
        assetSizeLessThan,
        nonceInt,
        proofPubKeyInt,
        serialNo,
      );
    });

    state.transaction = transaction;
  },

  fn6: async (args: MerkleSigPosRangeV1ContractUpdateArgs) => {
    console.log(1, args);

    const root = Field.fromJSON(args.root);
    const sigpos = Field.fromJSON(args.sigpos);
    const assetSize = Field.fromJSON(args.assetSize);
    const assetSizeGreaterEqThan = Field.fromJSON(args.assetSizeGreaterEqThan);
    const assetSizeLessThan = Field.fromJSON(args.assetSizeLessThan);
    const nonce = Field.fromJSON(args.nonce);
    const proofPubKey = Field.fromJSON(args.proofPubKey);
    const serialNo = Field.fromJSON(args.serialNo);
    const leaf = Field.fromJSON(args.leaf);

    const witness: Witness = args.merklePath.map((p) => {
      const w = {
        isLeft: p.isLeft,
        sibling: Field.fromJSON(p.sibling),
      };
      return w;
    });

    const merklePath = new MerkleWitness32(witness);

    const transaction = await Mina.transaction(() => {
      state.zkapp!.update(
        root,
        sigpos,
        merklePath,
        leaf,
        assetSize,
        assetSizeGreaterEqThan,
        assetSizeLessThan,
        nonce,
        proofPubKey,
        serialNo,
      );
    });

    state.transaction = transaction;
  },

  createUpdateTransaction: async (
    args: MerkleSigPosRangeV1ContractUpdateArgs,
  ) => {
    // const {
    //   root,
    //   sigpos,
    //   merklePath,
    //   leaf,
    //   assetSize,
    //   assetSizeGreaterEqThan,
    //   assetSizeLessThan,
    //   nonce,
    //   proofPubKey,
    //   serialNo,
    // } = args;
    // console.log("args", args);
    // const transaction = await Mina.transaction(() => {
    //   state.zkapp!.update(
    //     root,
    //     sigpos,
    //     merklePath,
    //     leaf,
    //     assetSize,
    //     assetSizeGreaterEqThan,
    //     assetSizeLessThan,
    //     nonce,
    //     proofPubKey,
    //     serialNo,
    //   );
    // });
    // console.log("transaction done");
    // state.transaction = transaction;
  },

  proveUpdateTransaction: async (args: {}) => {
    await state.transaction!.prove();
  },

  getTransactionJSON: async (args: {}) => {
    return state.transaction!.toJSON();
  },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number;
  fn: WorkerFunctions;
  args: any;
};

export type ZkappWorkerReponse = {
  id: number;
  data: any;
};

if (typeof window !== "undefined") {
  addEventListener(
    "message",
    async (event: MessageEvent<ZkappWorkerRequest>) => {
      const returnData = await functions[event.data.fn](event.data.args);
      console.log("Return data", returnData);

      const message: ZkappWorkerReponse = {
        id: event.data.id,
        data: returnData,
      };
      postMessage(message);
    },
  );
}

console.log("Web Worker Successfully Initialized.");
