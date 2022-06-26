import { Paper, Typography } from "@mui/material";

interface Props {
  balance: string;
}

export const AccountBalance = ({ balance }: Props) => {
  return (
    <Paper
      sx={{
        mt: 2,
        borderRadius: 2,
        backgroundColor: "#FFB633",
      }}
    >
      <Typography
        sx={{
          textAlign: "center",
          padding: 1,
          fontWeight: 700,
          color: "white",
        }}
      >
        Your account : {balance}
      </Typography>
    </Paper>
  );
};
