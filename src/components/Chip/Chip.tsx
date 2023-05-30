import { FC } from "react";
import "./Chip.scss";

const Chip: FC<{
  text: string;
  backgroundColor?: string;
  fontSize?: number;
  padding?: number;
}> = ({ text, backgroundColor, padding, fontSize }) => {
  return (
    <div
      className="chip"
      style={{
        backgroundColor: backgroundColor ?? "#e9e9e9",
        fontSize: `${fontSize}em` ?? "0.875em",
        padding: `${padding}em` ?? "0.75em",
      }}
    >
      <p>{text}</p>
    </div>
  );
};

export default Chip;
