
import React from 'react';

// This layout must match the one in MosaicGameGrid.tsx to prevent CLS
const layoutClasses = [
  'lg:col-span-2 lg:row-span-2', // 1. Large
  'lg:col-span-1 lg:row-span-1', // 2. Small
  'lg:col-span-1 lg:row-span-1', // 3. Small
  'lg:col-span-2 lg:row-span-1', // 4. Medium
  'lg:col-span-1 lg:row-span-1', // 5. Small
  'lg:col-span-1 lg:row-span-1', // 6. Small
  'lg:col-span-1 lg:row-span-1', // 7. Small
  'lg:col-span-1 lg:row-span-1', // 8. Small
  'lg:col-span-2 lg:row-span-2', // 9. Large
  'lg:col-span-1 lg:row-span-1', // 10. Small
  'lg:col-span-1 lg:row-span-1', // 11. Small
  'lg:col-span-2 lg:row-span-1', // 12. Medium
  'lg:col-span-2 lg:row-span-1', // 13. Medium
  'lg:col-span-1 lg:row-span-1', // 14. Small
  'lg:col-span-1 lg:row-span-1', // 15. Small
  'lg:col-span-2 lg:row-span-2', // 16. Large
  'lg:col-span-1 lg:row-span-1', // 17. Small
  'lg:col-span-1 lg:row-span-1', // 18. Small
  'lg:col-span-2 lg:row-span-1', // 19. Medium
  'lg:col-span-1 lg:row-span-1', // 20. Small
];

const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className}>
    <div className="w-full h-full bg-brand-card/50 rounded-2xl animate-pulse"></div>
  </div>
);

const MosaicGameGridSkeleton: React.FC<{ gameCount: number }> = ({ gameCount }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: gameCount }).map((_, index) => (
        <SkeletonCard key={index} className={layoutClasses[index % layoutClasses.length]} />
      ))}
    </div>
  );
};

export default MosaicGameGridSkeleton;
