import { useSigner } from "@thirdweb-dev/react";

const useProver = () => {
  const signer = useSigner();

  console.log(11, signer);
};

export default useProver;
