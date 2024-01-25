"use client";

import React from "react";
import cn from "classnames";
import { verifyMessage } from "@taigalabs/prfs-web3-js/viem";
import { Input } from "@taigalabs/prfs-react-lib/src/input/Input";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { MdSecurity } from "@react-icons/all-files/md/MdSecurity";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { IoClose } from "@react-icons/all-files/io5/IoClose";
import { AiOutlineCopy } from "@react-icons/all-files/ai/AiOutlineCopy";
import { decrypt } from "@taigalabs/prfs-crypto-js";
import { atstApi } from "@taigalabs/prfs-api-js";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  CommitmentType,
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
import { usePopup, usePrfsEmbed } from "@taigalabs/prfs-id-sdk-react";
import { sendMsgToChild } from "@taigalabs/prfs-id-sdk-web";
import { useSignMessage } from "@taigalabs/prfs-web3-js/wagmi";
import { FetchCryptoAssetRequest } from "@taigalabs/prfs-entities/bindings/FetchCryptoAssetRequest";
import { CryptoAsset } from "@taigalabs/prfs-entities/bindings/CryptoAsset";
import { CreateCryptoAssetSizeAtstRequest } from "@taigalabs/prfs-entities/bindings/CreateCryptoAssetSizeAtstRequest";

import styles from "./CreateCryptoAssetSizeAtst.module.scss";
import common from "@/styles/common.module.scss";
import { i18nContext } from "@/i18n/context";
import { AttestationsTitle } from "@/components/attestations/AttestationComponents";
import { useRandomKeyPair } from "@/hooks/key";
import { envs } from "@/envs";
import {
  AttestationContentBox,
  AttestationContentBoxBtnArea,
  AttestationFormBtnRow,
  AttestationListItem,
  AttestationListItemBtn,
  AttestationListItemDesc,
  AttestationListItemDescTitle,
  AttestationListItemNo,
  AttestationListItemOverlay,
  AttestationListRightCol,
} from "@/components/create_attestation/CreateAtstComponents";
import { paths } from "@/paths";

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
  const [isNavigating, setIsNavigating] = React.useState(false);
  const [isSigValid, setIsSigValid] = React.useState(false);
  const [validationMsg, setValidationMsg] = React.useState<React.ReactNode>(null);
  const router = useRouter();
  const [formData, setFormData] = React.useState({ [WALLET_ADDR]: "", [SIGNATURE]: "" });
  const [claimCm, setClaimCm] = React.useState<string | null>(null);
  const claimSecret = React.useMemo(() => {
    const handle = formData[WALLET_ADDR];
    return `PRFS_ATST_${handle}`;
  }, [formData[WALLET_ADDR]]);
  const [isCopyTooltipVisible, setIsCopyTooltipVisible] = React.useState(false);
  const { signMessageAsync } = useSignMessage();
  const [fetchAssetStatus, setFetchAssetStatus] = React.useState<Status>(Status.Standby);
  const [createStatus, setCreateStatus] = React.useState<Status>(Status.Standby);
  const [fetchAssetMsg, setFetchAssetMsg] = React.useState<React.ReactNode>(null);
  const [createMsg, setCreateMsg] = React.useState<React.ReactNode>(null);
  const [cryptoAssets, setCryptoAssets] = React.useState<CryptoAsset[] | null>(null);
  const [step, setStep] = React.useState(AttestationStep.INPUT_WALLET_ADDR);
  const { sk, pkHex } = useRandomKeyPair();
  const { mutateAsync: fetchCryptoAssetRequest } = useMutation({
    mutationFn: (req: FetchCryptoAssetRequest) => {
      return atstApi("fetch_crypto_asset", req);
    },
  });
  const { mutateAsync: createCryptoSizeAtstRequest } = useMutation({
    mutationFn: (req: CreateCryptoAssetSizeAtstRequest) => {
      return atstApi("create_crypto_asset_size_atst", req);
    },
  });
  const { prfsEmbed, isReady: isPrfsReady } = usePrfsEmbed();
  const { openPopup } = usePopup();

  React.useEffect(() => {
    if (cryptoAssets && cryptoAssets.length > 0) {
      if (cryptoAssets[0].amount !== undefined) {
        setStep(AttestationStep.GENERATE_CLAIM);
      }
    } else {
      setStep(AttestationStep.INPUT_WALLET_ADDR);
    }
  }, [setStep, cryptoAssets]);

  const handleChangeWalletAddr = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, name } = e.target;

      if (name === WALLET_ADDR) {
        setFormData(oldVal => ({
          ...oldVal,
          [name]: value,
        }));
      }

      if (cryptoAssets) {
        setCryptoAssets(null);
        setFetchAssetMsg(null);
      }
    },
    [setFormData, setCryptoAssets, cryptoAssets, setFetchAssetMsg],
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
        newPrfsIdMsg("REQUEST_PROOF_GEN", { appId: proofGenArgs.app_id }),
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
      if (!wallet_addr.startsWith("0x")) {
        setFetchAssetMsg(
          <span className={styles.error}>{i18n.wallet_address_should_start_with_0x}</span>,
        );
        return;
      }

      const req: FetchCryptoAssetRequest = {
        wallet_addr,
      };
      setFetchAssetStatus(Status.InProgress);
      const { payload, error } = await fetchCryptoAssetRequest(req);
      setFetchAssetStatus(Status.Standby);

      if (error) {
        console.error(error);
        setFetchAssetMsg(<span className={styles.error}>{error.toString()}</span>);
        return;
      }

      if (payload && payload.crypto_assets) {
        setCryptoAssets(payload.crypto_assets);
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
    setCryptoAssets,
    setFetchAssetMsg,
    setFetchAssetStatus,
  ]);

  const handleClickValidate = React.useCallback(async () => {
    const sig = formData[SIGNATURE];
    const wallet_addr = formData[WALLET_ADDR];

    if (claimCm && sig.length > 0 && wallet_addr.length > 0) {
      const valid = await verifyMessage({
        address: wallet_addr as any,
        message: claimCm,
        signature: sig as any,
      });

      if (valid) {
        setValidationMsg(
          <span className={styles.success}>
            <FaCheck />
          </span>,
        );
        setIsSigValid(true);
      } else {
        setValidationMsg(
          <span className={styles.error}>
            <IoClose />
          </span>,
        );
      }
    }
  }, [formData[SIGNATURE], formData[WALLET_ADDR], setIsSigValid, setValidationMsg, claimCm]);

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
    if (cryptoAssets && cryptoAssets.length > 0 && claimCm && createStatus === Status.Standby) {
      // For now, we don't obfuscate attestation id
      const atst_id = `ETH_${formData[WALLET_ADDR]}`;
      setCreateMsg(null);

      if (atst_id) {
        setCreateStatus(Status.InProgress);

        const { payload, error } = await createCryptoSizeAtstRequest({
          atst_id,
          atst_type: "crypto_size_1",
          wallet_addr: formData[WALLET_ADDR],
          cm: claimCm,
          crypto_assets: cryptoAssets,
        });
        setCreateStatus(Status.Standby);

        if (error) {
          setCreateMsg(<span>{error.toString()}</span>);
        }

        if (payload) {
          setIsNavigating(true);
          router.push(paths.attestations__crypto_asset_size);
        }
      }
    }
  }, [
    formData[WALLET_ADDR],
    step,
    cryptoAssets,
    setIsNavigating,
    claimCm,
    createCryptoSizeAtstRequest,
    setCreateMsg,
    setCreateStatus,
    router,
  ]);

  return isNavigating ? (
    <div>Navigating...</div>
  ) : (
    <>
      <AttestationsTitle>{i18n.create_crypto_asset_size_attestation}</AttestationsTitle>
      <div>
        <form>
          <ol>
            <AttestationListItem>
              <AttestationListItemNo>1</AttestationListItemNo>
              <AttestationListRightCol>
                <AttestationListItemDesc>
                  <AttestationListItemDescTitle>
                    {i18n.what_is_your_wallet_address}
                  </AttestationListItemDescTitle>
                  <p>{i18n.wallet_address_example_given}</p>
                </AttestationListItemDesc>
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
                    <AttestationListItemBtn
                      className={styles.fetchBtn}
                      type="button"
                      handleClick={handleClickFetchAsset}
                    >
                      <span>{i18n.fetch_asset}</span>
                      {fetchAssetStatus === Status.InProgress && (
                        <Spinner size={14} color={colors.gray_32} borderWidth={2} />
                      )}
                    </AttestationListItemBtn>
                    <div className={styles.msg}>{fetchAssetMsg}</div>
                  </div>
                  {cryptoAssets && cryptoAssets.length > 0 && (
                    <div className={styles.cryptoAsset}>
                      <div className={styles.item}>
                        <p className={styles.label}>{i18n.wallet_address}:</p>
                        <p className={styles.value}>{formData[WALLET_ADDR]}</p>
                      </div>
                      <div className={styles.item}>
                        <p className={styles.label}>{i18n.amount}:</p>
                        <p className={styles.value}>{cryptoAssets[0].amount.toString()}</p>
                      </div>
                      <div className={styles.item}>
                        <p className={styles.label}>{i18n.unit}:</p>
                        <p className={styles.value}>{cryptoAssets[0].unit}</p>
                      </div>
                    </div>
                  )}
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
                  <p>
                    {i18n.claim_secret}: {claimSecret}
                  </p>
                </AttestationListItemDesc>
                <div className={cn(styles.claimCm)}>
                  <AttestationListItemBtn type="button" handleClick={handleClickGenerate}>
                    <MdSecurity />
                    <span>{i18n.generate}</span>
                  </AttestationListItemBtn>
                  <p className={cn(styles.value, common.alignItemCenter)}>{claimCm}</p>
                </div>
              </AttestationListRightCol>
            </AttestationListItem>
            <AttestationListItem isDisabled={step < AttestationStep.POST_TWEET}>
              <AttestationListItemOverlay />
              <AttestationListItemNo>3</AttestationListItemNo>
              <AttestationListRightCol>
                <AttestationListItemDesc>
                  <AttestationListItemDescTitle>
                    {i18n.make_signature_with_your_crypto_wallet}
                  </AttestationListItemDescTitle>
                  <p>
                    {i18n.message}: {claimCm}
                  </p>
                </AttestationListItemDesc>
                <div>
                  {claimCm && (
                    <div className={styles.section}>
                      <AttestationContentBox>
                        <p className={common.alignItemCenter}>{claimCm}</p>
                        <AttestationContentBoxBtnArea>
                          <Tooltip label={i18n.copied} show={isCopyTooltipVisible} placement="top">
                            <button type="button" onClick={handleClickCopy}>
                              <AiOutlineCopy />
                            </button>
                          </Tooltip>
                        </AttestationContentBoxBtnArea>
                      </AttestationContentBox>
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
                      <div className={styles.btnRow}>
                        <AttestationListItemBtn type="button" handleClick={handleClickValidate}>
                          <span>{i18n.validate}</span>
                        </AttestationListItemBtn>
                        <div className={styles.msg}>{validationMsg}</div>
                      </div>
                    </div>
                  )}
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
                disabled={!isSigValid || createStatus === Status.InProgress}
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
          </AttestationFormBtnRow>
        </form>
      </div>
    </>
  );
};

export default CreateCryptoSizeAttestation;

export interface CreateCryptoSizeAttestationProps {}
