import React, { useEffect, useState } from "react";
import { getOrganizationsFromApi } from "../../api/graphql";
import { IOrganizationBasicData } from "../../common/interfaces/org.interfaces";
import OrgCard from "../../components/OrgCard/OrgCard";
import "./BrowseOrg.scss";

const BrowseOrg = () => {
  const [organizations, setOrganizations] =
    useState<IOrganizationBasicData[]>();

  useEffect(() => {
    void getOrganizations();
  }, []);

  const getOrganizations = async () => {
    try {
      const response = await getOrganizationsFromApi();
      setOrganizations(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="browse-org">
      {organizations?.map((item) => (
        <OrgCard name={item.name} address={item.address} orgImg={item.image} />
      ))}
    </div>
  );
};

export default BrowseOrg;
