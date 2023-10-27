import React from "react";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";
import cn from "classnames";

import styles from "./LogoContainer.module.scss";

const LogoContainer: React.FC<LogoContainerProps> = ({ proofTypeChosen }) => {
  const [logoWidth, setLogoWidth] = React.useState(140);

  // React.useEffect(() => {
  //   const { clientWidth } = document.body;

  //   if (clientWidth <= 480) {
  //     // setLogoWidth(110);
  //   } else {
  //     // setLogoWidth(140);
  //   }
  // }, [setLogoWidth]);

  return (
    <div className={cn({ [styles.wrapper]: true, [styles.proofTypeChosen]: proofTypeChosen })}>
      <ImageLogo width={proofTypeChosen ? 55 : logoWidth} />
    </div>
  );
};

export default LogoContainer;

export interface LogoContainerProps {
  proofTypeChosen: boolean;
}
