# Prfs: Client-side ZK-Proof Generation

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A high-performance, client-side cryptographic module for generating **Zero-Knowledge Proofs (ZKP)**. This project allows users to authenticate via familiar flows (like Google Sign-In) to generate the proof locally in the browser, ensuring the raw credential never touches a server.

## Demo
[![Prfs - Demo](documentation/prfs_1.png)](https://drive.google.com/file/d/1GGG9Cuun56-7v7Wo_jrv6leu4k5gNLH5/view)

[![Shy - Demo](documentation/shy_1.png)](https://drive.google.com/file/d/1uNj1EhtIi4FKXwl-i646aver1o6AQUzG/view)

## 🚀 Key Features

- **Local Execution**: Proof generation occurs entirely on the client-side via WebAssembly (WASM), keeping private witnesses (credentials) secure on the user's device.
- **No Trusted Setup**: Implements the **Spartan SNARK** framework (Setty, 2019), utilizing a transparent polynomial commitment scheme to eliminate CRS ceremony risks.
- **Credential Compatibility**: Full support for the **secp256k1** elliptic curve, enabling ZKP for ECDSA signatures and common Web2 identity tokens.
- **UI-Friendly**: Designed to integrate with "Google Sign-On" style interfaces for a seamless user experience.

## 🛠 Technical Stack

- **Proof Algorithm**: [Spartan](https://github.com/microsoft/Spartan) (Efficient, general-purpose SNARKs without trusted setup).
- **Language**: Rust, WASM, Circom, and TypeScript.
- **Constraint System**: Rank-1 Constraint System (R1CS).

---

## 📐 Architecture

The system bridges the gap between traditional Web2 identity and Web3 privacy:

1. **Identity Capture**: User authenticates through a standard UI (OAuth).
2. **Witness Preparation**: The module extracts the necessary signatures/claims as a private witness.
3. **Local Proving**: The Spartan prover executes a SNARK over the credential constraints.
4. **Verification**: A succinct proof is outputted, allowing any third party to verify the credential's validity without seeing the secret data.



### Spartan Performance Advantage
Unlike Groth16, Spartan does not require a per-circuit trusted setup. It offers:
- **Prover Time**: Linear to the number of constraints $O(N)$.
- **Proof Size**: Polylogarithmic $\tilde{O}(\log^2 N)$.
- **Verification**: Extremely fast, suitable for on-chain or off-chain check.

---

## 🔬 Technical Deep Dive: secp256k1 Optimization

Generating proofs for **secp256k1** in a ZK circuit is computationally expensive due to the large field size and the complexity of elliptic curve scalar multiplication. 

Prfs optimizes this by:
- **Efficient BigInt Arithmetic**: Utilizing specialized R1CS constraints for foreign-field arithmetic to handle secp256k1's 256-bit prime field.
- **Precomputed Tables**: Leveraging precomputed points where possible to reduce the number of constraints required for point addition and doubling.
- **Circom Integration**: Using Circom to define the circuit logic for ECDSA verification, which is then compiled and executed via the Spartan prover in Rust/WASM.



---

## ⚡ Performance

By optimizing the `secp256k1` scalar multiplication inside the Spartan R1CS, we achieve industry-leading performance for browser-based proving:

| Component | Operation | Latency (Browser) |
| :--- | :--- | :--- |
| **WASM Init** | Environment Setup | ~150ms |
| **Witness Gen** | Data Mapping | ~50ms |
| **Spartan Proving** | SNARK Generation | **< 6s** |
| **Verification** | Succinct Check | ~10ms |

---

