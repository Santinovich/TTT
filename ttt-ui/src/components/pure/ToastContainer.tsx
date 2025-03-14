import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import "./ToastContainer.css"
import { ToastContext } from "../../context/ToastContext";

interface ToastProps {
  text: string;
  type?: "info" | "error";
}

function Toast({text, type = "info"}: ToastProps) {
  const icon = type === "info" ? faInfoCircle : faCircleXmark; 
  const [visible, setVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  const close = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setVisible(false);
    }, 250);
  };

  useEffect(() => {
    setTimeout(() => {
      close();
    }, 3000);
  })

    return (
      visible && <div className={isFadingOut ? "fade-out" : ""} onClick={close}>
        <div className={"toast-color " + type} />
        <FontAwesomeIcon icon={icon} size={"2x"}/>
        <div className="toast-content">
          <p>{text}</p>
        </div>
      </div>
    );
}

const ToastContainer = function() {
  const toastContext = useContext(ToastContext);
  if (toastContext) {
    return (
      <div className="toast-container">
        {toastContext.toasts.map((t) => (
          <Toast text={t.text} type={t.type} />
        ))}
      </div>
    );
  }
}

export default ToastContainer;
