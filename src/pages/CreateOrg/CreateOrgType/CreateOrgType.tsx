import { useFormikContext } from "formik";
import React from "react";
import { OrganizationType } from "../../../common/enums/org.enum";
import { ICreateOrgFields } from "../../../common/interfaces/org.interfaces";
import FieldWithDescription from "../../../components/FieldWithDescription/FieldWithDescription";
import FormField from "../../../components/FormField/FormField";
import { formModel } from "../formConfig";

const CreateOrgType = () => {
  const { setFieldValue, values } = useFormikContext<ICreateOrgFields>();
  return (
    <div>
      <p>Chose organization type</p>
      <FieldWithDescription
        description={
          "t is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."
        }
        title={"Deposit based"}
        onClick={() =>
          setFieldValue(
            formModel.formFields.orgType.name,
            OrganizationType.DepositBased
          )
        }
        isChosen={values.orgType === OrganizationType.DepositBased}
      />
      <FieldWithDescription
        description={
          "t is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."
        }
        title={"Role based"}
        onClick={() =>
          setFieldValue(
            formModel.formFields.orgType.name,
            OrganizationType.RoleBased
          )
        }
        isChosen={values.orgType === OrganizationType.RoleBased}
      />
      <FieldWithDescription
        description={
          "t is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."
        }
        title={"Nft based"}
        onClick={() =>
          setFieldValue(
            formModel.formFields.orgType.name,
            OrganizationType.NftBased
          )
        }
        isChosen={values.orgType === OrganizationType.NftBased}
      />
      {values.orgType === OrganizationType.NftBased && (
        <div>
          <p>Define collection info</p>
          <FormField
            name={formModel.formFields.collectionName.name}
            placeholder={formModel.formFields.collectionName.label}
            type="text"
          />
          <FormField
            name={formModel.formFields.creatorAddress.name}
            placeholder={formModel.formFields.creatorAddress.label}
            type="text"
          />
          <FormField
            name={formModel.formFields.totalNfts.name}
            placeholder={formModel.formFields.totalNfts.label}
            type="text"
          />
        </div>
      )}
    </div>
  );
};

export default CreateOrgType;
