import { Form, Formik } from "formik";
import React, { FC, useMemo, useState } from "react";
import { ICreateOrgFields } from "../../common/interfaces/org.interfaces";
import { formModel } from "./formConfig";
import "./CreateOrg.scss";
import { CreateOrgSteps, OrganizationType } from "../../common/enums/org.enum";
import {
  CREATE_ORG_TOTAL_STEPS,
  EMPTY_STRING,
} from "../../common/constants/common.constants";
import FormField from "../../components/FormField/FormField";
import CreateOrgBasicInfo from "./CreateOrgBasicInfo/CreateOrgBasicInfo";
import { useNavigate } from "react-router";
import {
  BROWSE_ORGANIZATIONS,
  ORG_DETAILS,
} from "../../common/constants/routes.constants";
import CreateOrgType from "./CreateOrgType/CreateOrgType";
import CreateOrgRoleConfig from "./CreateOrgRoleConfig/CreateOrgRoleConfig";
import CreateOrgGovernance from "./CreateOrgGovernance/CreateOrgGovernance";
import CreateOrgTreasury from "./CreateOrgTreasury/CreateOrgTreasury";
import PreviewOrg from "./PreviewOrg/PreviewOrg";
import { validateCreateOrganizationForm } from "./validators";
import { createOrganization } from "../../program/methods/organization";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import MainButton from "../../components/MainButton/MainButton";
import { updateImageAndDescriptionForOrganization } from "../../api/graphql";
import { TokenClient } from "aptos";
import { provider } from "../../program/utils";

const CreateOrg: FC = () => {
  const [activeStep, setActiveStep] = useState<CreateOrgSteps>(
    CreateOrgSteps.BasicInfo
  );
  const [customErrorMessage, setCustomErrorMessage] = useState<string>();
  const navigate = useNavigate();
  const { account, signAndSubmitTransaction, wallet } = useWallet();

  const initialValues: ICreateOrgFields = useMemo(() => {
    return {
      orgType: formModel.formFields.orgType.initialValue,
      collectionName: formModel.formFields.collectionName.initialValue,
      inviteOnly: formModel.formFields.inviteOnly.initialValue,
      name: formModel.formFields.name.initialValue,
      roleConfig: formModel.formFields.roleConfig.initialValue,
      totalNfts: formModel.formFields.totalNfts.initialValue,
      description: formModel.formFields.description.initialValue,
      approvalQuorum: formModel.formFields.approvalQuorum.initialValue,
      earlyTipping: formModel.formFields.earlyTipping.initialValue,
      maxVotingTime: formModel.formFields.maxVotingTime.initialValue,
      quorum: formModel.formFields.quorum.initialValue,
      treasuryApprovalQuorum:
        formModel.formFields.treasuryApprovalQuorum.initialValue,
      treasuryEarlyTipping:
        formModel.formFields.treasuryEarlyTipping.initialValue,
      treasuryMaxVotingTime:
        formModel.formFields.treasuryMaxVotingTime.initialValue,
      treasuryQuorum: formModel.formFields.treasuryQuorum.initialValue,
      orgImg: formModel.formFields.orgImg.initialValue,
      creatorAddress: formModel.formFields.creatorAddress.initialValue,
    };
  }, []);

  const updateOrgAfterCreationAndGoToDetails = async (
    organizationAddress: string,
    orgImg: string,
    description: string
  ) => {
    await updateImageAndDescriptionForOrganization(
      organizationAddress.toString(),
      orgImg,
      description
    );
    navigate(`${ORG_DETAILS}/${organizationAddress}`);
  };

  const handleSubmit = async (values: ICreateOrgFields) => {
    if (activeStep === CreateOrgSteps.Preview) {
      //TODO: add submit tx
      if (account?.address) {
        const organizationAddress = await createOrganization(
          values,
          account?.address,
          signAndSubmitTransaction,
          updateOrgAfterCreationAndGoToDetails
        );
      }
    } else {
      if (
        activeStep === CreateOrgSteps.OrgType &&
        values.orgType === OrganizationType.NftBased
      ) {
        if (values.creatorAddress && values.collectionName) {
          try {
            //Check async
            const collectionInfo = await new TokenClient(
              provider.aptosClient
            ).getCollectionData(values.creatorAddress, values.collectionName);
          } catch (error) {
            setCustomErrorMessage("Collection doesnt exists");
            return;
          }
        }
      }
      setCustomErrorMessage(EMPTY_STRING);
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === CreateOrgSteps.BasicInfo) {
      navigate(BROWSE_ORGANIZATIONS);
    } else {
      setActiveStep(activeStep - 1);
    }
  };

  const renderCreateOrgStep = () => {
    switch (activeStep) {
      case CreateOrgSteps.BasicInfo:
        return <CreateOrgBasicInfo />;
      case CreateOrgSteps.OrgType:
        return <CreateOrgType />;
      case CreateOrgSteps.RoleConfig:
        return <CreateOrgRoleConfig />;
      case CreateOrgSteps.OrganizationRules:
        return <CreateOrgGovernance />;
      case CreateOrgSteps.Treasury:
        return <CreateOrgTreasury />;
      case CreateOrgSteps.Preview:
        return <PreviewOrg />;
      default:
        return <></>;
    }
  };

  return (
    <div className="create-org">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validate={(values) =>
          validateCreateOrganizationForm(values, activeStep)
        }
        validateOnBlur
      >
        {({ isSubmitting }) => {
          return (
            <div className="create-org__form">
              <Form id={formModel.formId}>
                <div className="create-org__form-header">
                  <h3>Create organization</h3>
                  <p className="create-org__form-header-step">
                    {activeStep + 1}/{CREATE_ORG_TOTAL_STEPS}
                  </p>
                </div>
                {renderCreateOrgStep()}
                <p className="create-org__custom-error">{customErrorMessage}</p>
                <div className="create-org__buttons">
                  <MainButton type="button" onClick={handleBack} light>
                    {activeStep === CreateOrgSteps.BasicInfo
                      ? "Cancel"
                      : "Back"}
                  </MainButton>
                  <MainButton
                    onClick={() => {}}
                    type="submit"
                    submitting={isSubmitting}
                  >
                    {activeStep === CreateOrgSteps.Preview ? "Submit" : "Next"}
                  </MainButton>
                </div>
              </Form>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

export default CreateOrg;
