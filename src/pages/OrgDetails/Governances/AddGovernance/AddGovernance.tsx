import React, { FC, useState } from "react";
import InputField from "../../../../components/InputField/InputField";
import MainButton from "../../../../components/MainButton/MainButton";
import Modal from "../../../../components/Modal/Modal";
import Switch from "../../../../components/Switch/Switch";
import "./AddGovernance.scss";
import addRoleIcon from "../../../../assets/add_circle.svg";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { addNewGovernance } from "../../../../program/methods/organization";
import { organizationStore } from "../../../../state/organizationStore";
import {
  getAllGovernancesFromApi,
  getGovernanceId,
} from "../../../../api/graphql";
import {
  EMPTY_STRING,
  MESSAGE_TYPE,
} from "../../../../common/constants/common.constants";
import {
  validateMaxVotingTime,
  validateQuorumValues,
} from "../../../../utilities/helpers";
import { createNotification } from "../../../../utilities/notification";

const AddGovernance: FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const [approvalQuorum, setApprovalQuorum] = useState();
  const [quorum, setQuorum] = useState();
  const [maxVotingTime, setMaxVotingTime] = useState();
  const [earlyTipping, setEarlyTipping] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>();

  const { signAndSubmitTransaction } = useWallet();

  const { organizationBasicInfo, setGovernancesInfo, governances } =
    organizationStore();

  const addGovernanceHandler = async () => {
    try {
      if (
        organizationBasicInfo &&
        maxVotingTime &&
        approvalQuorum &&
        quorum &&
        earlyTipping !== undefined &&
        (!errors ||
          (errors.approvalQuorum === EMPTY_STRING &&
            errors.quorum === EMPTY_STRING &&
            errors.maxVotingTime === EMPTY_STRING))
      ) {
        await addNewGovernance(
          organizationBasicInfo?.address,
          maxVotingTime,
          approvalQuorum,
          quorum,
          earlyTipping,
          signAndSubmitTransaction
        );

        const updatedGovernances = governances ? [...governances] : [];
        updatedGovernances.push(
          await getGovernanceId(
            organizationBasicInfo.address,
            governances?.length ? governances.length + 1 : 1
          )
        );

        setGovernancesInfo(updatedGovernances);
        createNotification(
          MESSAGE_TYPE.SUCCESS,
          "Governance successfully created"
        );
        closeModal();
      }
    } catch (error) {
      console.log(error);
      createNotification(MESSAGE_TYPE.ERROR, "Failed to create governance");
    }
  };

  const validateGovernance = () => {
    const errors: any = {};
    errors.quorum = validateQuorumValues(quorum);
    errors.approvalQuorum = validateQuorumValues(approvalQuorum);
    errors.maxVotingTime = validateMaxVotingTime(maxVotingTime);
    setErrors(errors);
  };

  return (
    <Modal closeModal={closeModal} title="Add governance">
      <div className="add-governance">
        <InputField
          onChange={(value) => {
            setErrors({
              ...errors,
              approvalQuorum: validateQuorumValues(value),
            });
            setApprovalQuorum(value);
          }}
          placeholder="Approval quorum"
          type="number"
          value={approvalQuorum}
          error={errors?.approvalQuorum}
        />
        <InputField
          onChange={(value) => {
            setErrors({
              ...errors,
              quorum: validateQuorumValues(value),
            });
            setQuorum(value);
          }}
          placeholder="Quorum"
          type="number"
          value={quorum}
          error={errors?.quorum}
        />
        <InputField
          onChange={(value) => {
            setErrors({
              ...errors,
              maxVotingTime: validateMaxVotingTime(value),
            });
            setMaxVotingTime(value);
          }}
          placeholder="Max voting time"
          type="number"
          value={maxVotingTime}
          error={errors?.maxVotingTime}
        />
        <Switch
          onClick={(value) => {
            setEarlyTipping(value);
          }}
          label="Early tipping"
        />
        <MainButton
          onClick={() => {
            validateGovernance();
            addGovernanceHandler();
          }}
          type="button"
          light
        >
          <img src={addRoleIcon} alt="Add role" />
          Add governance
        </MainButton>
      </div>
    </Modal>
  );
};

export default AddGovernance;
