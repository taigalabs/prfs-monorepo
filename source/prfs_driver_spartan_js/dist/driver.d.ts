import { CircuitDriver, DriverEventListener, ProveArgs, ProveReceipt, VerifyArgs } from "@taigalabs/prfs-driver-interface";
import { PrfsHandlers, BuildStatus, SpartanCircomDriverProperties } from "./types";
export default class SpartanDriver implements CircuitDriver {
    handlers: PrfsHandlers;
    circuit: Uint8Array;
    wtnsGen: Uint8Array;
    static newInstance(driverProps: SpartanCircomDriverProperties, eventListener: DriverEventListener): Promise<CircuitDriver>;
    private constructor();
    getArtifactCount(): number;
    getBuildStatus(): Promise<BuildStatus>;
    prove(args: ProveArgs<any>): Promise<ProveReceipt>;
    verify(args: VerifyArgs): Promise<boolean>;
}
