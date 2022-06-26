import { Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";

interface Props {
  disabled: boolean;
  loading: boolean;
  hasBalance: boolean;
  handleClick(): void;
}

export const Withdraw = ({
  disabled,
  loading,
  hasBalance,
  handleClick,
}: Props) => {
  if (!hasBalance) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        m: 2,
      }}
    >
      <LoadingButton
        disabled={disabled}
        loading={loading}
        variant="contained"
        color="error"
        onClick={handleClick}
        sx={{ mb: 1 }}
      >
        Widthdraw funds
      </LoadingButton>
    </Box>
  );
};
