/* react-icons */
import { RxAvatar } from "react-icons/rx";
import { MdGroupAdd } from "react-icons/md";
import { BsPersonAdd } from "react-icons/bs";

export default function SidebarSkeleton() {
  return (
    <div className="w-[64px] shadow-inner h-full flex flex-col items-center sidebar-hide pt-3">
      <div className="w-full mt-2 px-5 flex items-center justify-center">
        <BsPersonAdd className="w-[23px] h-[23px] text-base-content" />
      </div>
      <div className="w-full mt-8 px-5 flex items-center justify-center">
        <MdGroupAdd className="w-6 h-6 opacity-30  text-base-content" />
      </div>
      <div className="w-full mt-8 px-5 flex items-center justify-center">
        <RxAvatar className="w-[23px] h-[23px] text-base-content" />
      </div>
      <div className="w-full mx-2 py-2 mb-4 flex items-center justify-center mt-auto">
        <img
          src="/avatar.png"
          className="w-6 h-6 rounded-full object-cover"
        />
      </div>
    </div>
  );
}
