import LotteryJson from "../artifacts/Lottery.json";
import EACAggregatorProxyJson from "../artifacts/EACAggregatorProxy.json";

const DefaultLottery = "0x9E128130Bc16cD80FA802d6fF91D0B0D7597358B";
const Lottery =
  new URLSearchParams(window.location.search).get("contractAddress") ||
  DefaultLottery;
const AggregatorV3 = "0xf9680d99d6c9589e2a93a78a04a279e509205945";
const AccessControlledOffchainAggregator =
  "0x4dd6655ad5ed7c06c882f496e3f42ace5766cb89";

export const ContractConfigLottery = {
  addressOrName: Lottery,
  contractInterface: LotteryJson.abi,
};

export const ContractConfigAggregatorV3 = {
  addressOrName: AggregatorV3,
  contractInterface: EACAggregatorProxyJson.abi,
};

export const ContractConfigAccessControlledOffchainAggregator = {
  addressOrName: AccessControlledOffchainAggregator,
  contractInterface: EACAggregatorProxyJson.abi,
};
