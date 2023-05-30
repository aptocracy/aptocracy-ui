import React, {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams } from "react-router";
import {
  getAllGovernancesFromApi,
  getAllMembersFromApi,
  getAllTreasuriesFromApi,
  getMemberForAptocracyFromApi,
  getOrganizationBasicDataFromApi,
} from "../../api/graphql";
import { IOrganizationBasicData } from "../../common/interfaces/org.interfaces";
import { organizationStore } from "../../state/organizationStore";
import "./OrgDetails.scss";
import { checkActionForRole } from "../../utilities/helpers";
import {
  MemberStatus,
  OrgActions,
  OrganizationDetailsTabs,
} from "../../common/enums/org.enum";
import {
  EMPTY_STRING,
  organizationProposalOptions,
} from "../../common/constants/common.constants";
import Members from "./Members/Members";
import MainButton from "../../components/MainButton/MainButton";
import addRoleIcon from "../../assets/add_circle.svg";
import Treasuries from "./Treasuries/Treasuries";
import Governances from "./Governances/Governances";
import Roles from "./Roles/Roles";
import AddNewMember from "./Members/AddNewMember/AddNewMember";
import AddGovernance from "./Governances/AddGovernance/AddGovernance";
import AddTreasury from "./Treasuries/AddTreasury/AddTreasury";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { acceptInvitation } from "../../program/methods/organization";
import OrgProposals from "./OrgProposals/OrgProposals";
import CreateProposal from "../../components/CreateProposal/CreateProposal";
import AboutOrg from "./AboutOrg/AboutOrg";

const OrgDetails: FC = () => {
  const {
    organizationBasicInfo,
    setOrganizationBasicInfo,
    members,
    setMembersInfo,
    resetStore,
    organizationProposals,
    setProposals,
    treasuries,
    governances,
    setTreasuryInfo,
    setGovernancesInfo,
    updateMember,
  } = organizationStore();
  const params = useParams();
  const [activeTab, setActiveTab] = useState(OrganizationDetailsTabs.Members);
  const [addMemberModalActive, toggleAddMemberModal] = useState(false);
  const [addGovernanceModalActive, toggleAddGovernanceModal] = useState(false);
  const [addTreasuryModalActive, toggleAddTreasuryModal] = useState(false);
  const [addProposalModalActive, toggleAddProposalModal] = useState(false);

  const { account, signAndSubmitTransaction } = useWallet();

  useEffect(() => {
    void getBasicOrganizationInfo();
    return () => {
      resetStore();
    };
  }, [params.orgAddress]);

  const getBasicOrganizationInfo = async () => {
    try {
      if (!params.orgAddress) {
        return;
      }
      const organization: IOrganizationBasicData =
        await getOrganizationBasicDataFromApi(params.orgAddress);

      setGovernancesInfo(await getAllGovernancesFromApi(params.orgAddress));

      setTreasuryInfo(await getAllTreasuriesFromApi(params.orgAddress));

      setOrganizationBasicInfo(organization);
    } catch (error) {
      console.log(error);
    }
  };

  const renderTabComponents = useCallback(() => {
    switch (activeTab) {
      case OrganizationDetailsTabs.Members:
        return <Members />;
      case OrganizationDetailsTabs.Treasuries:
        return <Treasuries />;
      case OrganizationDetailsTabs.Governances:
        return <Governances />;
      case OrganizationDetailsTabs.Roles:
        return <Roles />;
      case OrganizationDetailsTabs.Proposals:
        return <OrgProposals />;
      default:
        return EMPTY_STRING;
    }
  }, [activeTab]);

  const renderActionButton = () => {
    switch (activeTab) {
      case OrganizationDetailsTabs.Members:
        return setupActionButton(
          () => toggleAddMemberModal(true),
          OrgActions.InviteMember,
          "Add members"
        );
      case OrganizationDetailsTabs.Governances:
        return setupActionButton(
          () => toggleAddGovernanceModal(true),
          OrgActions.CreateGovernance,
          "Add governance"
        );
      case OrganizationDetailsTabs.Treasuries:
        return setupActionButton(
          () => toggleAddTreasuryModal(true),
          OrgActions.CreateTreasury,
          "Add treasury"
        );
      case OrganizationDetailsTabs.Proposals:
        return setupActionButton(
          () => toggleAddProposalModal(true),
          OrgActions.CreateProposal,
          "Add organization proposal",
          !organizationBasicInfo?.mainGovernance ||
            !organizationBasicInfo?.mainTreasury
        );
      default:
        return EMPTY_STRING;
    }
  };

  const setupActionButton = (
    onClickAction: () => void,
    action: OrgActions,
    title: string,
    additionalDisabled?: boolean
  ) => {
    return (
      <MainButton
        onClick={onClickAction}
        type="button"
        light
        disabled={
          !checkActionForRole(
            members,
            account?.address,
            action,
            organizationBasicInfo!.roleConfig
          ) || additionalDisabled
        }
      >
        <img src={addRoleIcon} alt="Add role" />
        {title}
      </MainButton>
    );
  };

  const renderTabButton = useMemo(() => {
    return Object.keys(OrganizationDetailsTabs).map((item) => {
      return (
        <button
          className={`org-details__tab ${
            activeTab === item && "org-details__tab--active"
          }`}
          onClick={() => setActiveTab(item as OrganizationDetailsTabs)}
        >
          {item}
        </button>
      );
    });
  }, [activeTab]);

  const acceptInvitationHandler = async () => {
    try {
      if (organizationBasicInfo && account) {
        await acceptInvitation(
          organizationBasicInfo?.address,
          signAndSubmitTransaction
        );
        console.log(account?.address);
        updateMember(
          await getMemberForAptocracyFromApi(
            organizationBasicInfo?.address,
            account?.address
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const memberInvitation = members?.find(
    (item) =>
      item.memberAddress === account?.address &&
      item.aptocracyAddress === organizationBasicInfo?.address &&
      item.status === MemberStatus.Pending
  );

  const mainTreasuryInfo = useMemo(() => {
    return treasuries?.find(
      (item) => item.treasuryAddress === organizationBasicInfo?.mainTreasury
    );
  }, [treasuries, organizationBasicInfo]);

  return (
    <Fragment>
      {addMemberModalActive && (
        <AddNewMember closeModal={() => toggleAddMemberModal(false)} />
      )}
      {addGovernanceModalActive && (
        <AddGovernance closeModal={() => toggleAddGovernanceModal(false)} />
      )}
      {addTreasuryModalActive && (
        <AddTreasury closeModal={() => toggleAddTreasuryModal(false)} />
      )}
      {addProposalModalActive && (
        <CreateProposal
          closeModal={() => toggleAddProposalModal(false)}
          proposals={organizationProposals}
          setProposals={setProposals}
          treasury={mainTreasuryInfo}
          proposalTypeOptions={organizationProposalOptions}
          governances={governances}
          treasuries={treasuries}
        />
      )}

      <div className="org-details">
        {organizationBasicInfo && (
          <Fragment>
            {memberInvitation && (
              <div className="org-details__invitation">
                <p>
                  You are invited to join this organization as{" "}
                  {memberInvitation.role}
                </p>
                <MainButton onClick={acceptInvitationHandler} type="button">
                  Accept invitation
                </MainButton>
              </div>
            )}
            <AboutOrg />
            <div className="org-details__actions">
              <div className="org-details__tabs">{renderTabButton}</div>
              <div className="org-details__actions">{renderActionButton()}</div>
            </div>
            {renderTabComponents()}
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default OrgDetails;
