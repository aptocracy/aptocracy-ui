import React, { FC, useMemo, useState } from "react";
import { organizationStore } from "../../../../state/organizationStore";
import { IOption } from "../../../../common/interfaces/org.interfaces";
import { getGovernanceOptions } from "../../../../utilities/helpers";
import Select, { ActionMeta, OnChangeValue, StylesConfig } from "react-select";
import { styles } from "../../../CreateOrg/CreateOrgRoleConfig/RoleItem/RoleItem";
import Modal from "../../../../components/Modal/Modal";
import "./SetupMainGovernance.scss";
import MainButton from "../../../../components/MainButton/MainButton";
import { createNotification } from "../../../../utilities/notification";
import { MESSAGE_TYPE } from "../../../../common/constants/common.constants";
import { setupMainGov } from "../../../../program/methods/organization";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getOrganizationBasicDataFromApi } from "../../../../api/graphql";

const SetupMainGovernance: FC<{ closeModal: () => void }> = ({
  closeModal,
}) => {
  const { governances, organizationBasicInfo, setOrganizationBasicInfo } =
    organizationStore();
  const [mainGov, setMainGov] = useState<IOption>();
  const { signAndSubmitTransaction } = useWallet();

  const governanceOptions: IOption[] | undefined = useMemo(() => {
    return getGovernanceOptions(governances);
  }, [governances]);

  const submitMainGov = async () => {
    try {
      if (organizationBasicInfo && mainGov) {
        await setupMainGov(
          organizationBasicInfo.address,
          Number(mainGov.value),
          signAndSubmitTransaction
        );
        setOrganizationBasicInfo(
          await getOrganizationBasicDataFromApi(organizationBasicInfo.address)
        );
        closeModal();
        createNotification(MESSAGE_TYPE.SUCCESS, "Main governance updated!");
      }
    } catch (error) {
      console.log(error);
      createNotification(MESSAGE_TYPE.ERROR, "Failed to setup main governane");
    }
  };

  return (
    <Modal title="Set up main governance" closeModal={closeModal}>
      <div className="setup-gov">
        <p>Chose governance from list</p>
        <Select
          value={mainGov}
          styles={styles}
          classNamePrefix="select"
          onChange={(e: any) => {
            setMainGov({
              isFixed: false,
              label: e.label,
              value: e.value,
            });
          }}
          options={governanceOptions}
        />
        <MainButton onClick={submitMainGov} type="button" light>
          Submit
        </MainButton>
      </div>
    </Modal>
  );
};

export default SetupMainGovernance;
