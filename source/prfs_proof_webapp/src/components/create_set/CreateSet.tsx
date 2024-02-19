"use client";

import React from "react";
import cn from "classnames";
import { Input } from "@taigalabs/prfs-react-lib/src/input/Input";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { prfsApi2, prfsApi3 } from "@taigalabs/prfs-api-js";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import colors from "@taigalabs/prfs-react-lib/src/colors.module.scss";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { CreatePrfsSetRequest } from "@taigalabs/prfs-entities/bindings/CreatePrfsSetRequest";

import styles from "./CreateSet.module.scss";
import { i18nContext } from "@/i18n/context";
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
  AttestationListItemUnordered,
} from "@/components/create_attestation/CreateAtstComponents";
import { useSignedInUser } from "@/hooks/user";
import { consolePaths, paths } from "@/paths";

const SET_ID = "set_id";
const LABEL = "label";
const DESC = "desc";

enum Status {
  Standby,
  InProgress,
}

const CreateSet: React.FC<CreateSetProps> = () => {
  const i18n = React.useContext(i18nContext);
  const [isNavigating, setIsNavigating] = React.useState(false);
  const router = useRouter();
  const [formData, setFormData] = React.useState({ [SET_ID]: "", [LABEL]: "", [DESC]: "" });
  const [createStatus, setCreateStatus] = React.useState<Status>(Status.Standby);
  const [createMsg, setCreateMsg] = React.useState<React.ReactNode>(null);
  const { mutateAsync: createPrfsSetRequest } = useMutation({
    mutationFn: (req: CreatePrfsSetRequest) => {
      // return prfsApi2("create_prfs_set", req);
      return prfsApi3({ type: "create_prfs_set", ...req });
    },
  });
  const { prfsProofCredential } = useSignedInUser();

  const handleChangeValue = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, name } = e.target;

      setFormData(oldVal => ({
        ...oldVal,
        [name]: value,
      }));
    },
    [setFormData],
  );

  const handleClickStartOver = React.useCallback(() => {
    window.location.reload();
  }, [formData]);

  const handleClickCreate = React.useCallback(async () => {
    const set_id = formData[SET_ID];
    const label = formData[LABEL];
    const desc = formData[DESC];

    if (set_id.length > 0 && label.length > 0 && desc.length > 0 && prfsProofCredential) {
      try {
        setCreateStatus(Status.InProgress);
        const { payload, error } = await createPrfsSetRequest({
          prfs_set_ins1: {
            set_id,
            set_type: "Dynamic",
            label,
            author: prfsProofCredential.account_id,
            desc,
            hash_algorithm: "Poseidon",
            cardinality: BigInt(0),
            merkle_root: "",
            element_type: "",
            tree_depth: 32,
            finite_field: "Z_(2^256-2^32-977)",
            elliptic_curve: "Secp256k1",
          },
        });
        setCreateStatus(Status.Standby);

        if (error) {
          setCreateMsg(<span>{error.toString()}</span>);
        }
        if (payload) {
          setIsNavigating(true);
          router.push(consolePaths.sets);
        }
      } catch (err) {
        setCreateStatus(Status.Standby);
      }
    }
  }, [formData, setIsNavigating, setCreateMsg, setCreateStatus, router, createPrfsSetRequest]);

  return isNavigating ? (
    <div>Navigating...</div>
  ) : (
    <>
      <AttestationsHeader>
        <AttestationsHeaderRow>
          <AttestationsTitle>{i18n.create_set}</AttestationsTitle>
        </AttestationsHeaderRow>
      </AttestationsHeader>
      <div>
        <form>
          <ol>
            <AttestationListItem>
              <AttestationListItemUnordered>
                <AttestationListItemDesc>
                  <AttestationListItemDescTitle>{i18n.set_id}</AttestationListItemDescTitle>
                </AttestationListItemDesc>
                <div className={styles.content}>
                  <Input
                    className={styles.input}
                    name={SET_ID}
                    error={""}
                    label={i18n.set_id}
                    value={formData.set_id}
                    handleChangeValue={handleChangeValue}
                  />
                </div>
              </AttestationListItemUnordered>
            </AttestationListItem>
            <AttestationListItem>
              <AttestationListItemUnordered>
                <AttestationListItemDesc>
                  <AttestationListItemDescTitle>{i18n.label}</AttestationListItemDescTitle>
                </AttestationListItemDesc>
                <div className={cn(styles.content)}>
                  <Input
                    className={styles.input}
                    name={LABEL}
                    error={""}
                    label={i18n.label}
                    value={formData.label}
                    handleChangeValue={handleChangeValue}
                  />
                </div>
              </AttestationListItemUnordered>
            </AttestationListItem>
            <AttestationListItem>
              <AttestationListItemUnordered>
                <AttestationListItemDesc>
                  <AttestationListItemDescTitle>{i18n.description}</AttestationListItemDescTitle>
                </AttestationListItemDesc>
                <div className={cn(styles.content)}>
                  <Input
                    className={styles.input}
                    name={DESC}
                    error={""}
                    label={i18n.description}
                    value={formData.desc}
                    handleChangeValue={handleChangeValue}
                  />
                </div>
              </AttestationListItemUnordered>
            </AttestationListItem>
          </ol>
          <AttestationFormBtnRow className={styles.formBtnRow}>
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
                disabled={createStatus === Status.InProgress}
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

export default CreateSet;

export interface CreateSetProps {}
