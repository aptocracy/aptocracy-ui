import GovernanceItem from "../../../components/GovernanceItem/GovernanceItem";
import { organizationStore } from "../../../state/organizationStore";
import "./Governances.scss";

const Governances = () => {
  const { governances, organizationBasicInfo } = organizationStore();

  return (
    <div className="governances">
      {governances?.map((item) => (
        <GovernanceItem
          item={item}
          title={`Governance #${item.governanceId}`}
          isMain={item.governanceId === organizationBasicInfo?.mainGovernance}
        />
      ))}
    </div>
  );
};

export default Governances;
