import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import Attestations from "@/components/attestations/Attestations";
import { AppDefaultBody, AppMain, AppMainInner } from "@/components/app_components/AppComponents";
import GroupMemberAtstDetail from "@/components/group_member_atst_detail/GroupMemberAtstDetail";

const AtstGroupPage: React.FC<AtstGroupPageProps> = ({ params }) => {
  return (
    <DefaultLayout>
      <AppDefaultBody>
        <Suspense>
          <Attestations>
            <AppMain>
              <AppMainInner>
                <GroupMemberAtstDetail atst_id={params.atst_id} />
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
    atst_id: string;
  };
}
