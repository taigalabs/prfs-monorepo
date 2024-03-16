import { CircuitDriver, DriverEventListener, ProveArgs, ProveResult, VerifyArgs } from "@taigalabs/prfs-driver-interface";
import { PrfsHandlers, BuildStatus, SpartanCircomDriverProperties } from "./types";
export default class SpartanDriver implements CircuitDriver {
    handlers: PrfsHandlers;
    circuit: Uint8Array;
    wtnsGen: Uint8Array;
    static newInstance(driverProps: SpartanCircomDriverProperties, eventListener: DriverEventListener): Promise<CircuitDriver>;
    private constructor();
    getArtifactCount(): number;
    getBuildStatus(): Promise<BuildStatus>;
    prove(args: ProveArgs<any>): Promise<ProveResult>;
    verify(args: VerifyArgs): Promise<boolean>;
}
