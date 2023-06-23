import { AptosAccount, BCS, Types } from "aptos";
import {
  APTOS_COIN_ADDRESS,
  APT_DECIMALS,
} from "../../common/constants/common.constants";
import {
  OrganizationType,
  TransactionState,
} from "../../common/enums/org.enum";
import {
  ICreateOrgFields,
  IDepositRecord,
  IMemberInfo,
  IMemberNftInfo,
  IMemberRights,
  IOrganizationBasicData,
  ITransactionInfo,
  ITreasury,
} from "../../common/interfaces/org.interfaces";
import { sendTransactions } from "../sendTransactions";
import { orgModuleAddress, provider } from "../utils";
import { calculateVotingPower } from "../../utilities/helpers";

export const createOrganization = async (
  values: ICreateOrgFields,
  creatorAddress: string,
  signAndSubmitTransaction: <T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ) => Promise<any>,
  updateOrgAfterCreationAndGoToDetails: (
    organizationAddress: string,
    orgImg: string,
    description: string
  ) => void
) => {
  const transactions: ITransactionInfo[] = [];
  let tx_counter = 1;
  const createOrgPayload =
    values.orgType !== OrganizationType.NftBased
      ? {
          type: "entry_function_payload",
          function: `${orgModuleAddress}::aptocracy::create_non_nft_organization`,
          type_arguments: [APTOS_COIN_ADDRESS],
          arguments: [
            values.name,
            values.orgType,
            values.roleConfig.map((item) => item.roleName),
            values.roleConfig.map((item) => item.roleWeight),
            values.roleConfig.map((item) => item.roleActions),
            "Owner",
            values.inviteOnly,
            "Member",
          ],
        }
      : {
          type: "entry_function_payload",
          function: `${orgModuleAddress}::aptocracy::create_nft_organization`,
          type_arguments: [],
          arguments: [
            values.name,
            values.roleConfig.map((item) => item.roleName),
            values.roleConfig.map((item) => item.roleWeight),
            values.roleConfig.map((item) => item.roleActions),
            "Owner",
            values.inviteOnly,
            "Member",
            values.totalNfts,
            values.creatorAddress,
            values.collectionName,
          ],
        };
  transactions.push({
    description: "Create organization",
    number: tx_counter++,
    payload: createOrgPayload,
    transactionState: TransactionState.Pending,
  });

  const seeds: Uint8Array = new Uint8Array([
    ...BCS.bcsSerializeStr(values.name),
  ]);

  const organizationAddress = AptosAccount.getResourceAccountAddress(
    creatorAddress,
    seeds
  );

  let treasuryGovIndex = 0;

  let createGovernancePayload = {
    type: "entry_function_payload",
    function: `${orgModuleAddress}::aptocracy::create_governance`,
    type_arguments: [],
    arguments: [
      organizationAddress.toString(),
      Number(values.maxVotingTime) * 24 * 60 * 60,
      values.approvalQuorum,
      values.quorum,
      values.earlyTipping,
    ],
  };

  transactions.push({
    description: "Create governance",
    number: tx_counter++,
    payload: createGovernancePayload,
    transactionState: TransactionState.Pending,
  });

  let updateMainGovernance = {
    type: "entry_function_payload",
    function: `${orgModuleAddress}::aptocracy::update_main_org_governance`,
    type_arguments: [],
    arguments: [organizationAddress.toString(), 1],
  };

  transactions.push({
    description: "Setup main governance",
    number: tx_counter++,
    payload: updateMainGovernance,
    transactionState: TransactionState.Pending,
  });

  if (
    values.approvalQuorum !== values.treasuryApprovalQuorum ||
    values.quorum !== values.treasuryQuorum ||
    values.maxVotingTime !== values.treasuryMaxVotingTime ||
    values.earlyTipping !== values.treasuryEarlyTipping
  ) {
    const createTreasuryGovernancePayload = {
      type: "entry_function_payload",
      function: `${orgModuleAddress}::aptocracy::create_governance`,
      type_arguments: [],
      arguments: [
        organizationAddress.toString(),
        Number(values.treasuryMaxVotingTime) * 24 * 60 * 60,
        values.treasuryApprovalQuorum,
        values.treasuryQuorum,
        values.treasuryEarlyTipping,
      ],
    };
    treasuryGovIndex = treasuryGovIndex + 1;
    transactions.push({
      description: "Create governance for treasury",
      number: tx_counter++,
      payload: createTreasuryGovernancePayload,
      transactionState: TransactionState.Pending,
    });
  }

  const createTreasuryPayload = {
    type: "entry_function_payload",
    function: `${orgModuleAddress}::aptocracy::create_treasury`,
    type_arguments: [APTOS_COIN_ADDRESS],
    arguments: [organizationAddress.toString(), treasuryGovIndex],
  };
  transactions.push({
    description: "Create treasury",
    number: tx_counter++,
    payload: createTreasuryPayload,
    transactionState: TransactionState.Pending,
  });

  console.log(organizationAddress);

  // let addressArr = TxnBuilderTypes.AccountAddress.fromHex(organizationAddress);
  // console.log(addressArr.toHexString().toString());
  // const serializer = new BCS.Serializer();
  // // serializer.serializeBytes(addressArr.address);
  // addressArr.serialize(serializer);

  const treasurySeeds: Uint8Array = new Uint8Array([
    // ...BCS.bcsSerializeBytes(serializer.getBytes()),
    ...BCS.bcsSerializeStr("treasury"),
    ...BCS.bcsSerializeU32(1),
  ]);
  const treasuryAddress = AptosAccount.getResourceAccountAddress(
    organizationAddress,
    treasurySeeds
  );

  let updateMainTreasury = {
    type: "entry_function_payload",
    function: `${orgModuleAddress}::aptocracy::update_main_org_treasury`,
    type_arguments: [],
    arguments: [organizationAddress.toString(), treasuryAddress.toString()],
  };

  transactions.push({
    description: "Setup main treasury",
    number: tx_counter++,
    payload: updateMainTreasury,
    transactionState: TransactionState.Pending,
  });

  await sendTransactions(
    transactions,
    creatorAddress,
    signAndSubmitTransaction,
    undefined,
    async () => {
      await updateOrgAfterCreationAndGoToDetails(
        organizationAddress.toString(),
        values.orgImg,
        values.description
      );
    }
  );
  return organizationAddress;
};

export const addNewMember = async (
  memberAddress: string,
  memberRole: string,
  orgAddress: string,
  signAndSubmitTransaction: <T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ) => Promise<any>
) => {
  try {
    const payload = {
      type: "entry_function_payload",
      function: `${orgModuleAddress}::aptocracy::invite_aptocracy_member`,
      type_arguments: [],
      arguments: [orgAddress, memberAddress, memberRole],
    };
    const response = await signAndSubmitTransaction(payload);
    await provider.waitForTransaction(response.hash);
  } catch (error) {
    throw error;
  }
};

export const addNewGovernance = async (
  organizationAddress: string,
  maxVotingTime: number,
  approvalQuorum: number,
  quorum: number,
  earlyTipping: boolean,
  signAndSubmitTransaction: <T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ) => Promise<any>
) => {
  try {
    const createGovernancePayload = {
      type: "entry_function_payload",
      function: `${orgModuleAddress}::aptocracy::create_governance`,
      type_arguments: [],
      arguments: [
        organizationAddress.toString(),
        maxVotingTime * 24 * 60 * 60,
        approvalQuorum,
        quorum,
        earlyTipping,
      ],
    };
    const response = await signAndSubmitTransaction(createGovernancePayload);
    await provider.waitForTransaction(response.hash);
  } catch (error) {
    throw error;
  }
};

export const addNewTreasury = async (
  orgAddress: string,
  governanceId: number,
  signAndSubmitTransaction: <T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ) => Promise<any>
) => {
  try {
    const createTreasuryPayload = {
      type: "entry_function_payload",
      function: `${orgModuleAddress}::aptocracy::create_treasury`,
      type_arguments: [APTOS_COIN_ADDRESS],
      arguments: [orgAddress, governanceId],
    };

    const response = await signAndSubmitTransaction(createTreasuryPayload);
    await provider.waitForTransaction(response.hash);
  } catch (error) {
    console.log(error);
  }
};

export const acceptInvitation = async (
  orgAddress: string,
  signAndSubmitTransaction: <T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ) => Promise<any>
) => {
  try {
    const acceptInvitationPayload = {
      type: "entry_function_payload",
      function: `${orgModuleAddress}::aptocracy::accept_aptocracy_membership`,
      type_arguments: [],
      arguments: [orgAddress],
    };
    const response = await signAndSubmitTransaction(acceptInvitationPayload);
    await provider.waitForTransaction(response.hash);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const depositFunds = async (
  orgAddress: string,
  treasuryAddress: string,
  depositAmount: number,
  signAndSubmitTransaction: <T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ) => Promise<any>
) => {
  try {
    const depositAmountAPT = depositAmount * APT_DECIMALS;

    const depositPayload = {
      type: "entry_function_payload",
      function: `${orgModuleAddress}::aptocracy::support_org`,
      type_arguments: [APTOS_COIN_ADDRESS],
      arguments: [orgAddress, depositAmountAPT, treasuryAddress],
    };
    const response = await signAndSubmitTransaction(depositPayload);
    console.log(response, "RESPONSE");
    const result = await provider.waitForTransactionWithResult(response.hash);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const withdrawFunds = async (
  orgAddress: string,
  treasuryAddress: string,
  withdrawAmount: number,
  signAndSubmitTransaction: <T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ) => Promise<any>
) => {
  try {
    const withdrawAmountAPT = withdrawAmount * APT_DECIMALS;

    const withdrawPayload = {
      type: "entry_function_payload",
      function: `${orgModuleAddress}::aptocracy::withdraw_funds`,
      type_arguments: [APTOS_COIN_ADDRESS],
      arguments: [orgAddress, withdrawAmountAPT, treasuryAddress],
    };
    const response = await signAndSubmitTransaction(withdrawPayload);
    console.log(response, "RESPONSE");
    const result = await provider.waitForTransactionWithResult(response.hash);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getMemberRightsForTreasury = async (
  treasury: ITreasury,
  memberInfo: IMemberInfo,
  depositRecords: IDepositRecord[],
  organizationBasicInfo: IOrganizationBasicData
): Promise<IMemberRights> => {
  try {
    let memberNfts: IMemberNftInfo[] = [];
    if (Number(organizationBasicInfo.orgType) === OrganizationType.NftBased) {
      const memberNftsRaw = (
        await provider.getAccountNFTs(memberInfo.memberAddress)
      ).current_token_ownerships.filter(
        (item) =>
          item.current_collection_data?.collection_name ===
            organizationBasicInfo.governingCollectionInfo.name &&
          item.current_collection_data?.creator_address ===
            organizationBasicInfo.governingCollectionInfo.creator
      );
      memberNftsRaw.forEach((item) => {
        if (item.current_token_data) {
          memberNfts.push({
            tokenName: item.current_token_data.name,
            tokenPropertyVersion: item.property_version,
          });
        }
      });
    }

    let depositAmount =
      depositRecords.find(
        (item) => item.memberAddress === memberInfo?.memberAddress
      )?.accumulatedAmount ?? 0;
    let roleInfo = organizationBasicInfo.roleConfig.find(
      (item) => item.name === memberInfo?.role
    );
    let votingPower = await calculateVotingPower(
      Number(organizationBasicInfo.orgType),
      depositAmount / APT_DECIMALS,
      roleInfo?.roleWeight ?? 0,
      memberInfo.memberAddress,
      memberNfts.length
    );
    let ownership = treasury.depositedAmount
      ? (depositAmount * 100) / treasury.depositedAmount
      : 0;
    return {
      depositAmount: depositAmount / APT_DECIMALS,
      ownership,
      votingPower,
      role: memberInfo.role,
      memberNftsInfo: memberNfts,
    };
  } catch (error) {
    throw error;
  }
};

export const setupMainGov = async (
  organizationAddress: string,
  governanceId: number,
  signAndSubmitTransaction: <T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ) => Promise<any>
) => {
  try {
    let updateMainGovernance = {
      type: "entry_function_payload",
      function: `${orgModuleAddress}::aptocracy::update_main_org_governance`,
      type_arguments: [],
      arguments: [organizationAddress.toString(), governanceId],
    };
    const response = await signAndSubmitTransaction(updateMainGovernance);
    await provider.waitForTransactionWithResult(response.hash);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const setupMainTreasury = async (
  organizationAddress: string,
  treasuryAddress: string,
  signAndSubmitTransaction: <T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V
  ) => Promise<any>
) => {
  try {
    let updateMainTreasury = {
      type: "entry_function_payload",
      function: `${orgModuleAddress}::aptocracy::update_main_org_treasury`,
      type_arguments: [],
      arguments: [organizationAddress.toString(), treasuryAddress.toString()],
    };
    const response = await signAndSubmitTransaction(updateMainTreasury);
    await provider.waitForTransactionWithResult(response.hash);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
