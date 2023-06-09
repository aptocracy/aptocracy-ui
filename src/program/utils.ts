import { Network, Provider } from "aptos";

export const provider = new Provider(Network.DEVNET);
export const orgModuleAddress =
  process.env.MODULE_ADDRESS!;
