"use client";

import React from "react";

import styles from "./CreateID.module.scss";
import { i18nContext } from "@/contexts/i18n";
import SignInModule, {
  SignInInputGuide,
  SignInInputItem,
  SignInModuleBtnRow,
  SignInModuleHeader,
  SignInModuleInputArea,
  SignInModuleLogoArea,
  SignInModuleSubtitle,
  SignInModuleTitle,
} from "@/components/sign_in_module/SignInModule";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import { PrfsSDK } from "@taigalabs/prfs-sdk-web";
//
import * as ethers from "ethers";
import * as secp from "@noble/secp256k1";

import { paths } from "@/paths";
import { IdForm, idFormEmpty, validateIdForm } from "@/functions/validate_id";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/elems/proof_gen_element/proof_gen_element";
import UtilsElement from "@taigalabs/prfs-sdk-web/src/elems/utils_element/utils_element";
import Step2 from "./Step2";

const prfsSDK = new PrfsSDK("prfs-proof");

const CreateID: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSDKInitiated = React.useRef(false);

  const [formData, setFormData] = React.useState<IdForm>(idFormEmpty);
  const [formErrors, setFormErrors] = React.useState<IdForm>(idFormEmpty);
  const [step, setStep] = React.useState("1");

  // React.useEffect(() => {
  //   const step = searchParams.get("step");

  //   let b = ethers.utils.toUtf8Bytes("as");
  //   let a = ethers.utils.keccak256(b);
  //   let ccc = a.substring(2);
  //   // let a2 = ethers.utils.toUtf8Bytes(a);
  //   // console.log(111, b, a, ccc);

  //   // let c = secp.getPublicKey(ccc);
  //   // console.log(22, c);

  //   // let c2 = ethers.utils.toUtf8String(c);
  //   // let bb = secp.utils.randomPrivateKey();

  //   if (step === null) {
  //     const search = `?${searchParams.toString()}&step=1`;
  //     router.push(search);
  //   } else {
  //     if (step !== "1") {
  //       if (
  //         formData.password_1.length === 0 ||
  //         formData.password_2.length === 0 ||
  //         formData.email.length === 0
  //       ) {
  //         const params = new URLSearchParams(searchParams?.toString());
  //         params.set("step", "1");
  //         const url = `?${params.toString()}`;
  //         router.push(url);
  //       }
  //     }

  //     setStep(step);
  //   }
  // }, [router, searchParams, setStep, formData]);

  // React.useEffect(() => {
  //   async function fn() {
  //     if (isSDKInitiated.current) {
  //       return;
  //     }
  //     isSDKInitiated.current = true;

  //     // const { circuit_driver_id, driver_properties } = proofType;
  //     // setLoadDriverStatus(LoadDriverStatus.InProgress);
  //     // setDriverMsg(<span>Loading driver {proofType.circuit_driver_id}...</span>);

  //     // const since = dayjs();
  //     try {
  //       const elem: UtilsElement = await prfsSDK.create("utils", {
  //         sdkEndpoint: process.env.NEXT_PUBLIC_PRFS_SDK_WEB_ENDPOINT,
  //       });

  //       console.log(11, elem);

  //       // elem.subscribe(ev => {
  //       //   const { type, payload } = ev;

  //       //   if (type === "LOAD_DRIVER_EVENT") {
  //       //     if (payload.asset_label && payload.progress) {
  //       //       setLoadDriverProgress(oldVal => ({
  //       //         ...oldVal,
  //       //         [payload.asset_label!]: payload.progress,
  //       //       }));
  //       //     }
  //       //   }

  //       //   if (type === "LOAD_DRIVER_SUCCESS") {
  //       //     const now = dayjs();
  //       //     const diff = now.diff(since, "seconds", true);
  //       //     const { artifactCount } = payload;

  //       //     setDriverMsg(
  //       //       <>
  //       //         <span>Circuit driver </span>
  //       //         <a
  //       //           href={`${envs.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/circuit_drivers/${circuit_driver_id}`}
  //       //         >
  //       //           {proofType.circuit_driver_id} <BiLinkExternal />
  //       //         </a>
  //       //         <span>
  //       //           ({diff} seconds, {artifactCount} artifacts)
  //       //         </span>
  //       //       </>,
  //       //     );
  //       //     setLoadDriverStatus(LoadDriverStatus.StandBy);
  //       //   }

  //       //   if (type === "CREATE_PROOF_EVENT") {
  //       //     setSystemMsg(payload.payload);
  //       //   }
  //       // });

  //       // setProofGenElement(elem);
  //       return elem;
  //     } catch (err) {
  //       // setDriverMsg(`Driver init failed, id: ${circuit_driver_id}, err: ${err}`);
  //     }
  //   }

  //   fn().then();
  // }, []);

  const handleChangeValue = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const name = ev.target.name;
      const val = ev.target.value;

      if (name) {
        setFormData(oldVal => {
          return {
            ...oldVal,
            [name]: val,
          };
        });
      }
    },
    [formData, setFormData],
  );

  const handleClickNext = React.useCallback(() => {
    const res = validateIdForm(formData, setFormErrors);

    if (res) {
      const params = new URLSearchParams(searchParams?.toString());
      params.set("step", "2");
      const url = `?${params.toString()}`;

      router.push(url);
    }
  }, [formData, setFormErrors, router, searchParams]);

  const emailGuideURL = React.useMemo(() => {
    const url = `${process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}/zauth`;

    return url;
  }, []);

  const content = React.useMemo(() => {
    switch (step) {
      case "1": {
        return (
          <Fade>
            <SignInModuleHeader>
              <SignInModuleTitle>{i18n.create_zauth_identity}</SignInModuleTitle>
              <SignInModuleSubtitle>{i18n.type_information}</SignInModuleSubtitle>
            </SignInModuleHeader>
            <SignInModuleInputArea>
              <div className={styles.inputGroup}>
                <SignInInputItem
                  name="email"
                  value={formData.email}
                  placeholder={i18n.email}
                  error={formErrors.email}
                  handleChangeValue={handleChangeValue}
                />
                <SignInInputItem
                  name="email_confirm"
                  value={formData.email_confirm}
                  placeholder={i18n.confirm}
                  error={formErrors.email_confirm}
                  handleChangeValue={handleChangeValue}
                />
              </div>
              <SignInInputGuide>
                <Link href={emailGuideURL} target="_blank">
                  {i18n.why_we_ask_for_email}
                </Link>
              </SignInInputGuide>
              <div className={styles.inputGroup}>
                <SignInInputItem
                  name="password_1"
                  value={formData.password_1}
                  placeholder={i18n.password_1}
                  error={formErrors.password_1}
                  handleChangeValue={handleChangeValue}
                  type="password"
                />
                <SignInInputItem
                  name="password_1_confirm"
                  value={formData.password_1_confirm}
                  placeholder={i18n.confirm}
                  error={formErrors.password_1_confirm}
                  handleChangeValue={handleChangeValue}
                  type="password"
                />
              </div>
              <div className={styles.inputGroup}>
                <SignInInputItem
                  name="password_2"
                  value={formData.password_2}
                  placeholder={i18n.password_2}
                  error={formErrors.password_2}
                  handleChangeValue={handleChangeValue}
                  type="password"
                />
                <SignInInputItem
                  name="password_2_confirm"
                  value={formData.password_2_confirm}
                  placeholder={i18n.confirm}
                  error={formErrors.password_2_confirm}
                  handleChangeValue={handleChangeValue}
                  type="password"
                />
              </div>
              <SignInInputGuide>
                <Link href={emailGuideURL} target="_blank">
                  {i18n.why_we_ask_for_two_passwords}
                </Link>
              </SignInInputGuide>
            </SignInModuleInputArea>
            <SignInModuleBtnRow>
              <Link href={paths.id}>
                <Button variant="transparent_blue_2" noTransition>
                  {i18n.already_have_id}
                </Button>
              </Link>
              <Button
                variant="blue_2"
                className={styles.nextBtn}
                noTransition
                handleClick={handleClickNext}
                noShadow
              >
                {i18n.next}
              </Button>
            </SignInModuleBtnRow>
          </Fade>
        );
      }
      case "2": {
        return <Step2 formData={formData} />;
      }
      default:
        <div>Invalid step</div>;
    }
  }, [step, handleClickNext, handleChangeValue, formErrors]);

  return (
    <div className={styles.wrapper}>
      <SignInModule>
        <SignInModuleLogoArea />
        <div>{content}</div>
      </SignInModule>
    </div>
  );
};

export default CreateID;
