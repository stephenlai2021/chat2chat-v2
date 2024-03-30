import { BsPersonAdd } from "react-icons/bs";

export default function SidebarSkeleton() {
  return (
    <div className="shadow-inner w-[64px] h-full p-5 flex flex-col items-center sidebar-hide">
      <BsPersonAdd className="w-[23px] h-[23px] text-base-content" />
      <img src="/avatar.png" className={`w-6 h-6 rounded-full object-cover mt-auto`} />
    </div>
  );
}
