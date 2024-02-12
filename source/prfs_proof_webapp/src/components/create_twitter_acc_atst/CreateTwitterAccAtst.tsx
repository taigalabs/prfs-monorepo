"use client";

import React from "react";
import cn from "classnames";
import { Input } from "@taigalabs/prfs-react-lib/src/input/Input";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { MdSecurity } from "@react-icons/all-files/md/MdSecurity";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { AiOutlineCopy } from "@react-icons/all-files/ai/AiOutlineCopy";
import { decrypt, makeRandInt } from "@taigalabs/prfs-crypto-js";
import { atstApi } from "@taigalabs/prfs-api-js";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  CommitmentType,
  makeAccAttestation,
  API_PATH,
  makeProofGenSearchParams,
  ProofGenArgs,
  QueryType,
  ProofGenSuccessPayload,
  createSession,
  parseBufferOfArray,
  createSessionKey,
  openPopup,
} from "@taigalabs/prfs-id-sdk-web";
import Tooltip from "@taigalabs/prfs-react-lib/src/tooltip/Tooltip";
import colors from "@taigalabs/prfs-react-lib/src/colors.module.scss";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { AttestTwitterAccRequest } from "@taigalabs/prfs-entities/bindings/AttestTwitterAccRequest";
import { ValidateTwitterAccRequest } from "@taigalabs/prfs-entities/bindings/ValidateTwitterAccRequest";
import { TwitterAccValidation } from "@taigalabs/prfs-entities/bindings/TwitterAccValidation";
// import { usePopup } from "@taigalabs/prfs-id-sdk-react";

import styles from "./CreateTwitterAccAtst.module.scss";
import common from "@/styles/common.module.scss";
import { i18nContext } from "@/i18n/context";
import { useRandomKeyPair } from "@/hooks/key";
import { envs } from "@/envs";
import { paths } from "@/paths";
import {
  AttestationListItem,
  AttestationListItemDesc,
  AttestationListItemNo,
  AttestationListRightCol,
  AttestationListItemBtn,
  AttestationContentBox,
  AttestationContentBoxBtnArea,
  AttestationListItemOverlay,
  AttestationListItemDescTitle,
  AttestationFormBtnRow,
} from "@/components/create_attestation/CreateAtstComponents";
import {
  AttestationsHeader,
  AttestationsHeaderRow,
  AttestationsTitle,
} from "@/components/attestations/AttestationComponents";

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
  Error,
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
  const [validation, setValidation] = React.useState<TwitterAccValidation | null>(null);
  const [validationStatus, setValidationStatus] = React.useState<Status>(Status.Standby);
  const [validationMsg, setValidationMsg] = React.useState<React.ReactNode>(null);
  const [createStatus, setCreateStatus] = React.useState<Status>(Status.Standby);
  const [createMsg, setCreateMsg] = React.useState<React.ReactNode>(null);
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
  // const { openPopup } = usePopup();

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

      return makeAccAttestation({
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
          setClaimCm(null);
          setFormData(oldVal => ({
            ...oldVal,
            [name]: value,
            [TWEET_URL]: "",
          }));

          if (step > AttestationStep.GENERATE_CLAIM) {
            setStep(AttestationStep.INPUT_TWITTER_HANDLE);
          }
        }
      }
    },
    [setFormData, setClaimCm, setStep, step],
  );

  const handleChangeTweetUrl = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, name } = e.target;

      if (name === TWEET_URL) {
        setValidation(null);
        setFormData(oldVal => ({
          ...oldVal,
          [name]: value,
        }));
      }
    },
    [setFormData, setValidation],
  );

  const handleClickGenerate = React.useCallback(async () => {
    const session_key = createSessionKey();
    const proofGenArgs: ProofGenArgs = {
      nonce: makeRandInt(1000000),
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
      session_key,
    };
    const searchParams = makeProofGenSearchParams(proofGenArgs);
    const endpoint = `${envs.NEXT_PUBLIC_PRFS_ID_WEBAPP_ENDPOINT}${API_PATH.proof_gen}${searchParams}`;

    const popup = openPopup(endpoint);
    if (!popup) {
      return;
    }

    let sessionStream;
    try {
      sessionStream = await createSession({
        key: proofGenArgs.session_key,
        value: null,
        ticket: "TICKET",
      });
    } catch (err) {
      console.error(err);
      return;
    }

    const { ws, send, receive } = sessionStream;
    const session = await receive();
    if (!session) {
      console.error("Coultn' retreieve session");
      return;
    }

    try {
      if (session.error) {
        console.error(session.error);
        return;
      }

      if (!session.payload) {
        console.error("Session doesn't have a payload");
        return;
      }

      if (session.payload.type !== "put_prfs_id_session_value_result") {
        console.error("Wrong session payload type at this point, msg: %s", session.payload);
        return;
      }

      if (session.payload.value.length === 0) {
        console.error("Commitment is empty, session_key: %s", session_key);
        return;
      }

      const buf = parseBufferOfArray(session.payload.value);
      let decrypted = decrypt(sk.secret, buf).toString();

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
      return;
    }
  }, [formData, step, claimSecret, sk, pkHex, setClaimCm, setStep]);

  const handleClickValidate = React.useCallback(async () => {
    setValidation(null);

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
      <AttestationsHeader>
        <AttestationsHeaderRow>
          <AttestationsTitle className={styles.title}>
            {i18n.create_twitter_acc_attestation}
          </AttestationsTitle>
        </AttestationsHeaderRow>
      </AttestationsHeader>
      <div>
        <form>
          <ol>
            <AttestationListItem>
              <AttestationListItemNo>1</AttestationListItemNo>
              <AttestationListRightCol>
                <AttestationListItemDesc>
                  <AttestationListItemDescTitle>
                    {i18n.what_is_your_twitter_handle}
                  </AttestationListItemDescTitle>
                  <p>{i18n.twitter_handle_example_given}</p>
                </AttestationListItemDesc>
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
              </AttestationListRightCol>
            </AttestationListItem>
            <AttestationListItem isDisabled={step < AttestationStep.GENERATE_CLAIM}>
              <AttestationListItemOverlay />
              <AttestationListItemNo>2</AttestationListItemNo>
              <AttestationListRightCol>
                <AttestationListItemDesc>
                  <AttestationListItemDescTitle>
                    {i18n.generate_a_cryptographic_claim}
                  </AttestationListItemDescTitle>
                  <p className={styles.claimSecret}>
                    {i18n.claim_secret}: {claimSecret}
                  </p>
                </AttestationListItemDesc>
                <div className={cn(styles.content, styles.claimCm)}>
                  <AttestationListItemBtn type="button" handleClick={handleClickGenerate}>
                    <MdSecurity />
                    <span>{i18n.generate}</span>
                  </AttestationListItemBtn>
                  <p className={styles.value}>{claimCm}</p>
                </div>
              </AttestationListRightCol>
            </AttestationListItem>
            <AttestationListItem isDisabled={step < AttestationStep.POST_TWEET}>
              <AttestationListItemOverlay />
              <AttestationListItemNo>3</AttestationListItemNo>
              <AttestationListRightCol>
                <AttestationListItemDesc>
                  <AttestationListItemDescTitle>
                    {i18n.post_tweet_with_content}
                  </AttestationListItemDescTitle>
                  <p>{i18n.try_not_to_close_this_window}</p>
                </AttestationListItemDesc>
                <div className={styles.content}>
                  {tweetContent && (
                    <div className={styles.tweetContent}>
                      <AttestationContentBox>
                        <p className={common.alignItemCenter}>{tweetContent}</p>
                        <AttestationContentBoxBtnArea>
                          <Tooltip label={i18n.copied} show={isCopyTooltipVisible} placement="top">
                            <button type="button" onClick={handleClickCopy}>
                              <AiOutlineCopy />
                            </button>
                          </Tooltip>
                        </AttestationContentBoxBtnArea>
                      </AttestationContentBox>
                    </div>
                  )}
                </div>
                <div className={cn(styles.tweetContentBtnRow)}>
                  <AttestationListItemBtn type="button" handleClick={handleClickPostTweet}>
                    {i18n.post}
                  </AttestationListItemBtn>
                  <p>
                    <span>{i18n.or} </span>
                    <a target="_blank" href="https://twitter.com">
                      {i18n.manually_tweet_at_twitter}
                    </a>
                  </p>
                </div>
              </AttestationListRightCol>
            </AttestationListItem>
            <AttestationListItem isDisabled={step < AttestationStep.POST_TWEET}>
              <AttestationListItemOverlay />
              <AttestationListItemNo>4</AttestationListItemNo>
              <AttestationListRightCol>
                <AttestationListItemDesc>
                  <AttestationListItemDescTitle>
                    {i18n.what_is_the_tweet_url}
                  </AttestationListItemDescTitle>
                  <p>{i18n.tweet_url_example_given}</p>
                </AttestationListItemDesc>
                <div className={styles.content}>
                  <div className={styles.row}>
                    <Input
                      className={styles.input}
                      name={TWEET_URL}
                      error={""}
                      label={i18n.tweet_url}
                      value={formData.tweet_url}
                      handleChangeValue={handleChangeTweetUrl}
                    />
                  </div>
                  <div className={styles.guideRow}>{i18n.acc_atst_validate_guide}</div>
                  <div className={styles.validateBtnRow}>
                    <AttestationListItemBtn
                      className={styles.validateBtn}
                      type="button"
                      handleClick={handleClickValidate}
                    >
                      <span>{i18n.validate}</span>
                      {validationStatus === Status.InProgress && (
                        <Spinner size={14} color={colors.gray_32} borderWidth={2} />
                      )}
                    </AttestationListItemBtn>
                    <div className={styles.msg}>{validationMsg}</div>
                  </div>
                </div>
              </AttestationListRightCol>
            </AttestationListItem>
          </ol>
          <AttestationFormBtnRow>
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
                  <span>{i18n.create}</span>
                  {createStatus === Status.InProgress && (
                    <Spinner size={14} borderWidth={2} color={colors.white_100} />
                  )}
                </div>
              </Button>
            </div>
            {createMsg && <div className={cn(styles.createBtnRow, styles.error)}>{createMsg}</div>}
          </AttestationFormBtnRow>
        </form>
      </div>
    </>
  );
};

export default CreateTwitterAccAttestation;

export interface CreateTwitterAccAttestationProps {}
