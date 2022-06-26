import { Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";

interface Props {
  isOwner: boolean;
  disabled: boolean;
  loading: boolean;
  handleClick(): void;
}

export const SelectWinner = ({
  isOwner,
  disabled,
  loading,
  handleClick,
}: Props) => {
  if (!isOwner) return null;

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
        color="info"
        onClick={handleClick}
        sx={{ mb: 1 }}
      >
        Select winner
      </LoadingButton>
    </Box>
  );
};
