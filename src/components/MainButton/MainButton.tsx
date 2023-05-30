import { FC, ReactNode } from "react";
import { Oval } from "react-loader-spinner";
import "./MainButton.scss";

const MainButton: FC<{
  onClick: () => void;
  light?: boolean;
  disabled?: boolean;
  submitting?: boolean;
  type: "button" | "submit" | "reset" | undefined;
  children?: ReactNode;
}> = ({ onClick, light, children, type, disabled, submitting }) => {
  return (
    <button
      className={`main-button ${light && "main-button--light"} ${
        submitting && "main-button--loading"
      }`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
      {submitting && (
        <div className="main-button__loader">
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

export default MainButton;
