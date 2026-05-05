import { Box, Skeleton } from "@mui/material";

export function HomeProductShimmer() {
  return (
    <Box
      className="pt-10 pb-6 px-6 border-r border-b border-gray-100 flex flex-col h-full"
      sx={{ height: "100%" }}
    >
      {/* Image Placeholder */}
      <Box className="flex justify-center items-center h-45 mb-5">
        <Skeleton variant="rounded" width="100%" height="100%" />
      </Box>

      {/* Name Placeholder */}
      <Box className="mb-1 h-12">
        <Skeleton variant="text" width="100%" height={24} />
        <Skeleton variant="text" width="60%" height={24} />
      </Box>

      {/* Rating Placeholder */}
      <Box className="flex items-center mb-2.5 gap-2">
        <Skeleton variant="text" width={100} height={20} />
        <Skeleton variant="text" width={30} height={20} />
      </Box>

      {/* Price Placeholder */}
      <Skeleton variant="text" width={60} height={28} className="mb-2.5" />

      <Box className="flex-1" />

      {/* Button Placeholder */}
      <Skeleton variant="rounded" width="100%" height={40} />
    </Box>
  );
}
