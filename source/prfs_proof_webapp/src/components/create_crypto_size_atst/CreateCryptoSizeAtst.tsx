"use client";

import React from "react";
import cn from "classnames";
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
import colors from "@taigalabs/prfs-react-lib/src/colors.module.scss";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { AttestTwitterAccRequest } from "@taigalabs/prfs-entities/bindings/AttestTwitterAccRequest";
import { ValidateTwitterAccRequest } from "@taigalabs/prfs-entities/bindings/ValidateTwitterAccRequest";
import { TwitterAccValidation } from "@taigalabs/prfs-entities/bindings/TwitterAccValidation";
import { usePopup, usePrfsEmbed } from "@taigalabs/prfs-id-sdk-react";
import { sendMsgToChild } from "@taigalabs/prfs-id-sdk-web";

import styles from "./CreateCryptoSizeAtst.module.scss";
import { i18nContext } from "@/i18n/context";
import { AttestationsTitle } from "@/components/attestations/Attestations";
import { useRandomKeyPair } from "@/hooks/key";
import { envs } from "@/envs";
import { paths } from "@/paths";

const TWITTER_HANDLE = "twitter_handle";
const TWEET_URL = "tweet_url";
const CLAIM = "twitter_acc_atst";

enum AttestationStep {
  INPUT_TWITTER_HANDLE = 0,
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
  const router = useRouter();
  const [formData, setFormData] = React.useState({ [TWITTER_HANDLE]: "", [TWEET_URL]: "" });
  const [claimCm, setClaimCm] = React.useState<string | null>(null);
  const claimSecret = React.useMemo(() => {
    const handle = formData[TWITTER_HANDLE];
    return `PRFS_ATTESTATION_${handle}`;
  }, [formData[TWITTER_HANDLE]]);
  const [isCopyTooltipVisible, setIsCopyTooltipVisible] = React.useState(false);
  const [validationStatus, setValidationStatus] = React.useState<Status>(Status.Standby);
  const [createStatus, setCreateStatus] = React.useState<Status>(Status.Standby);
  const [validationMsg, setValidationMsg] = React.useState<React.ReactNode>(null);
  const [createMsg, setCreateMsg] = React.useState<React.ReactNode>(null);
  const [validation, setValidation] = React.useState<TwitterAccValidation | null>(null);
  const [step, setStep] = React.useState(AttestationStep.INPUT_TWITTER_HANDLE);
  const { sk, pkHex } = useRandomKeyPair();
  const { mutateAsync: validateTwitterAccRequest } = useMutation({
    mutationFn: (req: ValidateTwitterAccRequest) => {
      return atstApi("validate_twitter_acc", req);
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
    const handle = formData[TWITTER_HANDLE];
    if (handle.length > 0) {
      if (step < AttestationStep.GENERATE_CLAIM) {
        setStep(AttestationStep.GENERATE_CLAIM);
      }
    } else {
      setStep(AttestationStep.INPUT_TWITTER_HANDLE);
    }
  }, [setStep, formData[TWITTER_HANDLE]]);

  const tweetContent = React.useMemo(() => {
    if (claimCm) {
      const attType = "atst001";
      const destination = "Twitter";
      const id = formData[TWITTER_HANDLE];

      return makeAttestation({
        attType,
        destination,
        id,
        cm: claimCm,
      });
    } else {
      return null;
    }
  }, [formData[TWITTER_HANDLE], claimCm]);

  const handleChangeTwitterHandle = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, name } = e.target;

      if (name === TWITTER_HANDLE) {
        if (value.length < 30) {
          setFormData(oldVal => ({
            ...oldVal,
            [name]: value,
          }));
        }
      } else {
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

  const handleClickValidate = React.useCallback(async () => {
    const tweet_url = formData[TWEET_URL];
    const twitter_handle = formData[TWITTER_HANDLE];

    const req: ValidateTwitterAccRequest = {
      tweet_url,
      twitter_handle,
    };

    setValidationStatus(Status.InProgress);
    const { payload, error } = await validateTwitterAccRequest(req);
    setValidationStatus(Status.Standby);

    if (error) {
      console.error(error);
      setValidationMsg(<span className={styles.error}>{error.toString()}</span>);
    }

    if (payload) {
      setValidation(payload.validation);
      setValidationMsg(
        <span className={styles.success}>
          <FaCheck />
        </span>,
      );
    }
  }, [
    validateTwitterAccRequest,
    formData[TWEET_URL],
    formData[TWITTER_HANDLE],
    setValidation,
    setValidationMsg,
    setValidationStatus,
  ]);

  const handleClickStartOver = React.useCallback(() => {
    window.location.reload();
  }, [formData, step]);

  const handleClickCopy = React.useCallback(() => {
    if (tweetContent) {
      navigator.clipboard.writeText(tweetContent);
      setIsCopyTooltipVisible(true);

      setTimeout(() => {
        setIsCopyTooltipVisible(false);
      }, 3000);
    }
  }, [tweetContent, setIsCopyTooltipVisible]);

  const handleClickPostTweet = React.useCallback(() => {
    if (tweetContent) {
      const params = encodeURIComponent(tweetContent);
      const url = `https://twitter.com/intent/tweet?text=${params}`;
      window.open(url, "_blank");
    } else {
      console.error("no tweet content");
    }
  }, [tweetContent]);

  const handleClickCreate = React.useCallback(async () => {
    if (validation && createStatus === Status.Standby) {
      // For now, we don't obfuscate attestation id
      const acc_atst_id = formData[TWITTER_HANDLE];
      setCreateMsg(null);

      if (acc_atst_id) {
        setCreateStatus(Status.InProgress);
        const { payload, error } = await attestTwitterAccRequest({
          acc_atst_id,
          validation,
        });
        setCreateStatus(Status.Standby);

        if (error) {
          setCreateMsg(<span>{error.toString()}</span>);
          return;
        }

        if (payload) {
          router.push(paths.attestations__twitter);
        }
      }
    }
  }, [
    formData[TWITTER_HANDLE],
    step,
    validation,
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
                  <p className={styles.descTitle}>{i18n.what_is_your_twitter_handle}</p>
                  <p>{i18n.twitter_handle_example_given}</p>
                </div>
                <div className={styles.content}>
                  <Input
                    className={styles.input}
                    name={TWITTER_HANDLE}
                    error={""}
                    label={i18n.twitter_handle}
                    value={formData.twitter_handle}
                    handleChangeValue={handleChangeTwitterHandle}
                  />
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
                  <p className={styles.descTitle}>{i18n.post_tweet_with_content}</p>
                  <p>{i18n.try_not_to_close_this_window}</p>
                </div>
                <div className={styles.content}>
                  {tweetContent && (
                    <div className={styles.tweetContent}>
                      <div className={styles.box}>
                        <p>{tweetContent}</p>
                        <div className={styles.btnArea}>
                          <Tooltip label={i18n.copied} show={isCopyTooltipVisible} placement="top">
                            <button type="button" onClick={handleClickCopy}>
                              <AiOutlineCopy />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className={cn(styles.tweetContentBtnRow)}>
                  <button className={styles.btn} type="button" onClick={handleClickPostTweet}>
                    {i18n.post}
                  </button>
                  <p>
                    <span>{i18n.or} </span>
                    <a target="_blank" href="https://twitter.com">
                      {i18n.manually_tweet_at_twitter}
                    </a>
                  </p>
                </div>
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
                <div className={styles.desc}>
                  <p className={styles.descTitle}>{i18n.what_is_the_tweet_url}</p>
                  <p>{i18n.tweet_url_example_given}</p>
                </div>
                <div className={styles.content}>
                  <div className={styles.row}>
                    <Input
                      className={styles.input}
                      name={TWEET_URL}
                      error={""}
                      label={i18n.tweet_url}
                      value={formData.tweet_url}
                      handleChangeValue={handleChangeTwitterHandle}
                    />
                  </div>
                  <div className={styles.guideRow}>{i18n.acc_atst_validate_guide}</div>
                  <div className={styles.validateBtnRow}>
                    <button className={cn(styles.btn)} type="button" onClick={handleClickValidate}>
                      {validationStatus === Status.InProgress && (
                        <Spinner size={20} color={colors.gray_32} borderWidth={2} />
                      )}
                      <span>{i18n.validate}</span>
                    </button>
                    <div className={styles.msg}>{validationMsg}</div>
                  </div>
                </div>
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
                disabled={!validation || createStatus === Status.InProgress}
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
