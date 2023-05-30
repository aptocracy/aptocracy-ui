import { Types } from "aptos";
import { saveScript } from "../../api/executeScripts";
import { getAllMembersFromApi } from "../../api/graphql";
import { APT_DECIMALS } from "../../common/constants/common.constants";
import { ParamType } from "../../common/enums/org.enum";
import { IScriptParams } from "../../common/interfaces/org.interfaces";
import { serializeValuBasedOnType } from "../../utilities/helpers";
import { orgModuleAddress, provider } from "../utils";
import {
  changeGovernanceProposalHash,
  transferProposalHash,
  updateMainGovernanceProposalHash,
  updateMainTreasuryProposalHash,
  withdrawProposalHash,
} from "../../common/constants/scriptHashes.constants";

export const createDiscussionProposal = async (
  orgAddress: string,
  treasuryAddress: string,
  name: string,
  description: string,
  options: string[],
  discussionLink: string,
  maxVoterOptions: number,
  signAndSubmitTransaction: <T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ) => Promise<any>
) => {
  try {
    const discussionProposalPayload = {
      type: "entry_function_payload",
      function: `${orgModuleAddress}::aptocracy::create_discussion_proposal`,
      type_arguments: [],
      arguments: [
        orgAddress,
        treasuryAddress,
        name,
        description,
        options,
        discussionLink,
        maxVoterOptions,
      ],
    };
    const response = await signAndSubmitTransaction(discussionProposalPayload);
    const result = await provider.waitForTransactionWithResult(response.hash);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createTransferProposal = async (
  orgAddress: string,
  treasuryAddress: string,
  name: string,
  description: string,
  discussionLink: string,
  transferAddress: string,
  transferAmount: number,
  signAndSubmitTransaction: <T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ) => Promise<any>
) => {
  try {
    const transferProposalPayload = {
      type: "entry_function_payload",
      function: `${orgModuleAddress}::aptocracy::create_transfer_proposal`,
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [
        orgAddress,
        treasuryAddress,
        name,
        description,
        [`Transfer ${transferAmount} APT to ${transferAddress}`],
        [[[...Buffer.from(transferProposalHash, "hex")]]], //add script
        discussionLink,
        1,
        transferAddress,
        transferAmount * APT_DECIMALS,
      ],
    };
    const response = await signAndSubmitTransaction(transferProposalPayload);
    const result = await provider.waitForTransactionWithResult(response.hash);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createWithdrawalProposal = async (
  orgAddress: string,
  treasuryAddress: string,
  name: string,
  description: string,
  discussionLink: string,
  withdrawalAmount: number,
  signAndSubmitTransaction: <T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ) => Promise<any>
) => {
  try {
    const memberAddresses = (await getAllMembersFromApi(orgAddress)).map(
      (item) => item.memberAddress
    );
    const withdrawalProposalPayload = {
      type: "entry_function_payload",
      function: `${orgModuleAddress}::aptocracy::create_withdrawal_proposal`,
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [
        orgAddress,
        treasuryAddress,
        name,
        description,
        [`Withdraw ${withdrawalAmount} APT from treasury`],
        [[[...Buffer.from(withdrawProposalHash, "hex")]]],
        discussionLink,
        1,
        memberAddresses,
        withdrawalAmount * APT_DECIMALS,
      ],
    };
    const response = await signAndSubmitTransaction(withdrawalProposalPayload);
    const result = await provider.waitForTransactionWithResult(response.hash);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createUpdateMainGovernanceProposal = async (
  orgAddress: string,
  mainGovernance: number,
  name: string,
  description: string,
  discussionLink: string,
  signAndSubmitTransaction: <T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ) => Promise<any>
) => {
  try {
    console.log(mainGovernance, "MAIN GOV");
    const mainGovProposalPayload = {
      type: "entry_function_payload",
      function: `${orgModuleAddress}::aptocracy::create_update_main_governance_proposal`,
      type_arguments: [],
      arguments: [
        orgAddress,
        name,
        description,
        [`Set main governance to ${mainGovernance}`],
        [[[...Buffer.from(updateMainGovernanceProposalHash, "hex")]]],
        discussionLink,
        1,
        mainGovernance,
      ],
    };
    const response = await signAndSubmitTransaction(mainGovProposalPayload);
    const result = await provider.waitForTransactionWithResult(response.hash);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createUpdateMainTreasuryProposal = async (
  orgAddress: string,
  mainTreasury: string,
  name: string,
  description: string,
  discussionLink: string,
  signAndSubmitTransaction: <T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ) => Promise<any>
) => {
  try {
    const mainTreasuryProposalPayload = {
      type: "entry_function_payload",
      function: `${orgModuleAddress}::aptocracy::create_update_main_treasury_proposal`,
      type_arguments: [],
      arguments: [
        orgAddress,
        name,
        description,
        [`Set main treasury to ${mainTreasury}`],
        [[[...Buffer.from(updateMainTreasuryProposalHash, "hex")]]],
        discussionLink,
        1,
        mainTreasury,
      ],
    };
    const response = await signAndSubmitTransaction(
      mainTreasuryProposalPayload
    );
    const result = await provider.waitForTransactionWithResult(response.hash);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createChangeGovernanceProposal = async (
  orgAddress: string,
  quorum: number,
  approvalQuorum: number,
  maxVotingTime: number,
  earlyTipping: boolean,
  governanceId: number,
  name: string,
  description: string,
  discussionLink: string,
  signAndSubmitTransaction: <T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ) => Promise<any>
) => {
  try {
    const mainGovProposalPayload = {
      type: "entry_function_payload",
      function: `${orgModuleAddress}::aptocracy::change_governance_config_proposal`,
      type_arguments: [],
      arguments: [
        name,
        description,
        [governanceId],
        [quorum],
        [approvalQuorum],
        [maxVotingTime * 24 * 60 * 60],
        [earlyTipping],
        [`Update governance`],
        orgAddress,
        [[[...Buffer.from(changeGovernanceProposalHash, "hex")]]], //add script
        discussionLink,
        1,
      ],
    };
    const response = await signAndSubmitTransaction(mainGovProposalPayload);
    const result = await provider.waitForTransactionWithResult(response.hash);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createCustomProposal = async (
  scriptHash: string,
  scriptBytecode: string,
  scriptParams: IScriptParams[],
  scriptOption: string,
  orgAddress: string,
  name: string,
  description: string,
  discussionLink: string,
  treasury_address: string,
  signAndSubmitTransaction: <T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ) => Promise<any>
) => {
  try {
    await saveScript(scriptBytecode, scriptHash);
    const seralizedParams: number[][] = [];
    scriptParams.forEach((item) => {
      const seralizeParam = serializeValuBasedOnType(
        item.paramValue,
        item.paramType as ParamType
      );
      seralizedParams.push(seralizeParam);
      console.log(seralizeParam);
    });
    const types = scriptParams.map((item) => item.paramType);
    console.log(scriptHash, "SCRIPT HASH");
    const mainGovProposalPayload = {
      type: "entry_function_payload",
      function: `${orgModuleAddress}::aptocracy::create_user_defined_proposal_v2`,
      type_arguments: [],
      arguments: [
        orgAddress,
        name,
        description,
        [scriptOption],
        [[[...Buffer.from(scriptHash, "hex")]]],
        [[[...seralizedParams]]],
        [[[...types]]],
        discussionLink,
        1,
        treasury_address,
      ],
    };
    console.log(mainGovProposalPayload);
    const response = await signAndSubmitTransaction(mainGovProposalPayload);
    const result = await provider.waitForTransactionWithResult(response.hash);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const castVote = async (
  orgAddress: string,
  treasuryAddress: string,
  proposalId: number,
  voteOptions: string[],
  tokenNames: string[],
  tokenPropertyVersions: number[],
  signAndSubmitTransaction: <T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ) => Promise<any>
) => {
  try {
    const castVotePayload = {
      type: "entry_function_payload",
      function: `${orgModuleAddress}::aptocracy::cast_vote`,
      type_arguments: [],
      arguments: [
        orgAddress,
        treasuryAddress,
        proposalId,
        tokenNames,
        tokenPropertyVersions,
        voteOptions,
      ],
    };
    const response = await signAndSubmitTransaction(castVotePayload);
    const result = await provider.waitForTransactionWithResult(response.hash);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const relinquishVote = async (
  orgAddress: string,
  treasuryAddress: string,
  proposalId: number,
  signAndSubmitTransaction: <T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ) => Promise<any>
) => {
  try {
    const relinquishVotePayload = {
      type: "entry_function_payload",
      function: `${orgModuleAddress}::aptocracy::relinquish_vote`,
      type_arguments: [],
      arguments: [orgAddress, proposalId],
    };
    const response = await signAndSubmitTransaction(relinquishVotePayload);
    const result = await provider.waitForTransactionWithResult(response.hash);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const cancelProposal = async (
  orgAddress: string,
  proposalId: number,
  signAndSubmitTransaction: <T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ) => Promise<any>
) => {
  try {
    const cancelProposalPayload = {
      type: "entry_function_payload",
      function: `${orgModuleAddress}::aptocracy::cancel_aptocracy_proposal`,
      type_arguments: [],
      arguments: [orgAddress, proposalId],
    };
    const response = await signAndSubmitTransaction(cancelProposalPayload);
    const result = await provider.waitForTransactionWithResult(response.hash);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const finalizeVotes = async (
  orgAddress: string,
  proposalId: number,
  signAndSubmitTransaction: <T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ) => Promise<any>
) => {
  try {
    const finalizeVotesPayload = {
      type: "entry_function_payload",
      function: `${orgModuleAddress}::aptocracy::finalize_votes_for_aptocracy_proposal`,
      type_arguments: [],
      arguments: [orgAddress, proposalId],
    };
    const response = await signAndSubmitTransaction(finalizeVotesPayload);
    const result = await provider.waitForTransactionWithResult(response.hash);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
