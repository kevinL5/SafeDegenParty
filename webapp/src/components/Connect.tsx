import { Box } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Connect = () => {
  return (
    <Box mb={5} sx={{ display: "flex", justifyContent: "center" }}>
      <ConnectButton />
    </Box>
  );
};
