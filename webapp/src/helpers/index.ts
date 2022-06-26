import { BigNumber } from "bignumber.js";
import { GetAccountResult } from "@wagmi/core";
import { Result } from "ethers/lib/utils";

export const formatWinner = (data?: Result, accountData?: GetAccountResult) => {
  const winner: string | false =
    data && parseInt(data as unknown as string, 16)
      ? (data as unknown as string)
      : false;
  const isWinner: boolean = !!winner && winner === accountData?.address;

  return { winner, isWinner };
};

export const formatOwner = (data?: Result, accountData?: GetAccountResult) => {
  const owner: string | undefined = data
    ? (data as unknown as string)
    : undefined;

  const isOwner: boolean = !!owner && owner === accountData?.address;

  return { isOwner };
};

export const formatBets = (data?: Result) => {
  const balance = new BigNumber(data ? data.toString() : "0");
  const hasBalance = balance.isGreaterThan(0);

  return { balance, hasBalance };
};

export const formatRound = (
  latestRoundData?: Result,
  creationRound?: Result,
  blockDiff?: Result
) => {
  const numBlocks = new BigNumber(
    creationRound ? creationRound.toString() : "0"
  )
    .plus(blockDiff ? blockDiff.toString() : "0")
    .minus(latestRoundData ? latestRoundData[0].toString() : "0");

  const remaningRounds = numBlocks.toString();
  const isLive = numBlocks.isGreaterThan(0);

  return { remaningRounds, isLive };
};
