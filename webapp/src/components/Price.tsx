import { Box, Typography } from "@mui/material";

interface Props {
  price: string;
}

export const Price = ({ price }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5" sx={{ textAlign: "center" }}>
        {price}$
      </Typography>
      <Typography variant="caption" sx={{ textAlign: "center" }}>
        *chainlink price
      </Typography>
    </Box>
  );
};
