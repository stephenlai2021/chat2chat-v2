/* react-icons */
import { IoMdChatboxes } from "react-icons/io";
import { IoPersonAddSharp } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { BsChatDots } from "react-icons/bs";
import { RiUserAddLine } from "react-icons/ri";
import { GrGroup } from "react-icons/gr";

export default function BottomNavbar({ userData, activeTab, handleTabClick }) {
  return (
    // <div className="mt-auto hidden users-mobile">
    <div className="hidden users-mobile absolute bottom-0">
      <div className="btm-nav h-14 w-full flex">
        {/* group button */}
        <button
          className={`${
            activeTab == "groupChat" ? "active text-base-content" : ""
          } w-1/2 shadow-inne flex justify-center items-center`}
        >
          <GrGroup
            className="w-[23px] h-[23px] font-bold text-base-content"
            onClick={() => handleTabClick("groupChat")}
          />
        </button>

        {/* chat button */}
        <button
          className={`${
            activeTab == "privateChat" ? "active text-base-content" : ""
          } w-1/2 shadow-inne flex justify-center items-center`}
        >
          <BsChatDots
            className="w-6 h-6 text-base-content"
            onClick={() => handleTabClick("privateChat")}
          />
        </button>
      </div>
    </div>
  );
}
