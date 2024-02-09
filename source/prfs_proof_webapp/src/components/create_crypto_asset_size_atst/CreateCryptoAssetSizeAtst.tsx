"use client";

import React from "react";
import cn from "classnames";
import { Input } from "@taigalabs/prfs-react-lib/src/input/Input";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { atstApi, prfsApi2 } from "@taigalabs/prfs-api-js";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import ConnectWallet from "@taigalabs/prfs-react-lib/src/connect_wallet/ConnectWallet";
import colors from "@taigalabs/prfs-react-lib/src/colors.module.scss";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { FetchCryptoAssetRequest } from "@taigalabs/prfs-entities/bindings/FetchCryptoAssetRequest";
import { CryptoAsset } from "@taigalabs/prfs-entities/bindings/CryptoAsset";
import { CreateCryptoAssetSizeAtstRequest } from "@taigalabs/prfs-entities/bindings/CreateCryptoAssetSizeAtstRequest";
import { GetLeastRecentPrfsIndexRequest } from "@taigalabs/prfs-entities/bindings/GetLeastRecentPrfsIndexRequest";
import { AddPrfsIndexRequest } from "@taigalabs/prfs-entities/bindings/AddPrfsIndexRequest";

import styles from "./CreateCryptoAssetSizeAtst.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  AttestationsHeader,
  AttestationsHeaderRow,
  AttestationsTitle,
} from "@/components/attestations/AttestationComponents";
import {
  AttestationFormBtnRow,
  AttestationListItem,
  AttestationListItemBtn,
  AttestationListItemDesc,
  AttestationListItemDescTitle,
  AttestationListItemNo,
  AttestationListRightCol,
} from "@/components/create_attestation/CreateAtstComponents";
import { paths } from "@/paths";
import {
  AttestationStep,
  CryptoAssetSizeAtstFormData,
  SIGNATURE,
  WALLET_ADDR,
} from "./create_crypto_asset_size_atst";
import EncryptedWalletAddrItem from "./EncryptedWalletAddrItem";
import SignatureItem from "./SignatureItem";
import ClaimSecretItem from "./ClaimSecretItem";

enum Status {
  Standby,
  InProgress,
}

const CreateCryptoSizeAttestation: React.FC<CreateCryptoSizeAttestationProps> = () => {
  const i18n = React.useContext(i18nContext);
  const [isNavigating, setIsNavigating] = React.useState(false);
  const [isSigValid, setIsSigValid] = React.useState(false);
  const [walletAddrEnc, setWalletAddrEnc] = React.useState<string | null>(null);
  const router = useRouter();
  const [formData, setFormData] = React.useState<CryptoAssetSizeAtstFormData>({
    [WALLET_ADDR]: "",
    [SIGNATURE]: "",
  });
  const [claimCm, setClaimCm] = React.useState<string | null>(null);
  const [walletCacheKeys, setWalletCacheKeys] = React.useState<Record<string, string> | null>(null);
  const [fetchAssetStatus, setFetchAssetStatus] = React.useState<Status>(Status.Standby);
  const [createStatus, setCreateStatus] = React.useState<Status>(Status.Standby);
  const [fetchAssetMsg, setFetchAssetMsg] = React.useState<React.ReactNode>(null);
  const [createMsg, setCreateMsg] = React.useState<React.ReactNode>(null);
  const [cryptoAssets, setCryptoAssets] = React.useState<CryptoAsset[] | null>(null);
  const [step, setStep] = React.useState(AttestationStep.INPUT_WALLET_ADDR);
  const { mutateAsync: getLeastRecentPrfsIndex } = useMutation({
    mutationFn: (req: GetLeastRecentPrfsIndexRequest) => {
      return prfsApi2("get_least_recent_prfs_index", { prfs_indices: req.prfs_indices });
    },
  });
  const { mutateAsync: fetchCryptoAssetRequest } = useMutation({
    mutationFn: (req: FetchCryptoAssetRequest) => {
      return atstApi("fetch_crypto_asset", req);
    },
  });
  const { mutateAsync: addPrfsIndexRequest } = useMutation({
    mutationFn: (req: AddPrfsIndexRequest) => {
      return prfsApi2("add_prfs_index", req);
    },
  });
  const { mutateAsync: createCryptoSizeAtstRequest } = useMutation({
    mutationFn: (req: CreateCryptoAssetSizeAtstRequest) => {
      return atstApi("create_crypto_asset_size_atst", req);
    },
  });

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

  const handleClickStartOver = React.useCallback(() => {
    window.location.reload();
  }, [formData, step]);

  const handleChangeAddress = React.useCallback(
    (address: string) => {
      setFormData(oldVal => ({
        ...oldVal,
        [WALLET_ADDR]: address,
      }));
    },
    [setFormData],
  );

  const handleClickCreate = React.useCallback(async () => {
    if (
      cryptoAssets &&
      cryptoAssets.length > 0 &&
      claimCm &&
      createStatus === Status.Standby &&
      walletCacheKeys &&
      walletAddrEnc
    ) {
      try {
        // For now, we don't obfuscate attestation id
        const atst_id = `ETH_${formData[WALLET_ADDR]}`;
        setCreateMsg(null);

        if (atst_id) {
          setCreateStatus(Status.InProgress);

          const { payload: indexPayload, error: indexError } = await getLeastRecentPrfsIndex({
            prfs_indices: Object.values(walletCacheKeys),
          });

          if (indexError) {
            setCreateMsg(<span>{indexError.toString()}</span>);
            setCreateStatus(Status.Standby);
            return;
          }

          let prfs_index = null;
          if (indexPayload) {
            prfs_index = indexPayload.prfs_index;
          } else {
            setCreateMsg(<span>Wallet cache key is invalid. Something's wrong</span>);
            setCreateStatus(Status.Standby);
            return;
          }

          const wallet_addr = formData[WALLET_ADDR];
          const { payload, error } = await createCryptoSizeAtstRequest({
            atst_id,
            atst_type: "crypto_size_1",
            wallet_addr,
            serial_no: "empty",
            cm: claimCm,
            crypto_assets: cryptoAssets,
          });
          setCreateStatus(Status.Standby);

          if (error) {
            setCreateMsg(<span>{error.toString()}</span>);
            setCreateStatus(Status.Standby);
            return;
          }

          if (payload) {
            setIsNavigating(true);
            router.push(paths.attestations__crypto_asset_size);
          }

          await addPrfsIndexRequest({
            key: prfs_index,
            value: walletAddrEnc,
            serial_no: "empty",
          });
        }
      } catch (err: any) {
        setCreateMsg(<span>{err.toString()}</span>);
        setCreateStatus(Status.Standby);
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
    getLeastRecentPrfsIndex,
    router,
    walletCacheKeys,
    addPrfsIndexRequest,
    walletAddrEnc,
  ]);

  React.useEffect(() => {
    if (cryptoAssets && cryptoAssets.length > 0) {
      if (cryptoAssets[0].amount !== undefined) {
        setStep(AttestationStep.GENERATE_CLAIM);
      }
    } else {
      setStep(AttestationStep.INPUT_WALLET_ADDR);
    }
  }, [setStep, cryptoAssets]);

  return isNavigating ? (
    <div className={styles.sidePadding}>Navigating...</div>
  ) : (
    <>
      <AttestationsHeader>
        <AttestationsHeaderRow>
          <AttestationsTitle>{i18n.create_crypto_asset_size_attestation}</AttestationsTitle>
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
                      <span> or paste your wallet address</span>
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
            <ClaimSecretItem
              step={step}
              claimCm={claimCm}
              setClaimCm={setClaimCm}
              formData={formData}
              setWalletCacheKeys={setWalletCacheKeys}
              setWalletAddrEnc={setWalletAddrEnc}
              setStep={setStep}
            />
            <SignatureItem
              step={step}
              claimCm={claimCm}
              formData={formData}
              setFormData={setFormData}
              setIsSigValid={setIsSigValid}
            />
            <EncryptedWalletAddrItem
              step={step}
              walletCacheKeys={walletCacheKeys}
              walletAddrEnc={walletAddrEnc}
            />
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

export default CreateCryptoSizeAttestation;

export interface CreateCryptoSizeAttestationProps {}
