import { CircuitDriver, DriverEventListener, ProveArgs, ProveReceipt, VerifyArgs } from "@taigalabs/prfs-driver-interface";
import { Tree } from "./utils/tree";
import { PrfsHandlers, AsyncHashFn, BuildStatus, SpartanCircomDriverProperties } from "./types";
export default class SpartanDriver implements CircuitDriver {
    handlers: PrfsHandlers;
    circuit: Uint8Array;
    wtnsGen: Uint8Array;
    static newInstance(driverProps: SpartanCircomDriverProperties, eventListener: DriverEventListener): Promise<CircuitDriver>;
    private constructor();
    getArtifactCount(): number;
    getBuildStatus(): Promise<BuildStatus>;
    makeMerkleProof(leaves: string[], leafIdx: BigInt, depth: number): Promise<import("@taigalabs/prfs-proof-interface").SpartanMerkleProof>;
    hash(args: bigint[]): Promise<bigint>;
    newTree(depth: number, hash: AsyncHashFn): Promise<Tree>;
    prove(args: ProveArgs<any>): Promise<ProveReceipt>;
    verify(args: VerifyArgs): Promise<boolean>;
}
