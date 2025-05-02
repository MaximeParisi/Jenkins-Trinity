import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';

const qrcodeRegionId = "html5qr-code-full-region";

const createConfig = (props) => {
    let config = {};
    if (props.fps) config.fps = props.fps;
    if (props.qrbox) config.qrbox = props.qrbox;
    if (props.aspectRatio) config.aspectRatio = props.aspectRatio;
    if (props.disableFlip !== undefined) config.disableFlip = props.disableFlip;
    return config;
};

const Html5QrcodePlugin = (props) => {
    const scannerRef = useRef(null);
    const [scannerStarted, setScannerStarted] = useState(false);

    const startScanner = () => {
        if (!scannerStarted) {
            const config = createConfig(props);
            const verbose = props.verbose === true;

            if (!props.qrCodeSuccessCallback) {
                throw new Error("qrCodeSuccessCallback is required callback.");
            }

            scannerRef.current = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
            scannerRef.current.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);
            setScannerStarted(true);
        }
    };

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner. ", error);
                });
            }
        };
    }, []);

    return (
        <>
            <button onClick={startScanner}>📷 Lancer le scan</button>
            <div id={qrcodeRegionId} />
        </>
    );
};

export default Html5QrcodePlugin;
