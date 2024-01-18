"use client";

import React from "react";
import cn from "classnames";
import { useSignMessage } from "wagmi";
import { verifyMessage } from "viem";
import { Input } from "@taigalabs/prfs-react-lib/src/input/Input";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { MdSecurity } from "@react-icons/all-files/md/MdSecurity";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { AiOutlineCopy } from "@react-icons/all-files/ai/AiOutlineCopy";
import { decrypt } from "@taigalabs/prfs-crypto-js";
import { atstApi } from "@taigalabs/prfs-api-js";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  CommitmentType,
  makeAttestation,
  newPrfsIdMsg,
  API_PATH,
  parseBuffer,
  makeProofGenSearchParams,
  ProofGenArgs,
  QueryType,
  ProofGenSuccessPayload,
} from "@taigalabs/prfs-id-sdk-web";
import Tooltip from "@taigalabs/prfs-react-lib/src/tooltip/Tooltip";
import ConnectWallet from "@taigalabs/prfs-react-lib/src/connect_wallet/ConnectWallet";
import colors from "@taigalabs/prfs-react-lib/src/colors.module.scss";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { AttestTwitterAccRequest } from "@taigalabs/prfs-entities/bindings/AttestTwitterAccRequest";
import { usePopup, usePrfsEmbed } from "@taigalabs/prfs-id-sdk-react";
import { sendMsgToChild } from "@taigalabs/prfs-id-sdk-web";

import styles from "./CreateCryptoSizeAtst.module.scss";
import { i18nContext } from "@/i18n/context";
import { AttestationsTitle } from "@/components/attestations/Attestations";
import { useRandomKeyPair } from "@/hooks/key";
import { envs } from "@/envs";
import { FetchCryptoAssetRequest } from "@taigalabs/prfs-entities/bindings/FetchCryptoAssetRequest";
import { CryptoAsset } from "@taigalabs/prfs-entities/bindings/CryptoAsset";

const WALLET_ADDR = "wallet_addr";
const SIGNATURE = "signature";
const CLAIM = "twitter_acc_atst";

enum AttestationStep {
  INPUT_WALLET_ADDR = 0,
  GENERATE_CLAIM,
  POST_TWEET,
  VALIDATE_TWEET,
}

enum Status {
  Standby,
  InProgress,
}

const CreateCryptoSizeAttestation: React.FC<CreateCryptoSizeAttestationProps> = () => {
  const i18n = React.useContext(i18nContext);
  const [isSigValid, setIsSigValid] = React.useState(false);
  const [validationMsg, setValidationMsg] = React.useState<React.ReactNode>(null);
  const router = useRouter();
  const [formData, setFormData] = React.useState({ [WALLET_ADDR]: "", [SIGNATURE]: "" });
  const [claimCm, setClaimCm] = React.useState<string | null>(null);
  const claimSecret = React.useMemo(() => {
    const handle = formData[WALLET_ADDR];
    return `PRFS_ATTESTATION_${handle}`;
  }, [formData[WALLET_ADDR]]);
  const [isCopyTooltipVisible, setIsCopyTooltipVisible] = React.useState(false);
  const { signMessageAsync } = useSignMessage();
  const [fetchAssetStatus, setFetchAssetStatus] = React.useState<Status>(Status.Standby);
  const [createStatus, setCreateStatus] = React.useState<Status>(Status.Standby);
  const [fetchAssetMsg, setFetchAssetMsg] = React.useState<React.ReactNode>(null);
  const [createMsg, setCreateMsg] = React.useState<React.ReactNode>(null);
  const [cryptoAsset, setCryptoAsset] = React.useState<CryptoAsset | null>(null);
  const [step, setStep] = React.useState(AttestationStep.INPUT_WALLET_ADDR);
  const { sk, pkHex } = useRandomKeyPair();
  const { mutateAsync: fetchCryptoAssetRequest } = useMutation({
    mutationFn: (req: FetchCryptoAssetRequest) => {
      return atstApi("fetch_crypto_asset", req);
    },
  });
  const { mutateAsync: attestTwitterAccRequest } = useMutation({
    mutationFn: (req: AttestTwitterAccRequest) => {
      return atstApi("attest_twitter_acc", req);
    },
  });
  const { prfsEmbed, isReady: isPrfsReady } = usePrfsEmbed();
  const { openPopup } = usePopup();

  React.useEffect(() => {
    if (cryptoAsset) {
      if (cryptoAsset.amount !== undefined) {
        setStep(AttestationStep.GENERATE_CLAIM);
      }
    } else {
      setStep(AttestationStep.INPUT_WALLET_ADDR);
    }
  }, [setStep, cryptoAsset]);

  // const tweetContent = React.useMemo(() => {
  //   if (claimCm) {
  //     const attType = "atst001";
  //     const destination = "Twitter";
  //     const id = formData[TWITTER_HANDLE];

  //     return makeAttestation({
  //       attType,
  //       destination,
  //       id,
  //       cm: claimCm,
  //     });
  //   } else {
  //     return null;
  //   }
  // }, [formData[TWITTER_HANDLE], claimCm]);

  const handleChangeWalletAddr = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, name } = e.target;

      if (name === WALLET_ADDR) {
        setFormData(oldVal => ({
          ...oldVal,
          [name]: value,
        }));
      }
    },
    [setFormData],
  );

  const handleChangeSignature = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, name } = e.target;

      if (name === SIGNATURE) {
        setFormData(oldVal => ({
          ...oldVal,
          [name]: value,
        }));
      }
    },
    [setFormData],
  );

  const handleClickGenerate = React.useCallback(() => {
    const proofGenArgs: ProofGenArgs = {
      nonce: Math.random() * 1000000,
      app_id: "prfs_proof",
      queries: [
        {
          name: CLAIM,
          preImage: claimSecret,
          type: CommitmentType.SIG_POSEIDON_1,
          queryType: QueryType.COMMITMENT,
        },
      ],
      public_key: pkHex,
    };
    const searchParams = makeProofGenSearchParams(proofGenArgs);
    const endpoint = `${envs.NEXT_PUBLIC_PRFS_ID_WEBAPP_ENDPOINT}${API_PATH.proof_gen}${searchParams}`;

    openPopup(endpoint, async () => {
      if (!prfsEmbed || !isPrfsReady) {
        return;
      }

      const resp = await sendMsgToChild(
        newPrfsIdMsg("REQUEST_SIGN_IN", { appId: proofGenArgs.app_id }),
        prfsEmbed,
      );
      if (resp) {
        try {
          const buf = parseBuffer(resp);
          let decrypted: string;
          try {
            decrypted = decrypt(sk.secret, buf).toString();
          } catch (err) {
            console.error("cannot decrypt payload", err);
            return;
          }

          let payload: ProofGenSuccessPayload;
          try {
            payload = JSON.parse(decrypted);
          } catch (err) {
            console.error("cannot parse payload", err);
            return;
          }

          const cm = payload.receipt[CLAIM];
          if (cm) {
            setClaimCm(cm);
            setStep(AttestationStep.POST_TWEET);
          } else {
            console.error("no commitment delivered");
            return;
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        console.error("Returned val is empty");
      }
    });
  }, [formData, step, claimSecret, sk, pkHex, openPopup, setClaimCm, setStep]);

  const handleClickFetchAsset = React.useCallback(async () => {
    const wallet_addr = formData[WALLET_ADDR];

    if (wallet_addr.length > 0) {
      const req: FetchCryptoAssetRequest = {
        wallet_addr,
      };
      setFetchAssetStatus(Status.InProgress);
      const { payload, error } = await fetchCryptoAssetRequest(req);
      setFetchAssetStatus(Status.Standby);

      if (error) {
        console.error(error);
        setFetchAssetMsg(<span className={styles.error}>{error.toString()}</span>);
      }

      if (payload && payload.crypto_asset) {
        setCryptoAsset(payload.crypto_asset);
        setFetchAssetMsg(
          <span className={styles.success}>
            <FaCheck />
          </span>,
        );
      }
    }
  }, [
    fetchCryptoAssetRequest,
    formData[WALLET_ADDR],
    setCryptoAsset,
    setFetchAssetMsg,
    setFetchAssetStatus,
  ]);

  const handleClickValidate = React.useCallback(async () => {
    const sig = formData[SIGNATURE];
    const wallet_addr = formData[WALLET_ADDR];

    if (sig.length > 0 && wallet_addr.length > 0) {
      const valid = await verifyMessage({
        address: wallet_addr as any,
        message: "hello world",
        signature: sig as any,
      });

      console.log(123, valid);
    }

    // if (error) {
    //   console.error(error);
    //   setValidationMsg(<span className={styles.error}>{error.toString()}</span>);
    // }

    // if (false) {
    //   setIsSigValid(true);
    //   setValidationMsg(
    //     <span className={styles.success}>
    //       <FaCheck />
    //     </span>,
    //   );
    // }
  }, [formData[SIGNATURE], formData[WALLET_ADDR], setIsSigValid, setValidationMsg]);

  const handleClickStartOver = React.useCallback(() => {
    window.location.reload();
  }, [formData, step]);

  const handleClickCopy = React.useCallback(() => {
    if (claimCm) {
      navigator.clipboard.writeText(claimCm);
      setIsCopyTooltipVisible(true);

      setTimeout(() => {
        setIsCopyTooltipVisible(false);
      }, 3000);
    }
  }, [claimCm, setIsCopyTooltipVisible]);

  const handleChangeAddress = React.useCallback(
    (address: string) => {
      setFormData(oldVal => ({
        ...oldVal,
        [WALLET_ADDR]: address,
      }));
    },
    [setFormData],
  );

  const handleClickSign = React.useCallback(async () => {
    if (claimCm) {
      const sig = await signMessageAsync({ message: claimCm });

      if (sig) {
        setFormData(oldVal => ({
          ...oldVal,
          [SIGNATURE]: sig,
        }));
      }
    }
  }, [claimCm, setFormData]);

  const handleClickCreate = React.useCallback(async () => {
    if (cryptoAsset && createStatus === Status.Standby) {
      // For now, we don't obfuscate attestation id
      const acc_atst_id = formData[WALLET_ADDR];
      setCreateMsg(null);

      // if (acc_atst_id) {
      //   setCreateStatus(Status.InProgress);
      //   const { payload, error } = await attestTwitterAccRequest({
      //     acc_atst_id,
      //     cryptoAsset,
      //   });
      //   setCreateStatus(Status.Standby);

      //   if (error) {
      //     setCreateMsg(<span>{error.toString()}</span>);
      //     return;
      //   }

      //   if (payload) {
      //     router.push(paths.attestations__twitter);
      //   }
      // }
    }
  }, [
    formData[WALLET_ADDR],
    step,
    cryptoAsset,
    attestTwitterAccRequest,
    setCreateMsg,
    setCreateStatus,
    router,
  ]);

  return (
    <>
      <AttestationsTitle className={styles.title}>
        {i18n.create_crypto_asset_size_attestation}
      </AttestationsTitle>
      <div>
        <form>
          <ol className={styles.instructions}>
            <li className={styles.item}>
              <div className={styles.no}>1</div>
              <div className={styles.rightCol}>
                <div className={styles.desc}>
                  <p className={styles.descTitle}>{i18n.what_is_your_wallet_address}</p>
                  <p>{i18n.wallet_address_example_given}</p>
                </div>
                <div className={styles.content}>
                  <div className={styles.inputBtnRow}>
                    <ConnectWallet handleChangeAddress={handleChangeAddress}>
                      <button className={styles.inputBtn} type="button">
                        {i18n.connect}
                      </button>
                    </ConnectWallet>
                  </div>
                  <Input
                    className={styles.input}
                    name={WALLET_ADDR}
                    error={""}
                    label={i18n.wallet_address}
                    value={formData.wallet_addr}
                    handleChangeValue={handleChangeWalletAddr}
                  />
                  <div className={styles.btnRow}>
                    <button
                      className={cn(styles.btn)}
                      type="button"
                      onClick={handleClickFetchAsset}
                    >
                      {fetchAssetStatus === Status.InProgress && (
                        <Spinner size={14} color={colors.gray_32} borderWidth={2} />
                      )}
                      <span>{i18n.fetch_asset}</span>
                    </button>
                    <div className={styles.msg}>{fetchAssetMsg}</div>
                  </div>
                  {cryptoAsset && (
                    <div className={styles.cryptoAsset}>
                      <div className={styles.item}>
                        <p className={styles.label}>{i18n.wallet_address}:</p>
                        <p className={styles.value}>{cryptoAsset.wallet_addr}</p>
                      </div>
                      <div className={styles.item}>
                        <p className={styles.label}>{i18n.amount}:</p>
                        <p className={styles.value}>{cryptoAsset.amount.toString()}</p>
                      </div>
                      <div className={styles.item}>
                        <p className={styles.label}>{i18n.unit}:</p>
                        <p className={styles.value}>{cryptoAsset.unit}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </li>
            <li
              className={cn(styles.item, {
                [styles.isDisabled]: step < AttestationStep.GENERATE_CLAIM,
              })}
            >
              <div className={styles.overlay} />
              <div className={styles.no}>2</div>
              <div className={styles.rightCol}>
                <div className={styles.desc}>
                  <p className={styles.descTitle}>{i18n.generate_a_cryptographic_claim}</p>
                  <p className={styles.claimSecret}>
                    {i18n.claim_secret}: {claimSecret}
                  </p>
                </div>
                <div className={cn(styles.content, styles.claimCm)}>
                  <button className={styles.btn} type="button" onClick={handleClickGenerate}>
                    <MdSecurity />
                    <span>{i18n.generate}</span>
                  </button>
                  <p className={styles.value}>{claimCm}</p>
                </div>
              </div>
            </li>
            <li
              className={cn(styles.item, {
                [styles.isDisabled]: step < AttestationStep.POST_TWEET,
              })}
            >
              <div className={styles.overlay} />
              <div className={styles.no}>3</div>
              <div className={styles.rightCol}>
                <div className={styles.desc}>
                  <p className={styles.descTitle}>{i18n.make_signature_with_your_crypto_wallet}</p>
                  {/* <p>{i18n.try_not_to_close_this_window}</p> */}
                </div>
                <div className={styles.content}>
                  {claimCm && (
                    <div className={styles.section}>
                      <div className={styles.box}>
                        <p>{claimCm}</p>
                        <div className={styles.btnArea}>
                          <Tooltip label={i18n.copied} show={isCopyTooltipVisible} placement="top">
                            <button type="button" onClick={handleClickCopy}>
                              <AiOutlineCopy />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                      <div className={styles.signBox}>
                        <div className={styles.inputBtnRow}>
                          <button
                            className={styles.inputBtn}
                            type="button"
                            onClick={handleClickSign}
                          >
                            {i18n.sign}
                          </button>
                        </div>
                        <Input
                          className={cn(styles.input)}
                          name={WALLET_ADDR}
                          error={""}
                          label={i18n.signature}
                          value={formData.signature}
                          handleChangeValue={handleChangeWalletAddr}
                        />
                      </div>
                      <div className={styles.validateBtnRow}>
                        <button
                          className={cn(styles.btn)}
                          type="button"
                          onClick={handleClickValidate}
                        >
                          <span>{i18n.validate}</span>
                        </button>
                        <div className={styles.msg}>{validationMsg}</div>
                      </div>
                    </div>
                  )}
                </div>
                {/* <div className={cn(styles.sectionBtnRow)}> */}
                {/*   <button className={styles.btn} type="button" onClick={handleClickSign}> */}
                {/*     {i18n.connect_wallet} */}
                {/*   </button> */}
                {/*   <p> */}
                {/*     <span>{i18n.or} </span> */}
                {/*     {i18n.manually_create_a_signature_and_paste_it} */}
                {/*   </p> */}
                {/* </div> */}
              </div>
            </li>
            <li
              className={cn(styles.item, {
                [styles.isDisabled]: step < AttestationStep.POST_TWEET,
              })}
            >
              <div className={styles.overlay} />
              <div className={styles.no}>4</div>
              <div className={styles.rightCol}>
                {/* <div className={styles.desc}> */}
                {/*   <p className={styles.descTitle}>{i18n.what_is_the_tweet_url}</p> */}
                {/*   <p>{i18n.tweet_url_example_given}</p> */}
                {/* </div> */}
                {/* <div className={styles.content}> */}
                {/*   <div className={styles.row}> */}
                {/*     <Input */}
                {/*       className={styles.input} */}
                {/*       name={TWEET_URL} */}
                {/*       error={""} */}
                {/*       label={i18n.tweet_url} */}
                {/*       value={formData.tweet_url} */}
                {/*       handleChangeValue={handleChangeTwitterHandle} */}
                {/*     /> */}
                {/*   </div> */}
                {/*   <div className={styles.guideRow}>{i18n.acc_atst_validate_guide}</div> */}
                {/*   <div className={styles.validateBtnRow}> */}
                {/*     <button className={cn(styles.btn)} type="button" onClick={handleClickValidate}> */}
                {/*       {validationStatus === Status.InProgress && ( */}
                {/*         <Spinner size={20} color={colors.gray_32} borderWidth={2} /> */}
                {/*       )} */}
                {/*       <span>{i18n.validate}</span> */}
                {/*     </button> */}
                {/*     <div className={styles.msg}>{validationMsg}</div> */}
                {/*   </div> */}
                {/* </div> */}
              </div>
            </li>
          </ol>
          <div className={cn(styles.btnRow)}>
            <div className={styles.createBtnRow}>
              <Button
                variant="transparent_blue_2"
                noTransition
                handleClick={handleClickStartOver}
                type="button"
              >
                {i18n.start_over}
              </Button>
              <Button
                variant="blue_2"
                noTransition
                className={styles.createBtn}
                handleClick={handleClickCreate}
                noShadow
                type="button"
                disabled={!cryptoAsset || createStatus === Status.InProgress}
              >
                <div className={styles.content}>
                  {createStatus === Status.InProgress && (
                    <Spinner size={20} borderWidth={2} color={colors.white_100} />
                  )}
                  <span>{i18n.create}</span>
                </div>
              </Button>
            </div>
            {createMsg && <div className={cn(styles.createBtnRow, styles.error)}>{createMsg}</div>}
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateCryptoSizeAttestation;

export interface CreateCryptoSizeAttestationProps {}
