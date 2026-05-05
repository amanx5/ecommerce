import { Box, Skeleton } from "@mui/material";

export function OrderShimmer() {
  return (
    <Box className="max-w-[850px] mt-[calc(var(--header-height,60px)+30px)] mb-25 px-5 mx-auto">
      {/* Page Title Placeholder */}
      <Skeleton variant="rounded" width="200px" height={32} className="mb-6" />

      {/* Order Cards List */}
      <Box className="grid grid-cols-1 gap-y-12.5">
        {Array.from({ length: 2 }).map((_, i) => (
          <Box key={i} className="order-container border border-[rgb(222,222,222)] rounded-[5px] overflow-hidden">
            {/* Order Header Placeholder */}
            <Box className="bg-[rgb(240,240,240)] flex items-center justify-between p-5 px-6 max-[575px]:flex-col max-[575px]:items-start">
              <Box className="flex gap-x-[45px]">
                <Box>
                  <Skeleton variant="rounded" width="80px" height={16} className="mb-1" />
                  <Skeleton variant="rounded" width="100px" height={16} />
                </Box>
                <Box>
                  <Skeleton variant="rounded" width="40px" height={16} className="mb-1" />
                  <Skeleton variant="rounded" width="60px" height={16} />
                </Box>
              </Box>
              <Box className="max-[575px]:mt-3">
                <Skeleton variant="rounded" width="60px" height={16} className="mb-1" />
                <Skeleton variant="rounded" width="150px" height={16} />
              </Box>
            </Box>

            {/* Product Grid Placeholder */}
            <Box className="p-10 px-6 grid grid-cols-[110px_1fr_220px] gap-x-[35px] items-center max-[800px]:grid-cols-[110px_1fr]">
              <Skeleton variant="rounded" width="110px" height={110} />
              <Box className="flex flex-col gap-2">
                <Skeleton variant="rounded" width="70%" height={20} />
                <Skeleton variant="rounded" width="40%" height={16} />
                <Skeleton variant="rounded" width="80px" height={32} className="mt-2" />
              </Box>
              <Box className="flex flex-col gap-3 max-[800px]:hidden">
                <Skeleton variant="rounded" width="100%" height={36} />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
