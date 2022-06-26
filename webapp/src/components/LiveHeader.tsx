import { Box, Chip, Typography } from "@mui/material";

interface Props {
  isLive: boolean;
  remaningRounds: string;
}

export const LiveHeader = ({ isLive, remaningRounds }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {isLive && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 10,
            bottom: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Chip label="Live" color="error" variant="outlined" />
        </Box>
      )}

      <Typography variant="h6" sx={{ textAlign: "center", padding: 1 }}>
        ETH vs USD
      </Typography>

      {isLive && (
        <Typography sx={{ textAlign: "center", padding: 1 }}>
          Remaning rounds : {remaningRounds}
        </Typography>
      )}

      <Box />
    </Box>
  );
};
