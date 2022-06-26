import { BigNumber } from "bignumber.js";
import { TransactionResponse } from "@ethersproject/providers";
import { Box, Grid, Paper } from "@mui/material";
import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractWrite,
} from "wagmi";
import { useState } from "react";
import { useSnackbar } from "notistack";

// components
import {
  AccountBalance,
  BetModal,
  Choice,
  Connect,
  LiveHeader,
  Price,
  SelectWinner,
  Winner,
  Withdraw,
} from "./components";

// constants
import {
  ContractConfigLottery,
  ContractConfigAggregatorV3,
  ContractConfigAccessControlledOffchainAggregator,
} from "./constants";

// helpers
import { formatOwner, formatWinner, formatRound, formatBets } from "./helpers";

export type ChoiceType = "Ethereum" | "US Dollar";

const DEFAULT_DECIMALS = 8;

export default function App() {
  const account = useAccount();
  const { enqueueSnackbar } = useSnackbar();
  const [choice, setChoice] = useState<ChoiceType | false>(false);

  const handleClickOpen = (choice: ChoiceType) => {
    setChoice(choice);
  };

  const handleClose = () => {
    setChoice(false);
  };

  // READ CONTRACTS
  const { data: latestRoundData, refetch } = useContractRead(
    ContractConfigAggregatorV3,
    "latestRoundData"
  );

  const price = new BigNumber(
    latestRoundData ? latestRoundData[1].toString() : "0"
  )
    .dividedBy(10 ** DEFAULT_DECIMALS)
    .toFormat(2);

  useContractEvent(
    ContractConfigAccessControlledOffchainAggregator,
    "NewRound",
    refetch
  );

  const { data: creationRound } = useContractRead(
    ContractConfigLottery,
    "creationRound"
  );

  const { data: blockDiff } = useContractRead(
    ContractConfigLottery,
    "blockDiff"
  );

  const { remaningRounds, isLive } = formatRound(
    latestRoundData,
    creationRound,
    blockDiff
  );

  const { data: winnerData, refetch: refetchWinner } = useContractRead(
    ContractConfigLottery,
    "winner"
  );
  const { winner, isWinner } = formatWinner(winnerData, account.data);

  useContractEvent(ContractConfigLottery, "Winner", refetchWinner);

  const { data: ownerData } = useContractRead(ContractConfigLottery, "owner");
  const { isOwner } = formatOwner(ownerData, account.data);

  const { data: betsData, refetch: refetchBets } = useContractRead(
    ContractConfigLottery,
    "bets",
    {
      args: [account.data?.address],
    }
  );
  const { balance, hasBalance } = formatBets(betsData);

  // WRITE CONTRACTS
  const handleSuccess = async (
    data: TransactionResponse,
    message: string,
    callback?: () => void
  ) => {
    enqueueSnackbar("Transaction waiting ...");
    await data.wait();
    enqueueSnackbar(message, { variant: "success" });
    callback && callback();
  };

  const { isLoading: isLoadingParticipate, write: participate } =
    useContractWrite(ContractConfigLottery, "participate", {
      onSuccess(data) {
        handleSuccess(data, "Participation success", refetchBets);
        setChoice(false);
      },
    });

  const { isLoading: isLoadingWithdraw, write: widthdraw } = useContractWrite(
    ContractConfigLottery,
    "withdraw",
    {
      onSuccess(data) {
        handleSuccess(data, "Withdraw success", refetchBets);
      },
    }
  );

  const { isLoading: isLoadingSelectWinner, write: selectWinner } =
    useContractWrite(ContractConfigLottery, "selectWinner", {
      onSuccess(data) {
        handleSuccess(data, "Select winner success");
      },
    });

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={1} md={2} lg={4} />

        <Grid item xs={10} md={8} lg={4}>
          <Box
            sx={{
              background: "#f3f5f9",
              borderRadius: 2,
              margin: "auto",
              marginTop: 5,
              padding: 10,
            }}
          >
            <Connect />

            <Box sx={{ maxWidth: 420, margin: "auto" }}>
              <AccountBalance balance={balance.toString()} />

              <Winner winner={winner} isWinner={isWinner} />

              <Paper
                elevation={1}
                sx={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  mt: 2,
                }}
              >
                <LiveHeader isLive={isLive} remaningRounds={remaningRounds} />

                <Box sx={{ background: "#f3f5f9", height: 5 }} />

                <Box sx={{ display: "flex", flexDirection: "row" }}>
                  <Choice
                    disabled={!isLive || hasBalance}
                    choice={"Ethereum"}
                    handleClick={() => handleClickOpen("Ethereum")}
                  />

                  <Price price={price} />

                  <Choice
                    disabled={!isLive || hasBalance}
                    choice={"US Dollar"}
                    handleClick={() => handleClickOpen("US Dollar")}
                  />
                </Box>

                <Withdraw
                  disabled={isLive || !hasBalance}
                  loading={isLoadingWithdraw}
                  hasBalance={hasBalance}
                  handleClick={widthdraw}
                />

                <SelectWinner
                  disabled={isLive || !!winner}
                  loading={isLoadingSelectWinner}
                  isOwner={isOwner}
                  handleClick={selectWinner}
                />
              </Paper>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={1} md={2} lg={4}></Grid>
      </Grid>

      <BetModal
        choice={choice}
        handleClose={handleClose}
        participate={participate}
        loading={isLoadingParticipate}
      />
    </>
  );
}
