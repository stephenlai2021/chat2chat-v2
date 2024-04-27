"use client";

/* react-icons */
import { RxAvatar } from "react-icons/rx";
import { BsPersonAdd } from "react-icons/bs";

/* utils */
import { languages } from "@/data/utils";

/* components */
import UsersCard from "./UsersCard";
import AddFriendModal from "../modal/AddFriendModal";
import ThemeSwitcher from "../switcher/ThemeSwitcher";
import EditProfileModal from "../modal/EditProfileModal";

export default function BottomNavbar({ userData, logoutClick, logoutLoading }) {
  return (
    <div className="mt-auto hidden users-mobile">
      <div className="btm-na h-14 w-full flex bg-base-200 shadow-inner">
        <div className={`w-1/2 flex flex-col justify-center items-center`}>
          {/* <BsPersonAdd
            className={`w-[23px] h-[23px] font-bold text-base-content hover:cursor-pointer`}
            onClick={() =>
              document.getElementById("addFriendModalBottomNav").showModal()
            }
          />
          <span className="btm-nav-label text-xs">Add Friend</span> */}

          {/* <div className="flex-none">
            <div className="drawer z-[200]">
              <input
                id="navbar-drawer-settings-bottom-navbar"
                type="checkbox"
                className="drawer-toggle"
              />
              <div className={`flex justify-center`} data-tip="Settings">
                <label
                  htmlFor="navbar-drawer-settings-bottom-navbar"
                  aria-label="close sidebar"
                  className="mx-2 py-2"
                >
                  {userData?.avatarUrl ? (
                    <img
                      src={userData?.avatarUrl}
                      className="object-cover rounded-full w-[24px] h-[24px] font-bold text-base-content hover:cursor-pointer"
                    />
                  ) : (
                    <img
                      src="/avatar.png"
                      className="object-cover rounded-full w-[24px] h-[24px] font-bold text-base-content hover:cursor-pointer"
                    />
                  )}
                </label>
              </div>
              <div className="drawer-side">
                <label
                  htmlFor="navbar-drawer-settings-bottom-navbar"
                  aria-label="close sidebar"
                  className="drawer-overlay"
                ></label>
                <ul className="pt-4 w-80 min-h-full bg-base-200 text-base-content">
                  <UsersCard
                    found={false}
                    component="drawer"
                    name={userData?.name}
                    email={userData?.email}
                    avatarUrl={userData?.avatarUrl}
                  />
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
          </div> */}
          <div
            className={`
            w-1/2 flex flex-col justify-center items-center 
          `}
          >
            <RxAvatar
              className="w-[23px] h-[23px] hover:cursor-pointer text-base-content"
              onClick={() =>
                document.getElementById("editProfileModalBottomNav").showModal()
              }
            />
          </div>
        </div>

        {/* Create Group */}
        {/* <div
          className={`
            w-1/3 flex flex-col justify-center items-center     
          `}
        >
          <AiOutlineUsergroupAdd className="w-[24px] h-[24px] font-bold text-base-content hover:cursor-pointer" />
          <span className="btm-nav-label text-xs">Create Group</span>
        </div> */}

        <div
          className={`
            w-1/2 flex flex-col justify-center items-center 
          `}
        >
          {/* <RxAvatar
            className="w-[23px] h-[23px] hover:cursor-pointer text-base-content"
            onClick={() =>
              document.getElementById("editProfileModalBottomNav").showModal()
            }
          />           */}
          <div className="flex-none">
            <div className="drawer z-[200]">
              <input
                id="navbar-drawer-settings-bottom-navbar"
                type="checkbox"
                className="drawer-toggle"
              />
              <div className={`flex justify-center`} data-tip="Settings">
                <label
                  htmlFor="navbar-drawer-settings-bottom-navbar"
                  aria-label="close sidebar"
                  className="mx-2 py-2"
                >
                  {userData?.avatarUrl ? (
                    <img
                      src={userData?.avatarUrl}
                      className="object-cover rounded-full w-[24px] h-[24px] font-bold text-base-content hover:cursor-pointer"
                    />
                  ) : (
                    <img
                      src="/avatar.png"
                      className="object-cover rounded-full w-[24px] h-[24px] font-bold text-base-content hover:cursor-pointer"
                    />
                  )}
                </label>
              </div>
              <div className="drawer-side">
                <label
                  htmlFor="navbar-drawer-settings-bottom-navbar"
                  aria-label="close sidebar"
                  className="drawer-overlay"
                ></label>
                <ul className="pt-4 w-80 min-h-full bg-base-200 text-base-content">
                  <UsersCard
                    found={false}
                    component="drawer"
                    name={userData?.name}
                    email={userData?.email}
                    avatarUrl={userData?.avatarUrl}
                  />
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
        </div>

        <AddFriendModal id="addFriendModalBottomNav" userData={userData} />
        <EditProfileModal id="editProfileModalBottomNav" userData={userData} />
      </div>
    </div>
  );
}
