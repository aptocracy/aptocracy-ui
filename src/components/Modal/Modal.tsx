import React, { FC } from "react";

import close from "../../assets/close.svg";
import "./Modal.scss";

interface ModalProps {
  closeModal?: () => void;
  width?: string;
  children?: React.ReactNode;
  title?: string;
}

const Modal: FC<ModalProps> = (props) => {
  const onClose = () => {
    props.closeModal && props.closeModal();
  };

  return (
    <div className="modal" onMouseDown={onClose}>
      <div
        className="modal__content"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        style={{ width: `${props.width}` }}
      >
        <div className="modal__container">
          <div className="modal__header">
            <p>{props.title}</p>
            {props.closeModal && (
              <img
                className="modal__close-icon"
                src={close}
                alt="Close icon"
                onClick={onClose}
              />
            )}
          </div>
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
