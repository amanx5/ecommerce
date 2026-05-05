import { Box, Skeleton } from "@mui/material";

export function PaymentSummaryShimmer() {
  return (
    <Box className="border border-[rgb(222,222,222)] rounded p-4.5 pb-5 max-[1100px]:row-start-1 max-[1100px]:mb-3">
      <Skeleton variant="rounded" width="60%" height={20} className="mb-5" />

      {/* Summary Rows */}
      {Array.from({ length: 4 }).map((_, i) => (
        <Box key={i} className="flex justify-between mb-4">
          <Skeleton variant="rounded" width="40%" height={14} />
          <Skeleton variant="rounded" width="20%" height={14} />
        </Box>
      ))}

      {/* Total Row */}
      <Box className="flex justify-between pt-5 mt-2 border-t border-gray-200">
        <Skeleton variant="rounded" width="40%" height={24} />
        <Skeleton variant="rounded" width="30%" height={24} />
      </Box>

      {/* Button Placeholder */}
      <Skeleton variant="rounded" width="100%" height={45} className="mt-6 mb-1" />
    </Box>
  );
}

