/* react-icons */
import { RxAvatar } from "react-icons/rx";
import { BsPersonAdd } from "react-icons/bs";

export default function BottomMenuSkeleton() {
  return (
    <div className="mt-auto hidden users-mobile h-[56px] shadow-inner">
      <div className="w-1/2 flex flex-col justify-center items-center h-full">
        {/* <div className="skeleton w-6 h-6" />
        <div className="skeleton w-6 h-2 mt-1" /> */}
        <RxAvatar className="w-[23px] h-[23px] font-bold text-base-content" />
        {/* <span className="btm-nav-label text-xs">Add Friend</span> */}
      </div>
      <div className="w-1/2 flex flex-col justify-center items-center h-full">
        {/* <div className="skeleton w-6 h-6 rounded-full" /> */}
        <img
          src="/avatar.png"
          className="object-cover rounded-full w-6 h-6 font-bold text-base-content"
        />
        {/* <div className="skeleton w-6 h-2 mt-1" /> */}
        {/* <span className="btm-nav-label text-xs">You</span> */}
      </div>
    </div>
  );
}
