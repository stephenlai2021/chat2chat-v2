/* components */
import UsersCard from "./UsersCard";
import AddFriendModal from "../modal/AddFriendModal";
import ThemeSwitcher from "../switcher/ThemeSwitcher";
import CreateGroupModal from "../modal/CreateGroupModal";
import EditProfileModal from "../modal/EditProfileModal";

/* react-icons */
import { RxAvatar } from "react-icons/rx";
import { MdGroupAdd } from "react-icons/md";
import { BsPersonAdd } from "react-icons/bs";

/* utils */
import { languages } from "@/data/utils";

export default function Sidabar({ userData, logoutClick, logoutLoading }) {
  return (
    <div className="bg-base-30 w-[64px] shadow-inner h-full flex flex-col items-center sidebar-hide pt-3">
      <div
        className={`
          w-full mt-2 px-5 flex items-center justify-center
          toolti tooltip-bottom
          border- border-red-30
        `}
        data-tip="Add Friend"
      >
        <BsPersonAdd
          className={`w-[23px] h-[23px] hover:cursor-pointer text-base-content`}
          onClick={() => document.getElementById("addFriendModal").showModal()}
        />
      </div>

      <div
        className={`
          w-full mt-8 py- px-5 flex items-center justify-center
          toolti tooltip-bottom
          border- border-red-30
        `}
        data-tip="Create Group"
      >
        <MdGroupAdd
          className={`w-6 h-6 opacity-30 hover:cursor-pointe text-base-content`}
          onClick={() =>
            document.getElementById("createGroupModal").showModal()
          }
        />
      </div>
      <div className="mt-8 toolti tooltip-top" data-tip="Edit profile">
        <RxAvatar
          className="w-[23px] h-[23px] hover:cursor-pointer text-base-content"
          onClick={() =>
            document.getElementById("editProfileModal").showModal()
          }
        />
      </div>

      {/* avatar-icon with drawer wrapper */}
      <div className="flex-none mt-auto mb-4">
        <div className="drawer z-[200]">
          <input
            id="navbar-drawer-settings"
            type="checkbox"
            className="drawer-toggle"
          />
          <div className={`flex justify-center`} data-tip="Settings">
            <label
              htmlFor="navbar-drawer-settings"
              aria-label="close sidebar"
              className="mx-2 py-2"
            >
              <div className="w-6 h-6 hover:cursor-pointer">
                {userData?.avatarUrl ? (
                  <img
                    src={userData?.avatarUrl}
                    className={`w-full h-full rounded-full object-cover`}
                  />
                ) : (
                  <img
                    src="/avatar.png"
                    className={`w-full h-full rounded-full`}
                  />
                )}
              </div>
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="navbar-drawer-settings"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="pt-[26px] w-80 min-h-full bg-base-200 text-base-content">
              <li>
                <UsersCard
                  found={false}
                  component="drawer"
                  name={userData?.name}
                  email={userData?.email}
                  avatarUrl={userData?.avatarUrl}
                />
              </li>
              <li>
                <ul className="menu bg-base-200 w-ful rounded-box">
                  <div className="divider" />
                  <li>
                    <details>
                      <summary className="">Theme</summary>
                      <ThemeSwitcher />
                    </details>
                  </li>
                  <li>
                    <details>
                      <summary>Language</summary>
                      <ul>
                        {languages.map((language) => (
                          <li key={language.label}>
                            <a>{language.value}</a>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                  <div className="divider" />
                  <li>
                    <div onClick={logoutClick}>
                      {logoutLoading ? (
                        <div className="loading loading-spinner loading-xs opacity-30 text-base-content flex justify-center ml-2" />
                      ) : (
                        "Logout"
                      )}
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <AddFriendModal id="addFriendModal" />
      <CreateGroupModal id="createGroupModal" />
      <EditProfileModal id="editProfileModal" userData={userData} />
    </div>
  );
}
