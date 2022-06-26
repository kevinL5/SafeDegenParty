import { Box, Button, Typography } from "@mui/material";
import { ChoiceType } from "../App";
import EthLogo from "../assets/ethereum.png";
import UsdLogo from "../assets/usd.png";

const imageSrc: Record<ChoiceType, string> = {
  Ethereum: EthLogo,
  "US Dollar": UsdLogo,
};

interface Props {
  disabled: boolean;
  choice: ChoiceType;
  handleClick(): void;
}

export const Choice = ({ disabled, choice, handleClick }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        padding: 1,
      }}
    >
      <Typography variant="h6" mb={1} sx={{ textAlign: "center" }}>
        {choice}
      </Typography>
      <Box
        mb={2}
        sx={{
          display: "flex",
          background: "#f3f5f9",
          padding: 2,
          borderRadius: 100,
          alignSelf: "center",
        }}
      >
        <img
          src={imageSrc[choice]}
          alt={`${choice} logo`}
          loading="lazy"
          width={70}
        />
      </Box>
      <Button
        disabled={disabled}
        variant="contained"
        color="secondary"
        onClick={handleClick}
        sx={{ alignSelf: "center" }}
      >
        Bet
      </Button>
    </Box>
  );
};
