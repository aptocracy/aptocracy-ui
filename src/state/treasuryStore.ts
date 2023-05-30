import { create } from "zustand";
import {
  IDepositRecord,
  IGovernance,
  IMemberInfo,
  IMemberRights,
  IOrganizationBasicData,
  IProposalInfo,
  ITreasury,
} from "../common/interfaces/org.interfaces";

interface ITreasuryStoreData {
  treasury: ITreasury | undefined;
  treasuryGovernance: IGovernance | undefined;
  organizationBasicInfo: IOrganizationBasicData | undefined;
  treasuryBalance: number | undefined;
  depositRecords: IDepositRecord[] | undefined;
  memberRights: IMemberRights | undefined;
  proposals: IProposalInfo[] | undefined;
}

interface ITreasuryStore extends ITreasuryStoreData {
  setTreasury: (treasury: ITreasury) => void;
  setTreasuryGovernance: (governane: IGovernance) => void;
  setOrganizationBasicInfo: (organization: IOrganizationBasicData) => void;
  setTreasuryBalance: (treasuryBalance: number) => void;
  setDepositRecords: (depositRecords: IDepositRecord[]) => void;
  setMemberRights: (memberRights: IMemberRights) => void;
  setProposals: (proposals: IProposalInfo[]) => void;
  updateProposal: (proposal: IProposalInfo) => void;
  resetStore: () => void;
}

const initialState: ITreasuryStoreData = {
  treasury: undefined,
  treasuryGovernance: undefined,
  organizationBasicInfo: undefined,
  treasuryBalance: undefined,
  depositRecords: undefined,
  memberRights: undefined,
  proposals: undefined,
};

export const treasuryStore = create<ITreasuryStore>((set, get) => ({
  ...initialState,
  setOrganizationBasicInfo: (organization: IOrganizationBasicData) =>
    set(() => ({ organizationBasicInfo: organization })),
  setTreasury: (treasury: ITreasury) => set(() => ({ treasury })),
  setTreasuryGovernance: (governance: IGovernance) =>
    set(() => ({ treasuryGovernance: governance })),
  setTreasuryBalance: (treasuryBalance: number) =>
    set(() => ({ treasuryBalance })),
  setDepositRecords: (depositRecords: IDepositRecord[]) =>
    set(() => ({ depositRecords })),
  setMemberRights: (memberRights: IMemberRights) =>
    set(() => ({ memberRights })),
  setProposals: (proposals: IProposalInfo[]) => set(() => ({ proposals })),
  updateProposal: (proposal: IProposalInfo) => {
    if (get().proposals !== undefined) {
      const proposals = [...get().proposals!];
      const proposalIndex = proposals.findIndex(
        (item) => item.proposalId === proposal.proposalId
      );
      proposals[proposalIndex] = proposal;
      set({
        proposals,
      });
    }
  },
  resetStore: () => set(() => initialState),
}));
