import React, { FC, useMemo, useState } from "react";
import Modal from "../../../../components/Modal/Modal";
import { organizationStore } from "../../../../state/organizationStore";
import Select from "react-select";
import { IOption } from "../../../../common/interfaces/org.interfaces";
import { styles } from "../../../CreateOrg/CreateOrgRoleConfig/RoleItem/RoleItem";
import "./AddTreasury.scss";
import {
  EMPTY_STRING,
  MESSAGE_TYPE,
} from "../../../../common/constants/common.constants";
import MainButton from "../../../../components/MainButton/MainButton";
import addRoleIcon from "../../../../assets/add_circle.svg";
import { addNewTreasury } from "../../../../program/methods/organization";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { createNotification } from "../../../../utilities/notification";
import { getGovernanceOptions } from "../../../../utilities/helpers";
import { getTreasuryByIndex } from "../../../../api/graphql";

const AddTreasury: FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const [governance, setGovernance] = useState<IOption | undefined>();
  const { governances, organizationBasicInfo, setTreasuryInfo, treasuries } =
    organizationStore();
  const { signAndSubmitTransaction } = useWallet();

  const governanceOptions: IOption[] | undefined = useMemo(() => {
    return getGovernanceOptions(governances);
  }, [governances]);

  const addTreasuryHandler = async () => {
    try {
      if (organizationBasicInfo && governance) {
        await addNewTreasury(
          organizationBasicInfo.address,
          Number(governance?.value),
          signAndSubmitTransaction
        );
        let updatedTreasuries = treasuries ? [...treasuries] : [];
        updatedTreasuries.push(
          await getTreasuryByIndex(
            organizationBasicInfo.address,
            treasuries?.length ? treasuries?.length + 1 : 1
          )
        );
        setTreasuryInfo(updatedTreasuries);
        closeModal();
        createNotification(
          MESSAGE_TYPE.SUCCESS,
          "Treasury successfully created"
        );
      }
    } catch (error) {
      console.log(error);
      createNotification(MESSAGE_TYPE.ERROR, "Failed to create treasury");
    }
  };

  return (
    <Modal closeModal={closeModal} title="Create treasury">
      <div className="add-treasury">
        <p className="add-treasury__title">Choose governance for treasury:</p>
        <Select
          options={governanceOptions}
          className="field__select"
          styles={styles}
          onChange={(e: any) => {
            setGovernance({
              isFixed: false,
              label: e.label,
              value: e.value,
            });
          }}
          isSearchable={false}
          value={governance}
        />
        <MainButton onClick={addTreasuryHandler} type="button" light>
          <img src={addRoleIcon} alt="Add role" />
          Add treasury
        </MainButton>
      </div>
    </Modal>
  );
};

export default AddTreasury;
