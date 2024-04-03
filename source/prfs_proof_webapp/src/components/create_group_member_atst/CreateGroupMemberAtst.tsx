"use client";

import React from "react";
import cn from "classnames";
import Input from "@taigalabs/prfs-react-lib/src/input/Input";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { atstApi, prfsApi3 } from "@taigalabs/prfs-api-js";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { useRouter } from "next/navigation";
import colors from "@taigalabs/prfs-react-lib/src/colors.module.scss";
import { ErrorBox } from "@taigalabs/prfs-react-lib/src/error_box/ErrorBox";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { FetchCryptoAssetRequest } from "@taigalabs/prfs-entities/bindings/FetchCryptoAssetRequest";
import { CryptoAsset } from "@taigalabs/prfs-entities/bindings/CryptoAsset";
import { GetLeastRecentPrfsIndexRequest } from "@taigalabs/prfs-entities/bindings/GetLeastRecentPrfsIndexRequest";
import { AddPrfsIndexRequest } from "@taigalabs/prfs-entities/bindings/AddPrfsIndexRequest";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";
import { toUtf8Bytes } from "@taigalabs/prfs-crypto-js";
import { utils as walletUtils } from "@taigalabs/prfs-crypto-deps-js/ethers";
import { CreatePrfsAttestationRequest } from "@taigalabs/prfs-entities/bindings/CreatePrfsAttestationRequest";

import styles from "./CreateGroupMemberAtst.module.scss";
import {
  AttestationsHeader,
  AttestationsHeaderRow,
  AttestationsTitle,
} from "@/components/attestations/AttestationComponents";
import {
  AttestationFormBtnRow,
  AttestationListItem,
  AttestationListItemDesc,
  AttestationListItemDescTitle,
  AttestationListItemNo,
  AttestationListRightCol,
} from "@/components/create_attestation/CreateAtstComponents";
import { paths } from "@/paths";
import {
  CM,
  ATST_TYPE_ID,
  GroupMemberAtstFormData,
  //ATST_GROUP_ID,
  MEMBER_CODE,
  MEMBER_ID,
  MEMBER,
} from "./create_group_member_atst";
import ClaimSecretItem from "./ClaimSecretItem";
import { useI18N } from "@/i18n/use_i18n";
import AtstGroupSelect from "@/components/atst_group_select/AtstGroupSelect";
import MemberIdInput from "./MemberIdInput";
import { PrfsAtstGroup } from "@taigalabs/prfs-entities/bindings/PrfsAtstGroup";
import { ValidateGroupMembershipRequest } from "@taigalabs/prfs-entities/bindings/ValidateGroupMembershipRequest";

enum Status {
  Standby,
  InProgress,
}

function checkIfFormIsFilled(formData: GroupMemberAtstFormData) {
  // if (formData[ATST_GROUP_ID].length < 1) {
  //   return false;
  // }
  // if (formData[CM].length < 1) {
  //   return false;
  // }

  return true;
}

const CreateGroupMemberAtst: React.FC<CreateMemberAtstProps> = () => {
  const i18n = useI18N();
  const [isNavigating, setIsNavigating] = React.useState(false);
  const [memberIdEnc, setMemberIdEnc] = React.useState<string | null>(null);
  const router = useRouter();
  const [formData, setFormData] = React.useState<GroupMemberAtstFormData>({
    [MEMBER_ID]: "",
    [MEMBER_CODE]: "",
  });
  const [memberIdCacheKeys, setMemberIdCacheKeys] = React.useState<Record<string, string> | null>(
    null,
  );
  const [createStatus, setCreateStatus] = React.useState<Status>(Status.Standby);
  const [error, setError] = React.useState<React.ReactNode>(null);
  const [atstGroup, setAtstGroup] = React.useState<PrfsAtstGroup | null>(null);
  const [validationMsg, setValidationMsg] = React.useState<React.ReactNode>(null);

  const { mutateAsync: getLeastRecentPrfsIndex } = useMutation({
    mutationFn: (req: GetLeastRecentPrfsIndexRequest) => {
      return prfsApi3({ type: "get_least_recent_prfs_index", prfs_indices: req.prfs_indices });
    },
  });
  const { mutateAsync: addPrfsIndexRequest } = useMutation({
    mutationFn: (req: AddPrfsIndexRequest) => {
      return prfsApi3({ type: "add_prfs_index", ...req });
    },
  });
  const { mutateAsync: createCryptoSizeAtstRequest } = useMutation({
    mutationFn: (req: CreatePrfsAttestationRequest) => {
      return atstApi({ type: "create_crypto_asset_atst", ...req });
    },
  });
  const { mutateAsync: validateGroupMembership } = useMutation({
    mutationFn: (req: ValidateGroupMembershipRequest) => {
      return atstApi({ type: "validate_group_membership", ...req });
    },
  });

  const handleChangeFormData = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, name } = e.target;

      if (name === MEMBER_ID) {
        setFormData(oldVal => ({
          ...oldVal,
          [MEMBER_ID]: value,
        }));
      }

      if (name === MEMBER_CODE) {
        setFormData(oldVal => ({
          ...oldVal,
          [MEMBER_CODE]: value,
        }));
      }
    },

    [setFormData],
  );

  const handleValidateGroupMembership = React.useCallback(async () => {
    setValidationMsg(null);

    if (atstGroup) {
      if (!formData[MEMBER_ID]) {
        setValidationMsg("Member Id is should be given");
      }

      if (!formData[MEMBER_CODE]) {
        setValidationMsg("Member code should be given");
      }

      const data = await validateGroupMembership({
        atst_group_id: atstGroup?.atst_group_id,
        member_id: formData[MEMBER_ID],
        member_code: formData[MEMBER_CODE],
      });

      console.log(11, data);
    }
  }, [formData, atstGroup, setValidationMsg, validateGroupMembership]);

  // const handleChangeWalletAddr = React.useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const { value, name } = e.target;

  //     if (name === WALLET_ADDR) {
  //       setFormData(_ => ({
  //         [WALLET_ADDR]: value,
  //         [SIGNATURE]: "",
  //         [CM]: "",
  //       }));
  //     }

  //     if (cryptoAssets) {
  //       setCryptoAssets(null);
  //       setFetchAssetMsg(null);
  //     }
  //   },
  //   [setFormData, setCryptoAssets, cryptoAssets, setFetchAssetMsg],
  // );

  const handleChangeCm = React.useCallback(
    (cm: string) => {
      if (cm?.length) {
        setFormData(oldVal => ({
          ...oldVal,
          [CM]: cm,
        }));
      }
    },
    [setFormData],
  );

  const handleClickStartOver = React.useCallback(() => {
    window.location.reload();
  }, [formData]);

  const isFormFilled = React.useMemo(() => {
    return checkIfFormIsFilled(formData);
  }, [formData]);

  const handleClickCreate = React.useCallback(async () => {
    if (
      isFormFilled &&
      createStatus === Status.Standby &&
      atstGroup &&
      memberIdCacheKeys &&
      memberIdEnc
    ) {
      try {
        setError(null);
        // const cm = formData[CM];
        // const cm_msg = toUtf8Bytes(cm);
        const atst_id = `${MEMBER}_${atstGroup}`;

        if (atst_id) {
          setCreateStatus(Status.InProgress);

          const { payload: indexPayload, error: indexError } = await getLeastRecentPrfsIndex({
            prfs_indices: Object.values(memberIdCacheKeys),
          });

          if (indexError) {
            setError(<span>{indexError.toString()}</span>);
            setCreateStatus(Status.Standby);
            return;
          }

          let prfs_index = null;
          if (indexPayload) {
            prfs_index = indexPayload.prfs_index;
          } else {
            setError(<span>Wallet cache key is invalid. Something's wrong</span>);
            setCreateStatus(Status.Standby);
            return;
          }

          // const wallet_addr = formData[WALLET_ADDR];
          // const cm = formData[CM];
          // const { payload, error } = await createCryptoSizeAtstRequest({
          //   atst_id,
          //   atst_type_id: "crypto_1",
          //   label: wallet_addr,
          //   serial_no: "empty",
          //   cm,
          //   cm_msg: Array.from(cm_msg),
          //   sig,
          // });
          setCreateStatus(Status.Standby);

          // if (error) {
          //   setError(<span>{error.toString()}</span>);
          //   setCreateStatus(Status.Standby);
          //   return;
          // }

          // if (payload) {
          //   setIsNavigating(true);
          //   router.push(paths.attestations__crypto_asset);
          // }

          // await addPrfsIndexRequest({
          //   key: prfs_index,
          //   value: walletAddrEnc,
          //   serial_no: "empty",
          // });
        }
      } catch (err: any) {
        setError(<span>{err.toString()}</span>);
        setCreateStatus(Status.Standby);
      }
    }
  }, [
    formData,
    atstGroup,
    setIsNavigating,
    createCryptoSizeAtstRequest,
    setError,
    setCreateStatus,
    getLeastRecentPrfsIndex,
    router,
    memberIdCacheKeys,
    addPrfsIndexRequest,
    memberIdEnc,
  ]);

  return isNavigating ? (
    <div className={styles.sidePadding}>{i18n.not_available}...</div>
  ) : (
    <>
      <AttestationsHeader>
        <AttestationsHeaderRow>
          <AttestationsTitle>{i18n.create_group_member_attestation}</AttestationsTitle>
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
                    {i18n.what_group_are_you_a_member_of}
                  </AttestationListItemDescTitle>
                </AttestationListItemDesc>
                <div className={styles.content}>
                  <AtstGroupSelect atstGroup={atstGroup} setAtstGroup={setAtstGroup} />
                </div>
              </AttestationListRightCol>
            </AttestationListItem>
            <MemberIdInput
              atstGroup={atstGroup}
              formData={formData}
              handleChangeMemberInfo={handleChangeFormData}
              handleValidateGroupMembership={handleValidateGroupMembership}
              validationMsg={validationMsg}
            />
            <ClaimSecretItem
              atstGroup={atstGroup}
              formData={formData}
              handleChangeCm={handleChangeCm}
              memberIdCacheKeys={memberIdCacheKeys}
              setMemberIdCacheKeys={setMemberIdCacheKeys}
              memberIdEnc={memberIdEnc}
              setMemberIdEnc={setMemberIdEnc}
            />
          </ol>
          <AttestationFormBtnRow>
            <div className={styles.createBtnRow}>
              <Button
                variant="transparent_blue_3"
                noTransition
                rounded
                handleClick={handleClickStartOver}
                type="button"
              >
                {i18n.start_over}
              </Button>
              <Button
                variant="blue_3"
                rounded
                noTransition
                contentClassName={styles.createBtn}
                handleClick={handleClickCreate}
                noShadow
                type="button"
                disabled={!isFormFilled || createStatus === Status.InProgress}
              >
                <span>{i18n.create}</span>
                {createStatus === Status.InProgress && (
                  <Spinner size={14} borderWidth={2} color={colors.white_100} />
                )}
              </Button>
            </div>
            {error && (
              <ErrorBox className={cn(styles.error)} rounded>
                {error}
              </ErrorBox>
            )}
          </AttestationFormBtnRow>
        </form>
      </div>
    </>
  );
};

export default CreateGroupMemberAtst;

export interface CreateMemberAtstProps {}
