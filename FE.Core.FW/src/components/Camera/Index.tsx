import React, { useRef, useState } from 'react';
// import Webcam from 'react-webcam';

const WebcamCapture: React.FC = () => {
  // const webcamRef = useRef<Webcam | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const capture = () => {
    // const imageSrc = webcamRef.current?.getScreenshot() || '';
    // setImageSrc(imageSrc);
  };

  return (
    <div>
      <h2>Chụp ảnh qua Webcam</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
        /> */}
        <button onClick={capture}>Chụp ảnh</button>
        {imageSrc && (
          <div>
            <h3>Ảnh đã chụp:</h3>
            <img src={imageSrc} alt="Captured" />
          </div>
        )}
      </div>
    </div>
  );
};

export default WebcamCapture;
