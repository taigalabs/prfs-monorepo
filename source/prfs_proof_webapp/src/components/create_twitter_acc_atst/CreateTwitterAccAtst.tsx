"use client";

import React from "react";
import cn from "classnames";
import { Input } from "@taigalabs/prfs-react-components/src/input/Input";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { MdSecurity } from "@react-icons/all-files/md/MdSecurity";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { AiOutlineCopy } from "@react-icons/all-files/ai/AiOutlineCopy";
import { decrypt } from "eciesjs";
import { atstApi } from "@taigalabs/prfs-api-js";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  CommitmentType,
  PrfsIdCommitmentSuccessPayload,
  PrfsIdMsg,
  getCommitment,
  makeAttestation,
  newPrfsIdMsg,
} from "@taigalabs/prfs-id-sdk-web";
import Tooltip from "@taigalabs/prfs-react-components/src/tooltip/Tooltip";
import colors from "@taigalabs/prfs-react-components/src/colors.module.scss";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { AttestTwitterAccRequest } from "@taigalabs/prfs-entities/bindings/AttestTwitterAccRequest";
import { ValidateTwitterAccRequest } from "@taigalabs/prfs-entities/bindings/ValidateTwitterAccRequest";
import { TwitterAccValidation } from "@taigalabs/prfs-entities/bindings/TwitterAccValidation";

import styles from "./CreateTwitterAccAtst.module.scss";
import { i18nContext } from "@/i18n/context";
import { AttestationsTitle } from "@/components/attestations/Attestations";
import { useRandomKeyPair } from "@/hooks/key";
import { envs } from "@/envs";
import { paths } from "@/paths";

const TWITTER_HANDLE = "twitter_handle";
const TWEET_URL = "tweet_url";
const CLAIM = "claim";

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

const CreateTwitterAccAttestation: React.FC<CreateTwitterAccAttestationProps> = () => {
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

  const handleSucceedGenerateCms = React.useCallback(
    (encrypted: Buffer) => {
      let decrypted: string;
      try {
        decrypted = decrypt(sk.secret, encrypted).toString();
      } catch (err) {
        console.error("cannot decrypt payload", err);
        return;
      }

      let payload: PrfsIdCommitmentSuccessPayload;
      try {
        payload = JSON.parse(decrypted) as PrfsIdCommitmentSuccessPayload;
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
    },
    [setStep, setClaimCm],
  );

  React.useEffect(() => {
    const handle = formData[TWITTER_HANDLE];
    if (handle.length > 0) {
      if (step < AttestationStep.GENERATE_CLAIM) {
        setStep(AttestationStep.GENERATE_CLAIM);
      }
    } else {
      setStep(AttestationStep.INPUT_TWITTER_HANDLE);
    }

    const listener = (ev: MessageEvent<any>) => {
      const { origin } = ev;

      if (envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT.startsWith(origin)) {
        const data = ev.data as PrfsIdMsg<Buffer>;
        if (data.type === "COMMITMENT_SUCCESS") {
          const msg = newPrfsIdMsg("COMMITMENT_SUCCESS_RESPOND", null);
          ev.ports[0].postMessage(msg);
          handleSucceedGenerateCms(data.payload);
        }
      }
    };
    addEventListener("message", listener, false);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, [setStep, formData[TWITTER_HANDLE], handleSucceedGenerateCms]);

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
    const appId = "prfs_proof";
    getCommitment({
      prfsIdEndpoint: `${envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}${paths.id}`,
      appId,
      sk,
      pkHex,
      preImage: claimSecret,
      cms: {
        [CLAIM]: {
          val: claimSecret,
          type: CommitmentType.SIG_POSEIDON_1,
        },
      },
    });
  }, [formData, step, claimSecret, sk, pkHex]);

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
        {i18n.create_twitter_acc_attestation}
      </AttestationsTitle>
      <div>
        <form>
          <ol className={styles.instructions}>
            <li className={styles.item}>
              <div className={styles.no}>1</div>
              <div className={styles.right}>
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
                className={styles.signInBtn}
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

export default CreateTwitterAccAttestation;

export interface CreateTwitterAccAttestationProps {}