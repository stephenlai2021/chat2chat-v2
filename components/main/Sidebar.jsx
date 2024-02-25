/* components */
import UsersCard from "./UsersCard";

/* react-icons */
import { RxAvatar } from "react-icons/rx";
import { BsChatDots } from "react-icons/bs";
import { GrGroup } from "react-icons/gr";

export default function Sidabar({
  userData,
  activeTab,
  handleTabClick,
}) {
  return (
    <div className="bg-base-30 shadow-inner h-full flex flex-col items-center sidebar-hide pt-3">
      {/* chat icon */}
      <div
        className={`
        ${
          activeTab == "privateChat"
            ? "menu-left-active border-base-content"
            : ""
        } border- w-full py-3 px-5 flex items-center justify-center`}
      >
        <BsChatDots
          className={`w-[20px] h-[20px] hover:cursor-pointer text-base-content`}
          onClick={() => handleTabClick("privateChat")}
        />
      </div>

      {/* group icon */}
      <div
        className={`${
          activeTab == "groupChat" ? "menu-left-active border-base-content" : ""
        } border- w-full py-3 px-5 flex items-center justify-center`}
      >
        <GrGroup
          className={`w-[20px] h-[20px] hover:cursor-pointer text-base-content`}
          onClick={() => handleTabClick("groupChat")}
        />
      </div>

      {/* Avatar icon */}
      <div className="mt-auto mb-3">
        <RxAvatar
          className="w-[24px] h-[24px] hover:cursor-pointer text-base-content"
          onClick={() => document.getElementById("user-info-modal").showModal()}
        />
      </div>

      {/* User Info Modal */}
      <dialog id="user-info-modal" className="modal">
        <div className="modal-box">
          <UsersCard
            name={userData.name}
            email={userData.email}
            avatarUrl={userData.avatarUrl}
            found={false}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
