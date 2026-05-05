import { Box, Skeleton } from "@mui/material";

export function CartItemShimmer() {
  return (
    <Box className="border border-[rgb(222,222,222)] rounded p-4.5 max-[400px]:p-3 mb-3">
      {/* Product Name Header - Matches mt-1.25 mb-6 */}
      <Skeleton
        variant="rounded"
        width="80%"
        height={24}
        className="mt-1.25 mb-6"
      />

      <Box className="grid grid-cols-[1fr_320px] gap-x-8 max-[1100px]:grid-cols-1 max-[1100px]:gap-y-8">
        {/* Product & Quantity Cluster Placeholder */}
        <Box className="flex gap-x-6">
          <Skeleton variant="rounded" width="120px" height={120} />
          <Box className="flex flex-col gap-3 pt-1">
            <Skeleton variant="rounded" width="100px" height={20} />
            <Skeleton variant="rounded" width="140px" height={32} className="mt-3" />
          </Box>
        </Box>

        {/* Delivery Options Section Placeholder */}
        <Box className="border-l border-gray-100 pl-8 max-[1100px]:border-l-0 max-[1100px]:pl-0 max-[1100px]:border-t max-[1100px]:pt-6">
          <Skeleton variant="rounded" width="180px" height={18} className="mb-4" />
          <Box className="flex flex-col gap-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <Box
                key={i}
                className="grid grid-cols-[24px_1fr] gap-x-1 items-start mb-4"
              >
                <Skeleton variant="circular" width={20} height={20} className="mt-1" />
                <Box className="flex flex-col gap-1.5">
                  <Skeleton variant="rounded" width="80%" height={14} className="mt-1" />
                  <Skeleton variant="rounded" width="50%" height={12} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

    </Box>
  );
}




