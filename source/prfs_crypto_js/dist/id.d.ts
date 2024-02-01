import { PrivateKey, PublicKey } from "eciesjs";
export declare function makeEncryptKey(secret: string): Promise<PublicKey>;
export declare function makeDecryptKey(secret: string): Promise<PrivateKey>;
export declare function makeECCredential(secret: Uint8Array): Promise<ECCredential>;
export interface ECCredential {
    secret_key: string;
    public_key: string;
    id: string;
}
