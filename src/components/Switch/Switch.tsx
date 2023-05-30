import { styled, Switch as MUISwitch } from "@mui/material";
import React, { FC } from "react";
import "./Switch.scss";

const MaterialUISwitch = styled(MUISwitch)(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-track": {
    backgroundColor: "#a2deed",
    borderRadius: 26 / 2,
  },
  "&.Mui-focusVisible .MuiSwitch-thumb": {
    color: "#33cf4d",
    border: "6px solid #fff",
  },
  "& .MuiSwitch-switchBase": {
    margin: 2,
    padding: 0,
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#a2deed",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
}));

const Switch: FC<{ label: string; onClick: (chacked: boolean) => void }> = ({
  label,
  onClick,
}) => {
  return (
    <div className="switch">
      <p>{label}</p>
      <MaterialUISwitch
        onClick={(value: any) => {
          onClick(value.target.checked);
        }}
      />
    </div>
  );
};

export default Switch;
