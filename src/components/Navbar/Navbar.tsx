import React, { FC } from "react";
import "./Navbar.scss";
import logo from "../../assets/aptosLogo1.svg";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import {
  BROWSE_ORGANIZATIONS,
  CREATE_ORGANIZATION,
} from "../../common/constants/routes.constants";
import { Link } from "react-router-dom";

const Navbar: FC = () => {
  return (
    <div className="navbar">
      <img src={logo} className="navbar__logo" alt="Aptocracy logo" />
      <div className="navbar__items">
        <ul>
          <li>
            <Link to={`${CREATE_ORGANIZATION}`}>Create organization</Link>
          </li>
          <li>
            <Link to={`${BROWSE_ORGANIZATIONS}`}>Home</Link>
          </li>
        </ul>
        <WalletSelector />
      </div>
    </div>
  );
};

export default Navbar;
