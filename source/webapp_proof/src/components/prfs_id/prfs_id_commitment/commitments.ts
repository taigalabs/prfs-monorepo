import React from "react";
import { useSearchParams } from "next/navigation";

export function useCommitments() {
  const searchParams = useSearchParams();

  React.useEffect(() => {
    async function fn() {
      try {
        const cms = searchParams.get("cms");
        console.log("cms", cms);

        if (cms) {
          const d = decodeURIComponent(cms);
          const data = d.split(",");

          console.log(data);

          // const content = (
          //   <CommitmentData
          //     commitmentsMeta={data}
          //     credential={credential}
          //     appId={appId}
          //     // setCommitmentData={setCommitmentData}
          //   />
          // );
        }

        // if (signInData) {
        //   const d = decodeURIComponent(signInData);
        //   const data = d.split(",");
        //   const content = (
        //     <SignInInputs
        //       signInDataMeta={data}
        //       credential={credential}
        //       appId={appId}
        //       setSignInData={setSignInData}
        //     />
        //   );
        //   setSignInDataElem(content);
        // }
        // setStatus(Status.Standby);
      } catch (err) {
        console.error(err);
      }
    }
    fn().then();
  }, [searchParams]);
}
