import {
  fetchAccount,
  PublicKey,
  Field,
  MerkleTree,
  MerkleWitness,
  Poseidon,
  CircuitString,
} from "o1js";
import { MerkleSigPosRangeV1ContractUpdateArgs } from "@taigalabs/prfs-circuits-o1js/src/merkle_sig_pos_range_v1";

import type { ZkappWorkerRequest, ZkappWorkerReponse, WorkerFunctions } from "./zkappWorker";

export default class ZkappWorkerClient {
  // ---------------------------------------------------------------------------------------

  setActiveInstanceToBerkeley() {
    return this._call("setActiveInstanceToBerkeley", {});
  }

  loadContract() {
    return this._call("loadContract", {});
  }

  compileContract() {
    return this._call("compileContract", {});
  }

  fetchAccount({ publicKey }: { publicKey: PublicKey }): ReturnType<typeof fetchAccount> {
    const result = this._call("fetchAccount", {
      publicKey58: publicKey.toBase58(),
    });
    return result as ReturnType<typeof fetchAccount>;
  }

  initZkappInstance(publicKey: PublicKey) {
    return this._call("initZkappInstance", {
      publicKey58: publicKey.toBase58(),
    });
  }

  fn1() {
    return this._call("fn1", {});
  }

  fn2() {
    return this._call("fn2", {});
  }

  fn3() {
    return this._call("fn3", {});
  }

  fn4() {
    return this._call("fn4", {});
  }

  fn5() {
    return this._call("fn5", {});
  }

  fn6(args_: MerkleSigPosRangeV1ContractUpdateArgs) {
    const idx0 = 0n;
    const tree = new MerkleTree(32);
    const sigpos = Field(10);
    const assetSize = Field(1521);
    const assetSizeGreaterEqThan = Field(1000);
    const assetSizeLessThan = Field(10000);
    const nonceRaw = "nonce";
    const nonceInt = Poseidon.hash(CircuitString.fromString(nonceRaw).toFields());
    const proofPubKey = "0x0";
    const proofPubKeyInt = Poseidon.hash(CircuitString.fromString(proofPubKey).toFields());

    const leaf = Poseidon.hash([sigpos, assetSize]);
    tree.setLeaf(idx0, leaf);
    tree.setLeaf(1n, Field(1));
    tree.setLeaf(2n, Field(2));
    tree.setLeaf(3n, Field(3));

    const sigposAndNonce = Poseidon.hash([sigpos, nonceInt]);
    const serialNo = Poseidon.hash([sigposAndNonce, proofPubKeyInt]);
    const root = tree.getRoot();
    const witness = tree.getWitness(idx0);
    const merklePath = witness.map(w => {
      const obj = {
        isLeft: w.isLeft,
        sibling: w.sibling.toJSON(),
      };
      return obj;
    });

    const args: MerkleSigPosRangeV1ContractUpdateArgs = {
      // root: root.toJSON(),
      root: args_.root,
      sigpos: sigpos.toJSON(),
      // sigpos: sigpos.toJSON(),
      merklePath,
      leaf: leaf.toJSON(),
      assetSize: assetSize.toJSON(),
      assetSizeGreaterEqThan: assetSizeGreaterEqThan.toJSON(),
      assetSizeLessThan: assetSizeLessThan.toJSON(),
      nonce: nonceInt.toJSON(),
      proofPubKey: proofPubKeyInt.toJSON(),
      serialNo: serialNo.toJSON(),
    };
    console.log(11, args, args_);

    return this._call("fn6", args);
  }

  async getRoot(): Promise<Field> {
    const result = await this._call("getRoot", {});
    return Field.fromJSON(JSON.parse(result as string));
  }

  async getNum(): Promise<Field> {
    const result = await this._call("getNum", {});
    return Field.fromJSON(JSON.parse(result as string));
  }

  proveUpdateTransaction() {
    return this._call("proveUpdateTransaction", {});
  }

  async getTransactionJSON() {
    const result = await this._call("getTransactionJSON", {});
    return result;
  }

  // ---------------------------------------------------------------------------------------

  worker: Worker;

  promises: {
    [id: number]: { resolve: (res: any) => void; reject: (err: any) => void };
  };

  nextId: number;

  constructor() {
    this.worker = new Worker(new URL("./zkappWorker.ts", import.meta.url));
    this.promises = {};
    this.nextId = 0;

    this.worker.onmessage = (event: MessageEvent<ZkappWorkerReponse>) => {
      this.promises[event.data.id].resolve(event.data.data);
      delete this.promises[event.data.id];
    };
  }

  _call(fn: WorkerFunctions, args: any) {
    return new Promise((resolve, reject) => {
      this.promises[this.nextId] = { resolve, reject };

      const message: ZkappWorkerRequest = {
        id: this.nextId,
        fn,
        args,
      };

      // console.log("msg", message);

      this.worker.postMessage(message);

      this.nextId++;
    });
  }
}
