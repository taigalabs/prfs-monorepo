Proves he knows the preimage of a cryptographic hash function

## Poseidon hash function

Poseidon is a hash function that is designed to run efficiently in an arithmetic circuit.
Poesidon maps strings over Fp (for a prime p ≈ 2n) to fixed-length strings over Fp, i.e.,
POSEIDON : (F_∗)^p → (F_o)^p, where o is the output length measured in Fp elements (usually,
o = 1). It is constructed by instantiating a sponge function with the POSEIDONπ permutation.
POSEIDONπ is a variant of HADESMiMC, albeit instantiated with a fixed and known key.
