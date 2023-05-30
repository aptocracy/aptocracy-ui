import { useFormikContext } from "formik";
import React, { Fragment } from "react";
import { useDropzone } from "react-dropzone";
import { ICreateOrgFields } from "../../../common/interfaces/org.interfaces";
import FormField from "../../../components/FormField/FormField";
import OptionTab from "../../../components/OptionTab/OptionTab";
import { uploadImage } from "../../../utilities/helpers";
import { formModel } from "../formConfig";
import removeIcon from "../../../assets/removeImg.svg";
import coverImg from "../../../assets/coverImg.png";

import { EMPTY_STRING } from "../../../common/constants/common.constants";
import "./CreateOrgBasicInfo.scss";
import MainButton from "../../../components/MainButton/MainButton";
import uploadIcon from "../../../assets/add_circle.svg";

enum InviteOptions {
  InviteOnly = "Invite only",
  OpenForMembers = "Open for new members",
}

const CreateOrgBasicInfo = () => {
  const { setFieldValue, values } = useFormikContext<ICreateOrgFields>();
  const reader = new FileReader();
  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => {
      uploadImage(acceptedFiles, reader, "orgImg", setFieldValue);
    },
  });

  const removeImage = async (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setFieldValue("orgImg", EMPTY_STRING);
  };
  return (
    <div className="create-org-basic-info">
      <div className="create-org-basic-info__upload-image">
        <div className="create-org-basic-info__image_container">
          <div className="create-org-basic-info__image" onClick={open}>
            {values.orgImg ? (
              <Fragment>
                <img
                  className="create-org-basic-info__avatar"
                  src={values.orgImg}
                  alt="Org avatar"
                />
                <img
                  className="create-org-basic-info__removeIcon"
                  src={removeIcon}
                  alt="Remove avatar"
                  onClick={removeImage}
                />
              </Fragment>
            ) : (
              <img
                src={coverImg}
                alt="Org avatar"
                className="create-org-basic-info__avatar"
              />
            )}
          </div>
        </div>
        <div
          {...getRootProps()}
          className="create-org-basic-info__upload-actions"
        >
          <input {...getInputProps()} />
          <button type="button" onClick={open}>
            <img src={uploadIcon} alt="Upload image" />
            Upload image
          </button>
          <p>
            Upload your Organization's avatar for better recognition. <br />
            Formats: png, jpg, gif. Max size: 2 MB
          </p>
        </div>
      </div>
      <FormField
        name={formModel.formFields.name.name}
        placeholder={formModel.formFields.name.label}
        type="text"
      />
      <FormField
        name={formModel.formFields.description.name}
        placeholder={formModel.formFields.description.label}
        type="text"
      />
      <OptionTab
        firstOption={InviteOptions.InviteOnly}
        secondOption={InviteOptions.OpenForMembers}
        activeOption={
          values.inviteOnly
            ? InviteOptions.InviteOnly
            : InviteOptions.OpenForMembers
        }
        onChange={(option: string) => {
          setFieldValue(
            formModel.formFields.inviteOnly.name,
            option === InviteOptions.InviteOnly
          );
        }}
      />
    </div>
  );
};

export default CreateOrgBasicInfo;
