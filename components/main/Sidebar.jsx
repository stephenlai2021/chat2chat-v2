/* components */
import UsersCard from "./UsersCard";
import AddFriendModal from "../modal/AddFriendModal";
import CreateGroupModal from "../modal/CreateGroupModal";

/* react-icons */
import { RxAvatar } from "react-icons/rx";
import { RiUserAddLine } from "react-icons/ri";
import { BsChatDots } from "react-icons/bs";

/* next-themes */
import { useTheme } from "next-themes";

/* utils */
import { themes, languages } from "@/data/utils";

/* react */
import { useState } from "react";

export default function Sidabar({
  userData,
  activeTab,
  handleTabClick,
  logoutClick,
  logoutLoading,
}) {
  const [loading, setLoading] = useState(false);
  const { setTheme } = useTheme();

  return (
    <div className="bg-base-30 shadow-inner h-full flex flex-col items-center sidebar-hide pt-3">
      {/* Add friend icon */}
      <div
        className={`${
          activeTab == "add" ? "menu-active border-base-content" : ""
        } border- w-full py-3 px-5 flex items-center justify-center`}
      >
        <RiUserAddLine
          className={`w-[20px] h-[20px] hover:cursor-pointer text-base-content`}
          onClick={() => handleTabClick("add")}
        />
      </div>

      {/* Chat icon */}
      <div
        className={`${
          activeTab == "privateChat" ? "menu-active border-base-content" : ""
        } border- w-full py-3 px-5 flex items-center justify-center`}
      >
        <BsChatDots
          className={`w-[20px] h-[20px] hover:cursor-pointer text-base-content`}
          onClick={() => handleTabClick("privateChat")}
        />
      </div>

      {/* Avatar icon in the bottom */}
      <div className="mt-auto mb-3">
        <div className="drawer z-[100]">
          <input
            id="sidebar-drawer-settings"
            type="checkbox"
            className="drawer-toggle"
          />
          <div className="border- border-red-30 flex justify-center">
            <label
              htmlFor="sidebar-drawer-settings"
              aria-label="close sidebar"
              className="px-5 py-2"
            >
              <RxAvatar className="w-[24px] h-[24px] hover:cursor-pointer text-base-content" />
            </label>
          </div>

          <div className="drawer-side">
            <label
              htmlFor="sidebar-drawer-settings"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="pt-4 w-80 min-h-full bg-base-200 text-base-content">
              <li className="pl-2">
                <a>
                  <UsersCard
                    name={userData.name}
                    email={userData.email}
                    avatarUrl={userData.avatarUrl}
                    found={true}
                  />
                </a>
              </li>
              <li>
                <ul className="menu bg-base-200 w-ful rounded-box">
                  <div className="divider" />
                  {/* Add friend */}
                  <li>
                    <a
                      onClick={() =>
                        document.getElementById("addFriendModal").showModal()
                      }
                    >
                      Add friend
                    </a>
                  </li>

                  {/* Create group */}
                  <li>
                    <a
                      onClick={() =>
                        document.getElementById("createGroupModal").showModal()
                      }
                    >
                      Create Group
                    </a>
                  </li>
                  <div className="divider" />

                  {/* Theme */}
                  <li>
                    <details>
                      <summary className="">Theme</summary>
                      <ul>
                        {themes.map((theme) => (
                          <div
                            key={theme.label}
                            className="form-control"
                            onClick={() => setTheme(theme.value)}
                          >
                            <label className="label cursor-pointer gap-4">
                              <span className="label-text">{theme.label}</span>
                              <input
                                type="radio"
                                name="theme-radios"
                                className="radio theme-controller"
                                value={theme.value}
                              />
                            </label>
                          </div>
                        ))}
                      </ul>
                    </details>
                  </li>

                  {/* Language */}
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

                  {/* Logout Button */}
                  <li>
                    <button
                      onClick={logoutClick}
                      className={`${logoutLoading ? "btn-disabled" : ""}`}
                    >
                      <span className={`${logoutLoading ? 'text-base-100' : ''}`}>Logout</span>
                      {logoutLoading && (
                        <span className="ml-2 loading loading-spinner loading-xs text-base-100" />
                      )}
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <AddFriendModal id="addFriendModal" />
      <CreateGroupModal id="createGroupModal" />
    </div>
  );
}
