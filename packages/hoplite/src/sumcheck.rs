use crate::{
    circuit_vals::{CVDotProdProof, CVSumCheckProof, FromCircuitVal},
    dotprod,
    utils::to_fq,
    Fq, MultiCommitGens,
};
use libspartan::{
    group::CompressedGroup,
    transcript::{AppendToTranscript, ProofTranscript, Transcript},
};
use secpq_curves::Secq256k1;

#[derive(Debug, Clone)]
pub struct RoundProof<const DIMENSION: usize> {
    pub dotprod_proof: CVDotProdProof<DIMENSION>,
    pub com_eval: Secq256k1,
}

// This function should be able to verify proofs generated by the above `prove` function
// and also the proofs generated by the original Spartan implementation
#[allow(dead_code)]
pub fn verify<const N_ROUNDS: usize, const DIMENSION: usize>(
    target_com: &Secq256k1,
    proof: &CVSumCheckProof<N_ROUNDS, DIMENSION>,
    gens_1: &MultiCommitGens,
    gens_n: &MultiCommitGens,
    transcript: &mut Transcript,
) -> (Secq256k1, Vec<Fq>) {
    let mut r = vec![];
    for (i, round_dotprod_proof) in proof.proofs.iter().enumerate() {
        let com_poly = &proof.comm_polys[i];
        let com_poly_encoded = CompressedGroup::from_circuit_val(com_poly);
        com_poly_encoded.append_to_transcript(b"comm_poly", transcript);

        let com_eval = &proof.comm_evals[i];

        let r_i = to_fq(&transcript.challenge_scalar(b"challenge_nextround"));
        r.push(r_i);

        // The sum over (0, 1) is expected to be equal to the challenge evaluation of the prev round
        let com_round_sum = if i == 0 {
            target_com
        } else {
            &proof.comm_evals[i - 1]
        };

        let com_round_sum_encoded = CompressedGroup::from_circuit_val(com_round_sum);
        com_round_sum_encoded.append_to_transcript(b"comm_claim_per_round", transcript);

        CompressedGroup::from_circuit_val(&com_eval.clone())
            .append_to_transcript(b"comm_eval", transcript);

        let w_scalar = transcript.challenge_vector(b"combine_two_claims_to_one", 2);

        let w = w_scalar.iter().map(|x| to_fq(x)).collect::<Vec<Fq>>();

        let a = {
            // the vector to use to decommit for sum-check test
            let a_sc = {
                let mut a = vec![Fq::one(); DIMENSION];
                a[0] += Fq::one();
                a
            };

            // the vector to use to decommit for evaluation
            let a_eval = {
                let mut a = vec![Fq::one(); DIMENSION];
                for j in 1..a.len() {
                    a[j] = a[j - 1] * r_i;
                }
                a
            };

            // take weighted sum of the two vectors using w
            assert_eq!(a_sc.len(), a_eval.len());
            (0..a_sc.len())
                .map(|i| w[0] * a_sc[i] + w[1] * a_eval[i])
                .collect::<Vec<Fq>>()
        };

        let tau = com_round_sum * w[0] + com_eval * w[1];

        // Check that the dot product proofs are valid
        dotprod::verify(
            &tau,
            &a,
            &round_dotprod_proof,
            com_poly,
            &gens_1,
            &gens_n,
            transcript,
        );
    }

    (proof.comm_evals[proof.comm_evals.len() - 1], r)
}
