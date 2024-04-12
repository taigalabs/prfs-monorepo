import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import Attestations from "@/components/attestations/Attestations";
import { AppDefaultBody, AppMain, AppMainInner } from "@/components/app_components/AppComponents";
import GroupMemberAtstList from "@/components/group_member_atst_list/GroupMemberAtstList";

const AtstGroupPage: React.FC<AtstGroupPageProps> = ({ params }) => {
  return (
    <DefaultLayout>
      <AppDefaultBody>
        <Suspense>
          <Attestations>
            <AppMain>
              <AppMainInner>
                <GroupMemberAtstList atst_group_id={params.atst_group_id} />
                {/* <GroupMemberAtstDetail atst_id={params.atst_id} /> */}
              </AppMainInner>
            </AppMain>
          </Attestations>
        </Suspense>
      </AppDefaultBody>
    </DefaultLayout>
  );
};

export default AtstGroupPage;

interface AtstGroupPageProps {
  params: {
    atst_group_id: string;
  };
}
