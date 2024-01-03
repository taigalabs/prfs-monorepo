import React from "react";
import QRCode from "qrcode";

import styles from "./QRCodeView.module.scss";

const QRCodeView: React.FC<QRCodeViewProps> = ({ data, size }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    async function fn() {
      if (canvasRef.current && data) {
        await QRCode.toCanvas(canvasRef.current, data, {
          errorCorrectionLevel: "H",
          width: size || 104,
        });
      }
    }
    fn().then();
  }, [canvasRef]);

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default QRCodeView;

export interface QRCodeViewProps {
  data: any;
  size?: number;
}
