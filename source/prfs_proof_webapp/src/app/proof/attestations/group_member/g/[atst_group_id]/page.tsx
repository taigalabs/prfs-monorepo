import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import Attestations from "@/components/attestations/Attestations";
import {
  AttestationsDefaultBody,
  AttestationsMain,
  AttestationsMainInner,
} from "@/components/attestations/AttestationComponents";
import GroupMemberAtstList from "@/components/group_member_atst_list/GroupMemberAtstList";

const AtstGroupPage: React.FC<AtstGroupPageProps> = ({ params }) => {
  return (
    <DefaultLayout>
      <AttestationsDefaultBody>
        <Suspense>
          <Attestations>
            <AttestationsMain>
              <AttestationsMainInner>
                <GroupMemberAtstList atst_group_id={params.atst_group_id} />
                {/* <GroupMemberAtstDetail atst_id={params.atst_id} /> */}
              </AttestationsMainInner>
            </AttestationsMain>
          </Attestations>
        </Suspense>
      </AttestationsDefaultBody>
    </DefaultLayout>
  );
};

export default AtstGroupPage;

interface AtstGroupPageProps {
  params: {
    atst_group_id: string;
  };
}
