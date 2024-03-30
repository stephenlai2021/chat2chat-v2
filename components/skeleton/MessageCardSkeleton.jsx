export default function MessageCardSkeletion() {
  return (
    <>
      <div className="flex items-end mb-4">
        <div className="skeleton w-6 h-6 rounded-full mr-3" />
        <div className="skeleton w-[120px] h-[44px] rounded" />
      </div>
      <div className="flex items-end justify-end mb-4">
        <div className="skeleton w-[120px] h-[44px] rounded" />
        <div className="skeleton w-6 h-6 rounded-full ml-3" />
      </div>
    </>
  );
}
