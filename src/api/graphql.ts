import {
  ApolloClient,
  ApolloLink,
  concat,
  gql,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import {
  IGovernance,
  IMemberInfo,
  IOrganizationBasicData,
  IProposalInfo,
  ITreasury,
} from "../common/interfaces/org.interfaces";
import { EMPTY_STRING } from "../common/constants/common.constants";

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    hedars: {},
  });
  return forward(operation);
});


const graphQlEndpoint="https://graphql.aptocracy.com";

const httpLink = new HttpLink({ uri: `${graphQlEndpoint}/graphql`, fetch });

const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
    },
  },
});

export const getOrganizationsFromApi = async (): Promise<
  IOrganizationBasicData[]
> => {
  try {
    const response = await apolloClient.query({
      query: gql`
        query {
          getAllAptocracies {
            address
            name
            defaultRole
            governingCoin
            inviteOnly
            mainGovernance
            maxVoterWeight
            orgType
            roleConfig {
              name
              actions
              roleWeight
            }
            createdAt
            image
            mainTreasury
          }
        }
      `,
    });
    return response.data.getAllAptocracies;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getOrganizationBasicDataFromApi = async (
  orgAddress: string
): Promise<IOrganizationBasicData> => {
  try {
    const response = await apolloClient.query({
      query: gql`
        query getApt($address: String!) {
          getAptocracy(address: $address) {
            address
            name
            defaultRole
            governingCoin
            governingCollectionInfo {
              name
              creator
            }
            inviteOnly
            mainGovernance
            maxVoterWeight
            orgType
            roleConfig {
              name
              actions
              roleWeight
            }
            createdAt
            creator
            image
            description
            mainTreasury
          }
        }
      `,
      variables: {
        address: orgAddress,
      },
    });

    return response.data.getAptocracy;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllMembersFromApi = async (
  orgAddress: string
): Promise<IMemberInfo[]> => {
  try {
    const response = await apolloClient.query({
      query: gql`
        query {
          getAllAptocracyMembers(
            aptocracyAddress: "${orgAddress}"
          ) {
            memberAddress
            aptocracyAddress
            role
            status
            proposalCreated
            memberData {
              userAddress
              socials {
                socialType
                url
              }
              email
              name
            }
          }
        }
      `,
    });
    return response.data.getAllAptocracyMembers;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getMemberForAptocracyFromApi = async (
  orgAddress: string,
  memberAddress: string
): Promise<IMemberInfo> => {
  try {
    const response = await apolloClient.query({
      query: gql`
        query {
          getAptocracyMemberByAddress(
            aptocracyAddress: "${orgAddress}",
            memberAddress: "${memberAddress}"
          ) {
            memberAddress
            aptocracyAddress
            role
            status
            proposalCreated
            memberData {
              userAddress
              socials {
                socialType
                url
              }
              email
              name
            }
          }
        }
      `,
    });
    return response.data.getAptocracyMemberByAddress;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllGovernancesFromApi = async (
  orgAddress: string
): Promise<IGovernance[]> => {
  try {
    console.log(orgAddress);
    const response = await apolloClient.query({
      query: gql`
        query {
          getGovernances(
            aptocracyAddress:  "${orgAddress}"
          ) {
            aptocracyAddress
            governanceId
            maxVotingTime
            quorum
            approvalQuorum
            earlyTipping
            validFrom
            validTo
          }
        }
      `,
    });
    return response.data.getGovernances;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllTreasuriesFromApi = async (
  orgAddress: string
): Promise<ITreasury[]> => {
  try {
    const response = await apolloClient.query({
      query: gql`
          query {
            getTreasuriesForAptocracy(
              aptocracyAddress:  "${orgAddress}"
            ) {
              treasuryAddress,
              aptocracyAddress,
              authority,
              treasuryIndex,
              depositedAmount,
              treasuryCoin,
            }
          }
        `,
    });
    return response.data.getTreasuriesForAptocracy;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTreasuryByIndex = async (
  orgAddress: string,
  treasuryIndex: number
) => {
  try {
    const response = await apolloClient.query({
      query: gql`
        query getTreasuriesForAptocracy(
          $aptocracyAddress: String!
          $index: Int!
        ) {
          getTreasuryByIndex(
            aptocracyAddress: $aptocracyAddress
            index: $index
          ) {
            treasuryAddress
            aptocracyAddress
            authority
            treasuryIndex
            depositedAmount
            treasuryCoin
            governanceId
          }
        }
      `,
      variables: {
        aptocracyAddress: orgAddress,
        index: treasuryIndex,
      },
    });
    return response.data.getTreasuryByIndex;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getGovernanceId = async (
  orgAddress: string,
  governanceId: number
) => {
  try {
    const response = await apolloClient.query({
      query: gql`
        query getGovernanceById(
          $aptocracyAddress: String!
          $governanceId: Int!
        ) {
          getGovernanceById(
            aptocracyAddress: $aptocracyAddress
            governanceId: $governanceId
          ) {
            aptocracyAddress
            governanceId
            maxVotingTime
            quorum
            approvalQuorum
            earlyTipping
            validTo
            validFrom
          }
        }
      `,
      variables: {
        aptocracyAddress: orgAddress,
        governanceId: governanceId,
      },
    });
    return response.data.getGovernanceById;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getDepositRecordsForTreasury = async (treasuryAddress: string) => {
  try {
    const response = await apolloClient.query({
      query: gql`
        query getDepositRecords($treasuryAddress: String!) {
          getDepositRecords(treasuryAddress: $treasuryAddress) {
            treasuryAddress
            memberAddress
            aptocracyAddress
            accumulatedAmount
            lastDeposit
          }
        }
      `,
      variables: {
        treasuryAddress: treasuryAddress,
      },
    });
    return response.data.getDepositRecords;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateImageAndDescriptionForOrganization = async (
  orgAddress: string,
  imageBase64: string,
  description: string
) => {
  try {
    const image = imageBase64 ? imageBase64.split(",")[1] : EMPTY_STRING;

    await apolloClient.query({
      query: gql`
        mutation updateAptocracyData($aptocracyData: UpdateAptocracy!) {
          updateAptocracyData(aptocracyData: $aptocracyData) {
            name
          }
        }
      `,
      variables: {
        aptocracyData: {
          aptocracyAddress: orgAddress,
          imageBase64: image,
          description,
        },
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllProposalsForTreasuryFromApi = async (
  treasuryAddress: string
): Promise<IProposalInfo[]> => {
  try {
    const response = await apolloClient.query({
      query: gql`
        query getAllProposalsForAptocracy($treasuryAddress: String!) {
          getAllProposalsForAptocracy(treasuryAddress: $treasuryAddress) {
            proposalId
            treasuryAddress
            aptocracyAddress
            name
            description
            discussionLink
            creator
            maxVoteWeight
            cancelledAt
            createdAt
            earlyTipping
            executedAt
            maxVoterOptions
            state
            voteThreshold
            votingFinalizedAt
            voteOptions {
              option
              voteWeight
              optionElected
              executionSteps {
                executionHash
                executionParameters
                executionParameterTypes
                executed
                id
              }
            }
            voteRecords {
              memberAddress
              proposalId
              treasuryAddress
              voterWeight
              electedOptions
              votedAt
            }
            proposalType
          }
        }
      `,
      variables: {
        treasuryAddress: treasuryAddress,
      },
    });
    return response.data.getAllProposalsForAptocracy;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getSingleProposalsForTreasuryFromApi = async (
  treasuryAddress: string,
  proposalId: number
): Promise<IProposalInfo> => {
  try {
    const response = await apolloClient.query({
      query: gql`
        query getSingleProposal(
          $treasuryAddress: String!
          $proposalId: Float!
        ) {
          getSingleProposal(
            treasuryAddress: $treasuryAddress
            proposalId: $proposalId
          ) {
            proposalId
            treasuryAddress
            aptocracyAddress
            name
            description
            discussionLink
            creator
            maxVoteWeight
            cancelledAt
            createdAt
            earlyTipping
            executedAt
            maxVoterOptions
            state
            voteThreshold
            votingFinalizedAt
            voteOptions {
              option
              voteWeight
              optionElected
              executionSteps {
                executionHash
                executionParameters
                executionParameterTypes
                executed
                id
              }
            }
            voteRecords {
              memberAddress
              proposalId
              treasuryAddress
              voterWeight
              electedOptions
              votedAt
            }
            proposalType
          }
        }
      `,
      variables: {
        treasuryAddress: treasuryAddress,
        proposalId: proposalId,
      },
    });
    return response.data.getSingleProposal;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAlTreasuryProposalsFromApi = async (
  treasuryAddress: string
): Promise<IProposalInfo[]> => {
  try {
    const response = await apolloClient.query({
      query: gql`
        query getAllTreasuryProposals($treasuryAddress: String!) {
          getAllTreasuryProposals(treasuryAddress: $treasuryAddress) {
            proposalId
            treasuryAddress
            aptocracyAddress
            name
            description
            discussionLink
            creator
            maxVoteWeight
            cancelledAt
            createdAt
            earlyTipping
            executedAt
            maxVoterOptions
            state
            voteThreshold
            votingFinalizedAt
            voteOptions {
              option
              voteWeight
              optionElected
              executionSteps {
                executionHash
                executionParameters
                executionParameterTypes
                executed
                id
              }
            }
            voteRecords {
              memberAddress
              proposalId
              treasuryAddress
              voterWeight
              electedOptions
              votedAt
            }
            proposalType
          }
        }
      `,
      variables: {
        treasuryAddress: treasuryAddress,
      },
    });
    return response.data.getAllTreasuryProposals;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getSingleProposalForTreasuryFromApi = async (
  treasuryAddress: string,
  proposalId: number
): Promise<IProposalInfo> => {
  try {
    const response = await apolloClient.query({
      query: gql`
        query getSingleProposalForTreasury(
          $treasuryAddress: String!
          $proposalId: Float!
        ) {
          getSingleProposalForTreasury(
            treasuryAddress: $treasuryAddress
            proposalId: $proposalId
          ) {
            proposalId
            treasuryAddress
            aptocracyAddress
            name
            description
            discussionLink
            creator
            maxVoteWeight
            cancelledAt
            createdAt
            earlyTipping
            executedAt
            maxVoterOptions
            state
            voteThreshold
            votingFinalizedAt
            voteOptions {
              option
              voteWeight
              optionElected
              executionSteps {
                executionHash
                executionParameters
                executionParameterTypes
                executed
                id
              }
            }
            voteRecords {
              memberAddress
              proposalId
              treasuryAddress
              voterWeight
              electedOptions
              votedAt
            }
            proposalType
          }
        }
      `,
      variables: {
        treasuryAddress: treasuryAddress,
        proposalId: proposalId,
      },
    });
    return response.data.getSingleProposalForTreasury;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllOrganizationProposalsFromApi = async (
  aptocracyAddress: string
): Promise<IProposalInfo[]> => {
  try {
    const response = await apolloClient.query({
      query: gql`
        query getAllProposalsForAptocracy($aptocracyAddress: String!) {
          getAllProposalsForAptocracy(aptocracyAddress: $aptocracyAddress) {
            proposalId
            treasuryAddress
            aptocracyAddress
            name
            description
            discussionLink
            creator
            maxVoteWeight
            cancelledAt
            createdAt
            earlyTipping
            executedAt
            maxVoterOptions
            state
            voteThreshold
            votingFinalizedAt
            voteOptions {
              option
              voteWeight
              optionElected
              executionSteps {
                executionHash
                executionParameters
                executionParameterTypes
                executed
                id
              }
            }
            voteRecords {
              memberAddress
              proposalId
              treasuryAddress
              voterWeight
              electedOptions
              votedAt
            }
            proposalType
          }
        }
      `,
      variables: {
        aptocracyAddress: aptocracyAddress,
      },
    });

    console.log(response);
    console.log(aptocracyAddress);
    return response.data.getAllProposalsForAptocracy;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getSingleProposalForOrganizationFromApi = async (
  aptocracyAddress: string,
  proposalId: number
): Promise<IProposalInfo> => {
  try {
    const response = await apolloClient.query({
      query: gql`
        query getSingleProposalForAptocracy(
          $aptocracyAddress: String!
          $proposalId: Float!
        ) {
          getSingleProposalForAptocracy(
            aptocracyAddress: $aptocracyAddress
            proposalId: $proposalId
          ) {
            proposalId
            treasuryAddress
            aptocracyAddress
            name
            description
            discussionLink
            creator
            maxVoteWeight
            cancelledAt
            createdAt
            earlyTipping
            executedAt
            maxVoterOptions
            state
            voteThreshold
            votingFinalizedAt
            voteOptions {
              option
              voteWeight
              optionElected
              executionSteps {
                executionHash
                executionParameters
                executionParameterTypes
                executed
                id
              }
            }
            voteRecords {
              memberAddress
              proposalId
              treasuryAddress
              voterWeight
              electedOptions
              votedAt
            }
            proposalType
          }
        }
      `,
      variables: {
        aptocracyAddress: aptocracyAddress,
        proposalId: proposalId,
      },
    });
    return response.data.getSingleProposalForAptocracy;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getLatestProposalForOrganizationFromApi = async (
  aptocracyAddress: string
): Promise<IProposalInfo> => {
  try {
    const response = await apolloClient.query({
      query: gql`
        query getLatestAptocracyProposal($aptocracyAddress: String!) {
          getLatestAptocracyProposal(aptocracyAddress: $aptocracyAddress) {
            proposalId
            treasuryAddress
            aptocracyAddress
            name
            description
            discussionLink
            creator
            maxVoteWeight
            cancelledAt
            createdAt
            earlyTipping
            executedAt
            maxVoterOptions
            state
            voteThreshold
            votingFinalizedAt
            voteOptions {
              option
              voteWeight
              optionElected
              executionSteps {
                executionHash
                executionParameters
                executionParameterTypes
                executed
                id
              }
            }
            voteRecords {
              memberAddress
              proposalId
              treasuryAddress
              voterWeight
              electedOptions
              votedAt
            }
            proposalType
          }
        }
      `,
      variables: {
        aptocracyAddress: aptocracyAddress,
      },
    });
    return response.data.getLatestAptocracyProposal;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
