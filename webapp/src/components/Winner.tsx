import { Paper, Typography } from "@mui/material";

interface Props {
  winner: string | false;
  isWinner: boolean;
}

export const Winner = ({ winner, isWinner }: Props) => {
  if (!winner) return null;

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
        Winner is : {isWinner ? "YOU !!!" : winner}
      </Typography>
    </Paper>
  );
};
