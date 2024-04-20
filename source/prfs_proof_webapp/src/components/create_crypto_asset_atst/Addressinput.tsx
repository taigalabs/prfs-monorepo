import React from "react";
import cn from "classnames";
import ConnectWallet from "@taigalabs/prfs-react-lib/src/connect_wallet/ConnectWallet";
import { FetchCryptoAssetRequest } from "@taigalabs/prfs-entities/bindings/FetchCryptoAssetRequest";
import { CryptoAsset } from "@taigalabs/prfs-entities/bindings/CryptoAsset";
import RawValueDialog from "@taigalabs/prfs-react-lib/src/raw_value_dialog/RawValueDialog";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";
import {
  Fieldset,
  InputElement,
  InputWrapper,
  Label,
} from "@taigalabs/prfs-react-lib/src/input/InputComponent";
import { useInput } from "@taigalabs/prfs-react-lib/src/input/useInput";
import colors from "@taigalabs/prfs-react-lib/src/colors.module.scss";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { atstApi } from "@taigalabs/prfs-api-js";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { CryptoAssetSizeAtstFormData } from "./create_crypto_asset_atst";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";

import styles from "./AddressInput.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import { FormInputButton } from "@/components/form_input_button/FormInputButton";
import {
  AttestationListItem,
  AttestationListItemDesc,
  AttestationListItemDescTitle,
  AttestationListItemNo,
  AttestationListRightCol,
} from "@/components/create_atst_components/CreateAtstComponents";

enum Status {
  Standby,
  InProgress,
}

const AddressInput: React.FC<AddresseInputProps> = ({ walletAddr, error, setFormData }) => {
  const i18n = useI18N();
  const { isFocused, handleFocus, handleBlur } = useInput();
  const [cryptoAssets, setCryptoAssets] = React.useState<CryptoAsset[] | null>(null);
  const [fetchAssetStatus, setFetchAssetStatus] = React.useState<Status>(Status.Standby);
  const [fetchAssetMsg, setFetchAssetMsg] = React.useState<React.ReactNode>(null);

  const { mutateAsync: fetchCryptoAssetRequest } = useMutation({
    mutationFn: (req: FetchCryptoAssetRequest) => {
      return atstApi({ type: "fetch_crypto_asset", ...req });
    },
  });

  const handleClickFetchAsset = React.useCallback(async () => {
    if (walletAddr.length > 0) {
      if (!walletAddr.startsWith("0x")) {
        setFetchAssetMsg(
          <span className={styles.error}>{i18n.wallet_address_should_start_with_0x}</span>,
        );
        return;
      }

      const req: FetchCryptoAssetRequest = {
        wallet_addr: walletAddr,
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
  }, [fetchCryptoAssetRequest, setCryptoAssets, setFetchAssetMsg, setFetchAssetStatus, walletAddr]);

  const handleChangeWalletAddr = React.useCallback(
    (addr: string) => {
      setFormData(_ => ({
        wallet_addr: addr,
        signature: "",
        commitment: "",
      }));
    },
    [setFormData, setCryptoAssets, cryptoAssets, setFetchAssetMsg],
  );

  const abbrevWalletAddr = React.useMemo(() => {
    if (walletAddr.length > 10) {
      return abbrev7and5(walletAddr);
    }
    return walletAddr;
  }, [walletAddr]);

  return (
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
            <>
              <div className={styles.wrapper}>
                <div className={styles.addressInput}>
                  <InputWrapper
                    className={styles.inputWrapper}
                    isError={!!error}
                    isFocused={isFocused}
                    hasValue={abbrevWalletAddr.length > 0}
                  >
                    <Label name={""} className={styles.label}>
                      {i18n.wallet}
                    </Label>
                    <Fieldset>{i18n.wallet}</Fieldset>
                    <InputElement
                      name={""}
                      value={abbrevWalletAddr || ""}
                      className={styles.input}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      readOnly
                    />
                  </InputWrapper>
                </div>
                <div className={styles.btnRow}>
                  <ConnectWallet handleChangeAddress={handleChangeWalletAddr}>
                    <FormInputButton>{i18n.connect}</FormInputButton>
                  </ConnectWallet>
                  {/* <RawValueDialog handleChangeItem={handleChangeWalletAddr} label={i18n.address}> */}
                  {/*   <FormInputButton>{i18n.i_will_type}</FormInputButton> */}
                  {/* </RawValueDialog> */}
                </div>
              </div>
            </>
          </div>
          <div className={styles.btnRow}>
            <button type="button" onClick={handleClickFetchAsset} className={styles.btn}>
              <HoverableText disabled={walletAddr.length === 0}>
                {i18n.what_do_i_have}
              </HoverableText>
            </button>
            <div className={styles.msg}>
              {fetchAssetStatus === Status.InProgress && (
                <Spinner size={14} color={colors.gray_32} borderWidth={2} />
              )}
              {fetchAssetMsg}
            </div>
          </div>
          {cryptoAssets?.length && (
            <div className={styles.cryptoAsset}>
              <div className={styles.item}>
                <p className={styles.label}>{i18n.wallet_address}:</p>
                <p className={styles.value}>{walletAddr}</p>
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
  );
};

export default AddressInput;

export interface AddresseInputProps {
  walletAddr: string;
  // handleChangeAddress: (addr: string) => void;
  error: string | null;
  setFormData: React.Dispatch<React.SetStateAction<CryptoAssetSizeAtstFormData>>;
}
