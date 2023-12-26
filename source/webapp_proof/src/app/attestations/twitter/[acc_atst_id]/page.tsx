import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import Attestations, { AttestationsMain } from "@/components/attestations/Attestations";
import TwitterAccAtstList from "@/components/twitter_acc_atst_list/TwitterAccAtstList";
import AccAtstDetail from "@/components/acc_atst_detail/AccAtstDetail";

const TwitterAttestionDetailPage: React.FC<TwitterAttestionDetailPageProps> = ({ params }) => {
  return (
    <DefaultLayout>
      <DefaultBody noMinWidth>
        <Suspense>
          <Attestations>
            <AttestationsMain>
              <AccAtstDetail acc_atst_id={params.acc_atst_id} />
            </AttestationsMain>
          </Attestations>
        </Suspense>
      </DefaultBody>
      <DefaultFooter>
        <GlobalFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default TwitterAttestionDetailPage;

interface TwitterAttestionDetailPageProps {
  params: {
    acc_atst_id: string;
  };
}
