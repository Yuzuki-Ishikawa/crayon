import { Skeleton } from '@mui/material';

export default function CopyDetailLoading() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Breadcrumbs and Date section Skeleton */}
      <div className="flex justify-between items-center mb-6 text-sm">
        <Skeleton variant="text" width={200} height={20} />
        <Skeleton variant="text" width={80} height={20} />
      </div>

      {/* Main content Skeleton */}
      <div>
        {/* Copy Text Skeleton */}
        <Skeleton variant="text" width="80%" height={48} className="mx-auto mb-10" />

        {/* Carousel Skeleton */}
        <div className="mb-10">
          <Skeleton variant="rectangular" width="100%" height={192} animation="wave" className="mb-4 rounded-lg" />
        </div>

        {/* Tags Skeleton */}
        <div className="my-6 flex flex-col gap-3 items-center">
          <div className="flex items-center gap-2">
            <Skeleton variant="text" width={50} height={20} />
            <Skeleton variant="rectangular" width={80} height={24} className="rounded" />
            <Skeleton variant="rectangular" width={100} height={24} className="rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton variant="text" width={70} height={20} />
            <Skeleton variant="rectangular" width={90} height={24} className="rounded" />
          </div>
        </div>

        {/* Explanation Skeleton */}
        <div className="prose prose-xl max-w-none mb-16">
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="text" width="90%" height={20} />
        </div>

        {/* Details Skeleton */}
        <div className="text-md space-y-2 mt-16 border-t border-gray-200 pt-12">
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="50%" height={24} />
          <Skeleton variant="text" width="40%" height={24} />
          <Skeleton variant="text" width="70%" height={24} />
          <div>
            <Skeleton variant="text" width={100} height={24} className="mb-1"/>
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="70%" height={20} />
          </div>
        </div>
      </div>

      {/* Navigation Buttons Skeleton (Optional, can be simpler) */}
       <div className="mt-8 mb-4 flex justify-between items-center">
        <Skeleton variant="text" width={100} height={36} />
        <Skeleton variant="text" width={100} height={36} />
      </div>
       <div className="mt-8 text-center">
        <Skeleton variant="text" width={150} height={24} />
      </div>
    </div>
  );
} 