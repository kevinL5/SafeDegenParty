import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { WriteContractConfig } from "@wagmi/core";
import { ethers } from "ethers";
import { useState } from "react";
import { ChoiceType } from "../App";

interface Props {
  choice: ChoiceType | false;
  loading: boolean;
  participate: (overrideConfig?: WriteContractConfig | undefined) => void;
  handleClose(): void;
}

export const BetModal = ({
  choice,
  loading,
  participate,
  handleClose,
}: Props) => {
  const [amount, setAmount] = useState("");
  const disabled = !amount || amount === "0";

  return (
    <Dialog open={!!choice} onClose={handleClose}>
      <DialogTitle>You are about to bet on {choice}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          The minimum amount is 1 wei. The funds will be blocked during few
          rounds. The more you bet, the more chance you have to win.
        </DialogContentText>
        <TextField
          id="amount"
          autoFocus
          margin="dense"
          label="Amount in wei"
          type="number"
          fullWidth
          variant="standard"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <LoadingButton
          disabled={disabled}
          loading={loading}
          onClick={() =>
            participate({
              args: [choice === "Ethereum" ? 0 : 1],
              overrides: {
                value: ethers.utils.parseUnits(amount, "wei"),
              },
            })
          }
        >
          BET
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
