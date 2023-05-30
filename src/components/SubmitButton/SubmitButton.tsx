import React, { FC, ReactNode } from "react";
import { Oval } from "react-loader-spinner";
import "./SubmitButton.scss";

interface ISubmitButton {
  onClick: (e?: any) => void;
  className: string;
  submitting: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  children?: ReactNode;
}

const SubmitButton: FC<ISubmitButton> = (props) => {
  return (
    <button
      onClick={props.onClick}
      className={`${props.className} ${
        props.submitting
          ? "submit-button submit-button--loading"
          : "submit-button"
      }`}
      disabled={props.disabled}
      type={props.type ? props.type : "button"}
      style={props.submitting ? { color: "transparent" } : undefined}
    >
      {props.children}
      {props.submitting && (
        <div className="submit-button__loader">
          <Oval
            color="#ffffff"
            height={18}
            width={18}
            strokeWidth={5}
            secondaryColor="#b6b9be"
          />
        </div>
      )}
    </button>
  );
};

export default SubmitButton;
