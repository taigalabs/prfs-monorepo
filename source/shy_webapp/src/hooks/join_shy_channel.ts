import React from "react";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import Link from "next/link";
import {
  API_PATH,
  ProofGenArgs,
  ProofGenSuccessPayload,
  QueryType,
  createSessionKey,
  makeProofGenSearchParams,
  openPopup,
} from "@taigalabs/prfs-id-sdk-web";
import {
  JSONbigNative,
  createRandomKeyPair,
  decrypt,
  makeRandInt,
  rand256Hex,
} from "@taigalabs/prfs-crypto-js";
import { ShyChannelProofAction } from "@taigalabs/shy-entities/bindings/ShyChannelProofAction";
import { EnterShyChannelToken } from "@taigalabs/shy-entities/bindings/EnterShyChannelToken";
import { MerkleSigPosExactV1PresetVals } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosExactV1PresetVals";
import { usePrfsIdSession } from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/use_prfs_id_session";
import { PrfsIdSession } from "@taigalabs/prfs-entities/bindings/PrfsIdSession";
import { GenericProveReceipt, ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { MerkleSigPosExactV1PublicInputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosExactV1PublicInputs";
import { useRouter } from "next/navigation";

import { paths } from "@/paths";
import { SHY_APP_ID } from "@/app_id";
import { PROOF } from "@/proof_gen_args";
import { envs } from "@/envs";
import { useAppDispatch } from "@/state/hooks";
import { setGlobalMsg } from "@/state/globalMsgReducer";
import { useGetShyProofs } from "@/hooks/proof";
import { useShyCache } from "@/hooks/user";
import { removeCacheItem, setCacheItem } from "@/state/userReducer";
import { makeEnterShyChannelCacheKey } from "@/cache";
import { useJoinShyChannel } from "./channel";

export function useHandleJoinShyChannel({ channel }: UseJoinShychannelArgs) {
  const { shyCache } = useShyCache();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const nonce = 0;
  const { mutateAsync: getShyProofs } = useGetShyProofs();
  const { mutateAsync: joinShyChannel } = useJoinShyChannel();

  const {
    openPrfsIdSession,
    isPrfsDialogOpen,
    setIsPrfsDialogOpen,
    sessionKey,
    setSessionKey,
    sk,
    setSk,
  } = usePrfsIdSession();

  const url = React.useMemo(() => {
    return `${paths.c}/${channel.channel_id}`;
  }, [channel.channel_id]);

  const handleJoinShyChannel = React.useCallback(async () => {
    if (shyCache) {
      const cacheKey = makeEnterShyChannelCacheKey(channel.channel_id);
      const token = shyCache[cacheKey];

      if (token) {
        try {
          const tokenObj: EnterShyChannelToken = JSON.parse(token);
          if (tokenObj) {
            router.push(url);
            return;
          }
        } catch (err) {
          console.warn("Invalid cache item, key: %s, err: %s", cacheKey, err);
          dispatch(removeCacheItem(cacheKey));
        }
      }
    }

    const session_key = createSessionKey();
    const { sk, pkHex } = createRandomKeyPair();
    const json = JSON.stringify({
      appId: SHY_APP_ID,
      channel_id: channel.channel_id,
      nonce,
    });

    const proofAction: ShyChannelProofAction = {
      type: "enter_shy_channel",
      channel_id: channel.channel_id,
      nonce,
    };

    const proofActionStr = JSON.stringify(proofAction);
    const presetVals: MerkleSigPosExactV1PresetVals = {
      nonceRaw: json,
    };
    const proofGenArgs: ProofGenArgs = {
      nonce: makeRandInt(1000000),
      app_id: SHY_APP_ID,
      queries: [
        {
          name: PROOF,
          proofTypeId: "nonce_seoul_v1",
          queryType: QueryType.CREATE_PROOF,
          presetVals,
          usePrfsRegistry: true,
          proofAction: proofActionStr,
        },
      ],
      public_key: pkHex,
      session_key,
    };

    const searchParams = makeProofGenSearchParams(proofGenArgs);
    const endpoint = `${envs.NEXT_PUBLIC_PRFS_ID_WEBAPP_ENDPOINT}${API_PATH.proof_gen}${searchParams}`;

    const popup = openPopup(endpoint);
    if (!popup) {
      return;
    }

    const { payload: _ } = await openPrfsIdSession({
      key: proofGenArgs.session_key,
      value: null,
      ticket: "TICKET",
    });

    setIsPrfsDialogOpen(true);
    setSessionKey(proofGenArgs.session_key);
    setSk(sk);
  }, [channel, router, url, setSk, shyCache]);

  const handleSucceedGetSession = React.useCallback(
    async (session: PrfsIdSession) => {
      if (!sk) {
        dispatch(
          setGlobalMsg({
            variant: "error",
            message: "Secret key is not set to decrypt Prfs ID session",
          }),
        );
        return;
      }

      const buf = Buffer.from(session.value);
      let decrypted: string;
      try {
        decrypted = decrypt(sk.secret, buf).toString();
      } catch (err) {
        dispatch(
          setGlobalMsg({
            variant: "error",
            message: `Cannot decrypt payload, err: ${err}`,
          }),
        );
        return;
      }

      let payload: ProofGenSuccessPayload;
      try {
        payload = JSON.parse(decrypted) as ProofGenSuccessPayload;
      } catch (err) {
        dispatch(
          setGlobalMsg({
            variant: "error",
            message: `Cannot parse proof payload, err: ${err}`,
          }),
        );
        return;
      }

      const receipt = payload.receipt[PROOF] as GenericProveReceipt;
      if (receipt.type === "cached_prove_receipt") {
        const { payload: getShyProofsPayload } = await getShyProofs({
          public_key: receipt.proofPubKey,
        });

        const shyProofs = getShyProofsPayload?.shy_proofs;
        if (shyProofs) {
          const firstProof = shyProofs.find(p => p.proof_idx === 0);
          if (!firstProof) {
            dispatch(
              setGlobalMsg({
                variant: "error",
                message: `Cannot find the first payload, shyProofs: ${shyProofs}`,
              }),
            );
            return;
          }

          const enterShyChannelToken: EnterShyChannelToken = {
            shy_proof_id: firstProof.shy_proof_id,
            sig: receipt.proofActionSig,
            sig_msg: Array.from(receipt.proofActionSigMsg),
          };

          dispatch(
            setCacheItem({
              key: makeEnterShyChannelCacheKey(channel.channel_id),
              val: JSON.stringify(enterShyChannelToken),
              ts: Date.now(),
            }),
          );
          router.push(url);
        } else {
          dispatch(
            setGlobalMsg({
              variant: "error",
              message: "Proof is not found and it's supposed to be found. Reach out to us",
            }),
          );
        }
      } else if (receipt.type === "prove_receipt") {
        const shy_proof_id = rand256Hex();
        const receipt_ = receipt as ProveReceipt;
        console.log("receipt", receipt_);

        const publicInputs: MerkleSigPosExactV1PublicInputs = JSONbigNative.parse(
          receipt_.proof.publicInputSer,
        );

        const { error } = await joinShyChannel({
          nonce,
          channel_id: channel.channel_id,
          shy_proof_id,
          author_public_key: receipt_.proof.proofPubKey,
          author_sig: receipt_.proofActionSig,
          author_sig_msg: Array.from(receipt_.proofActionSigMsg),
          proof_identity_input: publicInputs.proofIdentityInput,
          proof: Array.from(receipt.proof.proofBytes),
          public_inputs: receipt_.proof.publicInputSer,
          serial_no: publicInputs.circuitPubInput.serialNo.toString(),
          proof_type_id: "merkle_sig_pos_exact_v1",
          proof_idx: 0,
        });

        if (error) {
          console.error(error);
          dispatch(
            setGlobalMsg({
              variant: "error",
              message: `Error joining shy channel, err: ${error}`,
            }),
          );
          return;
        }

        const enterShyChannelToken: EnterShyChannelToken = {
          shy_proof_id,
          sig: receipt.proofActionSig,
          sig_msg: Array.from(receipt.proofActionSigMsg),
        };

        dispatch(
          setCacheItem({
            key: makeEnterShyChannelCacheKey(channel.channel_id),
            val: JSON.stringify(enterShyChannelToken),
            ts: Date.now(),
          }),
        );
        router.push(url);
      } else {
        dispatch(
          setGlobalMsg({
            variant: "error",
            message: `Unknown receipt type, receipt: ${(receipt as any).type}`,
          }),
        );
        return;
      }
    },
    [sk, dispatch, getShyProofs, joinShyChannel, router, url],
  );

  return {
    handleJoinShyChannel,
    handleSucceedGetSession,
    sessionKey,
    isPrfsDialogOpen,
    setIsPrfsDialogOpen,
  };
}

export interface UseJoinShychannelArgs {
  channel: ShyChannel;
}
