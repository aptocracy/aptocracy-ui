import { EMPTY_STRING } from "../common/constants/common.constants";

export const executeProposal = async (
  address: string,
  executionStepId: string
) => {
  try {
    await fetch("http://localhost:5600/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, */*",
      },
      body: JSON.stringify({
        wallet: address,
        transfered_amount: 2,
        execution_step_id: executionStepId,
      }),
    });
  } catch (error) {
    throw error;
  }
};

export const saveScript = async (
  scriptBytecode: string,
  executionHash: string
) => {
  try {
    let scriptHash = EMPTY_STRING;
    if (!executionHash.startsWith("0x")) {
      scriptHash = scriptHash.concat("0x");
      scriptHash = scriptHash.concat(...executionHash);
    } else {
      scriptHash = executionHash;
    }
    await fetch("http://localhost:5600/add-script", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, */*",
      },
      body: JSON.stringify({
        script_hash_data: scriptHash,
        script_bytecode_data: scriptBytecode,
        proposal_type: 1,
      }),
    });
  } catch (error) {
    throw error;
  }
};
