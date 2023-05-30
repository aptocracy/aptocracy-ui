import { create } from "zustand";
import {
  IGovernance,
  IMemberInfo,
  IOrganizationBasicData,
  IProposalInfo,
  ITreasury,
} from "../common/interfaces/org.interfaces";

interface IOrganizationStoreData {
  organizationBasicInfo: IOrganizationBasicData | undefined;
  members: IMemberInfo[] | undefined;
  governances: IGovernance[] | undefined;
  treasuries: ITreasury[] | undefined;
  organizationProposals: IProposalInfo[] | undefined;
}

interface IOrganizationStore extends IOrganizationStoreData {
  setOrganizationBasicInfo: (organization: IOrganizationBasicData) => void;
  setMembersInfo: (members: IMemberInfo[]) => void;
  setGovernancesInfo: (governances: IGovernance[]) => void;
  setTreasuryInfo: (treasuries: ITreasury[]) => void;
  setProposals: (proposals: IProposalInfo[]) => void;
  updateProposal: (proposal: IProposalInfo) => void;
  updateGovernance: (governance: IGovernance) => void;
  updateMember: (member: IMemberInfo) => void;
  resetStore: () => void;
}

const initialState: IOrganizationStoreData = {
  organizationBasicInfo: undefined,
  members: undefined,
  governances: undefined,
  treasuries: undefined,
  organizationProposals: undefined,
};

export const organizationStore = create<IOrganizationStore>((set, get) => ({
  ...initialState,
  setOrganizationBasicInfo: (
    organization: IOrganizationBasicData | undefined
  ) => set(() => ({ organizationBasicInfo: organization })),
  setMembersInfo: (members: IMemberInfo[]) =>
    set(() => ({
      members,
    })),
  setGovernancesInfo: (governances: IGovernance[]) =>
    set(() => ({
      governances,
    })),
  setTreasuryInfo: (treasuries: ITreasury[]) =>
    set(() => ({
      treasuries,
    })),
  resetStore: () => set(() => initialState),
  updateProposal: (proposal: IProposalInfo) => {
    if (get().organizationProposals !== undefined) {
      const proposals = [...get().organizationProposals!];
      const proposalIndex = proposals.findIndex(
        (item) => item.proposalId === proposal.proposalId
      );
      proposals[proposalIndex] = proposal;
      set({
        organizationProposals: proposals,
      });
    }
  },
  setProposals: (proposals: IProposalInfo[]) =>
    set(() => ({ organizationProposals: proposals })),
  updateGovernance: (governance: IGovernance) => {
    if (get().governances !== undefined) {
      const governances = [...get().governances!];
      const governanceIndex = governances.findIndex(
        (item) => item.governanceId === governance.governanceId
      );
      governances[governanceIndex] = governance;
      set({
        governances: governances,
      });
    }
  },
  updateMember: (member: IMemberInfo) => {
    if (get().members !== undefined) {
      debugger;
      const members = [...get().members!];
      const memberIndex = members.findIndex(
        (item) => item.memberAddress === member.memberAddress
      );
      members[memberIndex] = member;
      set({
        members: members,
      });
    }
  },
}));
