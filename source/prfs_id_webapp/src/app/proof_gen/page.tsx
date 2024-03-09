import React, { Suspense } from "react";

import { DefaultLayout, DefaultBody } from "@/components/layouts/default_layout/DefaultLayout";
import ProofGen from "@/components/proof_gen/ProofGen";
import CommitHash from "@/components/commit_hash/CommitHash";
import GlobalErrorDialog from "@/components/global_error_dialog/GlobalErrorDialog";
import GlobalMsgDialog from "@/components/global_msg_dialog/GlobalMsgDialog";

const ProofGenPage = () => {
  return (
    <DefaultLayout>
      <DefaultBody>
        <Suspense>
          <ProofGen />
          <GlobalErrorDialog />
          <GlobalMsgDialog />
        </Suspense>
      </DefaultBody>
      <CommitHash />
    </DefaultLayout>
  );
};

export default ProofGenPage;
