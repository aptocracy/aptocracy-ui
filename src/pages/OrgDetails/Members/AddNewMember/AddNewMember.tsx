import React, { FC, useMemo, useState } from "react";
import Select from "react-select";
import { IOption } from "../../../../common/interfaces/org.interfaces";
import InputField from "../../../../components/InputField/InputField";
import MainButton from "../../../../components/MainButton/MainButton";
import Modal from "../../../../components/Modal/Modal";
import { organizationStore } from "../../../../state/organizationStore";
import { styles } from "../../../CreateOrg/CreateOrgRoleConfig/RoleItem/RoleItem";
import "./AddNewMember.scss";
import addRoleIcon from "../../../../assets/add_circle.svg";
import { addNewMember } from "../../../../program/methods/organization";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  getAllMembersFromApi,
  getMemberForAptocracyFromApi,
} from "../../../../api/graphql";
import { createNotification } from "../../../../utilities/notification";
import { MESSAGE_TYPE } from "../../../../common/constants/common.constants";

const AddNewMember: FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const [memberRole, setMemberRole] = useState<IOption>();
  const [memberAddress, setMemberAddress] = useState<string>();
  const { account, signAndSubmitTransaction } = useWallet();
  const { organizationBasicInfo, setMembersInfo, members } =
    organizationStore();

  const roleOptions: IOption[] | undefined = useMemo(() => {
    return organizationBasicInfo?.roleConfig
      .filter((item) => item.name !== "Owner")
      .map((item, index) => {
        return {
          value: index,
          label: item.name,
          isFixed: false,
        };
      });
  }, []);

  const addNewMemberHandler = async () => {
    try {
      if (memberAddress && memberRole && organizationBasicInfo) {
        await addNewMember(
          memberAddress,
          memberRole.label,
          organizationBasicInfo.address,
          signAndSubmitTransaction
        );
        createNotification(MESSAGE_TYPE.SUCCESS, "Member invited!");
        let updatedMembers = members ? [...members] : [];
        updatedMembers.push(
          await getMemberForAptocracyFromApi(
            organizationBasicInfo.address,
            memberAddress
          )
        );
        setMembersInfo(updatedMembers);

        closeModal();
      }
    } catch (error) {
      console.log(error);
      createNotification(MESSAGE_TYPE.ERROR, "Failed to invite member");
    }
  };

  return (
    <Modal title="Add new member" closeModal={closeModal}>
      <div className="add-new-member">
        <div className="add-new-member__fields">
          <InputField
            placeholder="Member address"
            onChange={(e) => {
              setMemberAddress(e);
            }}
            type="text"
            value={memberAddress}
          />
          <Select
            options={roleOptions}
            className="field__select"
            styles={styles}
            onChange={(e: any) => {
              setMemberRole({
                isFixed: false,
                label: e.label,
                value: e.value,
              });
            }}
            isSearchable={false}
            value={memberRole}
          />
        </div>
        <MainButton onClick={addNewMemberHandler} type="button" light>
          <img src={addRoleIcon} alt="Add role" />
          Add member
        </MainButton>
      </div>
    </Modal>
  );
};

export default AddNewMember;
