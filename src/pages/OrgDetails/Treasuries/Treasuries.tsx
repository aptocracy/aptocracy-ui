import { useNavigate } from "react-router";
import { TREASURY_DETAILS } from "../../../common/constants/routes.constants";
import { organizationStore } from "../../../state/organizationStore";
import { getTrimmedPublicKey } from "../../../utilities/helpers";
import "./Treasuries.scss";
import { APT_DECIMALS } from "../../../common/constants/common.constants";

const Treasuries = () => {
  const { treasuries, organizationBasicInfo } = organizationStore();
  const navigate = useNavigate();

  const goToTreasuryDetails = (treasuryIndex: number) => {
    navigate(
      `${TREASURY_DETAILS}/${organizationBasicInfo?.address}/${treasuryIndex}`
    );
  };

  return (
    <div className="treasuries">
      {treasuries?.map((item) => (
        <div
          className="treasuries__item"
          onClick={() => goToTreasuryDetails(item.treasuryIndex)}
        >
          <p className="treasuries__item-title">
            Treasury #{item.treasuryIndex}{" "}
            <span>
              {organizationBasicInfo?.mainTreasury === item.treasuryAddress &&
                `(main)`}
            </span>
          </p>
          <p className="treasuries__item-balance">
            Deposited: {item.depositedAmount / APT_DECIMALS} APT
          </p>
          <p className="treasuries__item-address">
            Address: {getTrimmedPublicKey(item.treasuryAddress)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Treasuries;
