/* components */
import { IoMdChatboxes } from "react-icons/io";
import { IoPersonAddSharp } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { BsChatDots } from "react-icons/bs";
import { RiUserAddLine } from "react-icons/ri";

export default function BottomNavbar({ userData, activeTab, handleTabClick }) {
  return (
    <div className="mt-auto hidden users-mobile">
      <div className="btm-nav h-14 w-full flex">
        <button
          className={`${
            activeTab == "add" ? "active text-base-content" : ""
          } w-1/2 shadow-inne flex justify-center items-center`}
        >
          {/* <IoMdAdd */}
          <RiUserAddLine
            className="w-[23px] h-[23px] font-bold text-base-content"
            onClick={() => handleTabClick("add")}
          />
        </button>
        <button
          className={`${
            activeTab == "privateChat" ? "active text-base-content" : ""
          } w-1/2 shadow-inne flex justify-center items-center`}
        >
          {/* <IoMdChatboxes */}
          <BsChatDots
            className="w-6 h-6 text-base-content"
            onClick={() => handleTabClick("privateChat")}
          />
        </button>
      </div>
    </div>
  );
}
