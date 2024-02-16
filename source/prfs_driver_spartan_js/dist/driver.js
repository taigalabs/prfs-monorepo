import { Tree } from "./utils/tree";
import { makePoseidon } from "./utils/poseidon";
import { initWasm } from "./wasm_wrapper/load_worker";
import { fetchAsset } from "./utils/utils";
export default class SpartanDriver {
    handlers;
    circuit;
    wtnsGen;
    static async newInstance(driverProps, eventListener) {
        console.log("Creating a driver instance, props: %o", driverProps);
        let prfsHandlers;
        try {
            prfsHandlers = await initWasm();
            const { circuit_url, wtns_gen_url, version } = driverProps;
            let vs;
            if (version) {
                vs = version;
            }
            else {
                console.log("Version is not found in driver props, falling back to timestamp");
                const ts = Date.now();
                vs = ts.toString();
            }
            const [circuit, wtnsGen] = await Promise.all([
                fetchAsset("circuit", `${circuit_url}?version=${vs}`, eventListener),
                fetchAsset("wtnsGen", `${wtns_gen_url}?version=${vs}`, eventListener),
            ]);
            eventListener({
                type: "LOAD_DRIVER_SUCCESS",
                payload: {
                    artifactCount: 2,
                },
            });
            const args = {
                handlers: prfsHandlers,
                wtnsGen,
                circuit,
            };
            const obj = new SpartanDriver(args);
            return obj;
        }
        catch (err) {
            throw err;
        }
    }
    constructor(args) {
        this.handlers = args.handlers;
        if (args.circuit === undefined) {
            throw new Error("Spartan cannot be instantiated without circuit");
        }
        if (args.wtnsGen === undefined) {
            throw new Error("Spartan cannot be instantiated without wtnsGen");
        }
        this.circuit = args.circuit;
        this.wtnsGen = args.wtnsGen;
    }
    getArtifactCount() {
        return 2;
    }
    async getBuildStatus() {
        return this.handlers.getBuildStatus();
    }
    async makeMerkleProof(leaves, leafIdx, depth) {
        return this.handlers.makeMerkleProof(leaves, leafIdx, depth);
    }
    async hash(args) {
        const poseidon = makePoseidon(this.handlers);
        const ret = await poseidon(args);
        return ret;
    }
    async newTree(depth, hash) {
        return await Tree.newInstance(depth, hash);
    }
    async prove(args) {
        try {
            switch (args.circuitTypeId) {
                case "simple_hash_v1": {
                    const { proveSimpleHash } = await import("./proof_types/simple_hash/simple_hash");
                    return proveSimpleHash(args, this.handlers, this.wtnsGen, this.circuit);
                }
                case "addr_membership_v1": {
                    const { proveMembership } = await import("./proof_types/membership_proof/membership_proof_1");
                    return proveMembership(args, this.handlers, this.wtnsGen, this.circuit);
                }
                case "merkle_sig_pos_range_v1": {
                    const { proveMembership } = await import("./proof_types/merkle_sig_pos_range/merkle_sig_pos_range_v1");
                    return proveMembership(args, this.handlers, this.wtnsGen, this.circuit);
                }
                default:
                    throw new Error(`Unknown circuit type: ${args.circuitTypeId}`);
            }
        }
        catch (err) {
            console.error("Error creating a proof, err: %o", err);
            return Promise.reject(err);
        }
    }
    async verify(args) {
        try {
            switch (args.circuitTypeId) {
                case "simple_hash_v1": {
                    const { verifyMembership } = await import("./proof_types/simple_hash/simple_hash");
                    return verifyMembership(args, this.handlers, this.circuit);
                }
                case "addr_membership_v1": {
                    const { verifyMembership } = await import("./proof_types/membership_proof/membership_proof_1");
                    return verifyMembership(args, this.handlers, this.circuit);
                }
                case "merkle_sig_pos_range_v1": {
                    const { verifyMembership } = await import("./proof_types/merkle_sig_pos_range/merkle_sig_pos_range_v1");
                    return verifyMembership(args, this.handlers, this.circuit);
                }
                default:
                    throw new Error(`Unknown circuit type: ${args.circuitTypeId}`);
            }
        }
        catch (err) {
            console.error("Error verifying a proof, err: %o", err);
            return Promise.reject(err);
        }
    }
}
