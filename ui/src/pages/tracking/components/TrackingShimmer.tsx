import { Box, Skeleton } from "@mui/material";

export function TrackingShimmer() {
  return (
    <Box className="max-w-[850px] mt-[calc(var(--header-height,60px)+30px)] mb-25 px-7.5 mx-auto">
      {/* View All Orders Link Placeholder */}
      <Skeleton variant="rounded" width="120px" height={20} className="mb-7.5" />

      {/* Progress Heading Placeholder */}
      <Skeleton
        variant="rounded"
        width="60%"
        height={32}
        className="mb-2"
      />
      <Skeleton
        variant="rounded"
        width="40%"
        height={24}
        className="mb-5"
      />

      {/* Product Details Placeholder */}
      <Box className="border-t border-gray-200 pt-6 mt-6">
        <Skeleton variant="rounded" width="70%" height={20} className="mb-2" />
        <Skeleton variant="rounded" width="100px" height={16} className="mb-4" />
        <Skeleton
          variant="rounded"
          width="150px"
          height={150}
          className="mt-4 mb-8"
        />
      </Box>

      {/* Progress Labels Placeholder */}
      <Box className="flex justify-between mb-4 max-[450px]:flex-col">
        <Skeleton variant="rounded" width="80px" height={24} />
        <Skeleton variant="rounded" width="80px" height={24} />
        <Skeleton variant="rounded" width="80px" height={24} />
      </Box>

      {/* Progress Bar Placeholder */}
      <Skeleton
        variant="rounded"
        width="100%"
        height={25}
        className="rounded-full"
      />
    </Box>
  );
}
