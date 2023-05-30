import React, { FC, useMemo, useState } from "react";
import Modal from "../../../../components/Modal/Modal";
import Select, { ActionMeta, OnChangeValue, StylesConfig } from "react-select";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { IOption } from "../../../../common/interfaces/org.interfaces";
import MainButton from "../../../../components/MainButton/MainButton";
import { organizationStore } from "../../../../state/organizationStore";
import { styles } from "../../../CreateOrg/CreateOrgRoleConfig/RoleItem/RoleItem";
import { getOrganizationBasicDataFromApi } from "../../../../api/graphql";
import { MESSAGE_TYPE } from "../../../../common/constants/common.constants";
import { createNotification } from "../../../../utilities/notification";
import { setupMainTreasury } from "../../../../program/methods/organization";

const SetupMainTreasury: FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const { treasuries, organizationBasicInfo, setOrganizationBasicInfo } =
    organizationStore();
  const [mainTreasury, setMainTreasury] = useState<IOption>();
  const { signAndSubmitTransaction } = useWallet();

  const treasuriesOptions: IOption[] | undefined = useMemo(() => {
    return treasuries?.map((item, index) => {
      return {
        value: item.treasuryAddress,
        label: `Treasury #${item.treasuryIndex}`,
        isFixed: false,
      };
    });
  }, [treasuries]);

  const submitMainTreasury = async () => {
    try {
      if (organizationBasicInfo && mainTreasury) {
        await setupMainTreasury(
          organizationBasicInfo.address,
          mainTreasury.value.toString(),
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
    <Modal title="Set up main treasury" closeModal={closeModal}>
      <div className="setup-gov">
        <p>Chose treasury from list</p>
        <Select
          value={mainTreasury}
          styles={styles}
          classNamePrefix="select"
          onChange={(e: any) => {
            setMainTreasury({
              isFixed: false,
              label: e.label,
              value: e.value,
            });
          }}
          options={treasuriesOptions}
        />
        <MainButton onClick={submitMainTreasury} type="button" light>
          Submit
        </MainButton>
      </div>
    </Modal>
  );
};

export default SetupMainTreasury;
