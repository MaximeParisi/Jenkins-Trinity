import Html5QrcodePlugin from "../components/Html5QrcodePlugin";

const Scanner = (props) => {

  const onNewScanResult = (decodedText, decodedResult) => {
    console.log("Scanned Code:", decodedText);
  };

  return (
    <div className="App">
      <Html5QrcodePlugin
        fps={10}
        qrbox={250}
        disableFlip={false}
        qrCodeSuccessCallback={onNewScanResult}
      />
    </div>
  );
};
export default Scanner;
