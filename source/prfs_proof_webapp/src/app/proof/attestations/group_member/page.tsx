import React, { Suspense } from "react";
import { redirect } from "next/navigation";

import styles from "./page.module.scss";
import { paths } from "@/paths";
import { NONCE_ATST_GROUP_ID } from "@/atst_group_id";

const CryptoSizePage = () => {
  redirect(`${paths.attestations__group_member}/${NONCE_ATST_GROUP_ID}`);

  // return (
  //   <DefaultLayout>
  //     <AttestationsDefaultBody>
  //       <Suspense>
  //         <Attestations>
  //           <AttestationsMain>
  //             <AttestationsMainInner>
  //               <GroupMemberAtstList />
  //             </AttestationsMainInner>
  //           </AttestationsMain>
  //         </Attestations>
  //       </Suspense>
  //     </AttestationsDefaultBody>
  //   </DefaultLayout>
  // );
};

export default CryptoSizePage;
