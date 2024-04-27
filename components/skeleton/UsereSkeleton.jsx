/* components */
import BrandTitle from "../main/BrandTitle";
import UsersCardSkeleton from "./UsersCardSkeleton";
import SidebarSkeleton from "./SidebarSkeleton";
import BottomMenuSkeleton from "./BottomMenuSkeleton";

/* react-icons */
import { RxAvatar } from "react-icons/rx";
import { IoIosSearch } from "react-icons/io";
import { GoPlusCircle } from "react-icons/go";

/* hooks */
import useWindowSize from "@/hooks/useWindowSize";

export default function UsersSkeleton() {
  const size = useWindowSize();

  return (
    <div className="flex users-mobile">
      <SidebarSkeleton />
      <div className="h-full flex flex-col w-[300px] min-w-[200px]">
        {/* Top Navbar */}
        <div className="h-[64px] flex items-center justify-between p-2 users-mobile">
          <h1 className="ml-3 font-secondary text-xl text-center font-semibold text-base-content">
            CHAT<span className="font-bold text-[#eeab63ff]">2</span>CHAT
          </h1>
          <div className="flex">
            <IoIosSearch className="w-[23px] h-[23px] mx-2 text-base-content m-2" />
            <GoPlusCircle 
              className={`w-[22px] h-[22px] text-base-content m-2 ${size.width > 800 ? 'hidden' : 'block'}`} />
          </div>
        </div>

        <div className="pt-5">
          {"abcd".split("").map((i) => (
            <UsersCardSkeleton key={i} />
          ))}
        </div>
        <BottomMenuSkeleton />
      </div>
    </div>
  );
}
