import { useFormikContext } from "formik";
import { FC } from "react";
import {
  ICreateTreasuryProposalFields,
  IGovernance,
  ISelectOption,
  ITreasury,
} from "../../../common/interfaces/org.interfaces";
import FormField from "../../FormField/FormField";
import SelectFieldWithDescription from "../../SelectFieldWithDescription/SelectFieldWithDescription";
import { formModel } from "../formConfig";
import "./CreateProposalForm.scss";
import { ProposalType } from "../../../common/enums/org.enum";
import CustomProposal from "../CustomProposal/CustomProposal";
import UpdateMainTreasuryProposal from "../UpdateMainTreasuryProposal/UpdateMainTreasuryProposal";
import ChangeGovernanceConfigProposal from "../ChangeGovernanceConfigProposal/ChangeGovernanceConfigProposal";
import UpdateMainGovernanceProposal from "../UpdateMainGovernanceProposal/UpdateMainGovernanceProposal";
import TransferProposal from "../TransferProposal/TransferProposal";
import WithdrawalProposal from "../WithdrawalProposal/WithdrawalProposal";
import DiscussionProposal from "../DiscussionProposal/DiscussionProposal";

const CreateProposalForm: FC<{
  proposalTypeOptions: ISelectOption[];
  governances?: IGovernance[];
  treasuries?: ITreasury[];
}> = ({ proposalTypeOptions, governances, treasuries }) => {
  const { values, setFieldValue } =
    useFormikContext<ICreateTreasuryProposalFields>();

  const renderProposalTypeSpecificFields = () => {
    switch (values.proposalType) {
      case ProposalType.Discussion:
        return <DiscussionProposal />;
      case ProposalType.Withdrawal:
        return <WithdrawalProposal />;
      case ProposalType.Transfer:
        return <TransferProposal />;
      case ProposalType.UpdateMainGovernance:
        return <UpdateMainGovernanceProposal governances={governances} />;
      case ProposalType.ChangeGovernanceConfig:
        return <ChangeGovernanceConfigProposal governances={governances} />;
      case ProposalType.UpdateMainTreasury:
        return <UpdateMainTreasuryProposal treasuries={treasuries} />;
      case ProposalType.UserDefined:
        return <CustomProposal />;
    }
  };

  return (
    <div className="create-proposal-form">
      <SelectFieldWithDescription
        options={proposalTypeOptions}
        chosenOption={
          proposalTypeOptions.find(
            (item) => item.value === values.proposalType
          ) ?? proposalTypeOptions[0]
        }
        onSelect={(value) =>
          setFieldValue(formModel.formFields.proposalType.name, value)
        }
      />
      <p className="create-proposal-form__title">Information</p>
      <FormField
        name={formModel.formFields.title.name}
        placeholder={formModel.formFields.title.label}
        type="text"
      />
      <FormField
        name={formModel.formFields.description.name}
        placeholder={formModel.formFields.description.label}
        type="text"
      />
      {renderProposalTypeSpecificFields()}
      {values.proposalType !== ProposalType.UserDefined && (
        <FormField
          name={formModel.formFields.discussionLink.name}
          placeholder={formModel.formFields.discussionLink.label}
          type="text"
        />
      )}
    </div>
  );
};

export default CreateProposalForm;
