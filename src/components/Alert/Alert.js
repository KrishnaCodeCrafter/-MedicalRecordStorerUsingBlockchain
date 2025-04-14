import React, { useRef, useEffect, useState } from "react";
import "./alert.css";
import { useSelector } from "react-redux";
import config from "../../config.json";
import { myEventsSelector } from "../../store/selectors";

const Alert = () => {
  const event = useSelector(myEventsSelector);
  const isPending = useSelector((state) => state.medical.transaction.isPending);
  const isError = useSelector((state) => state.medical.transaction.isError);
  const chainId = useSelector((state) => state.provider.chainId);

  const overlayRef = useRef(null);
  const alertRef = useRef(null);

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (event[0]) {
      // Show only if a new event has arrived after mount
      setShowSuccess(true);
    }
  }, [event]);

  const removeHandler = () => {
    alertRef.current?.classList.add("hide");
    overlayRef.current?.classList.add("hide");
    setShowSuccess(false); // hide success alert after dismissed
  };

  const renderAlert = (type, message, txHash = null) => (
    <div className="alert" onClick={removeHandler}>
      <div className="overlay" ref={overlayRef}></div>
      <div className={`alertBox ${type}`} ref={alertRef}>
        <h2>{message}</h2>
        {txHash && (
          <div className="transactionHashOut">
            <a
              className="transactionHash"
              href={
                config[chainId]
                  ? `${config[chainId].explorerURL}tx/${txHash}`
                  : "#"
              }
              target="_blank"
              rel="noreferrer"
            >
              {txHash.slice(0, 6) + "..." + txHash.slice(-6)}
            </a>
          </div>
        )}
      </div>
    </div>
  );

  if (isPending) return renderAlert("pending", "Transaction Pending...");
  if (isError) return renderAlert("error", "Transaction Failed");
  if (showSuccess && event[0]) {
    return renderAlert("success", "Transaction Successful", event[0].transactionHash);
  }

  return null;
};

export default Alert;
