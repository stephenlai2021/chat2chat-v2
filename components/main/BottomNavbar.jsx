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

/* clerk */
import { SignInButton, SignOutButton, useAuth } from "@clerk/nextjs";

export default function BottomNavbar({ userData, logoutClick, logoutLoading }) {
  return (
    <div className="mt-auto hidden users-mobile">
      <div className="btm-na h-14 w-full flex bg-base-200 shadow-inner">
        <div className={`w-1/2 flex flex-col justify-center items-center`}>
          <div
            className={`
            w-1/2 flex flex-col justify-center items-center 
          `}
          >
            <RxAvatar
              className="w-6 h-6 hover:cursor-pointer text-base-content"
              onClick={() =>
                document.getElementById("editProfileModalBottomNav").showModal()
              }
            />
            <span className="text-[12px]">Profile</span>
          </div>
        </div>

        <div
          className={`
            w-1/2 flex flex-col justify-center items-center 
          `}
        >
          <div className="flex-none">
            <div className="drawer z-[200]">
              <input
                id="navbar-drawer-settings-bottom-navbar"
                type="checkbox"
                className="drawer-toggle"
              />
              <div
                className={`flex flex-col justify-center`}
                data-tip="Settings"
              >
                <label
                  htmlFor="navbar-drawer-settings-bottom-navbar"
                  aria-label="close sidebar"
                  className="mx-2 py-"
                >
                  <div className="w-6 h-6 hover:cursor-pointer avatar-bg-img">
                    <img
                      src={userData?.avatarUrl}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </label>

                <span className="text-[12px]">Settings</span>
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
                        {/* <div onClick={logoutClick}>
                          {logoutLoading ? (
                            <div className="loading loading-spinner loading-xs opacity-30 text-base-content flex justify-center ml-2" />
                          ) : (
                            "Logout"
                          )}
                        </div> */}
                        <SignOutButton />
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="btm-nav">
        <button
          className="
          active bg-base-200 text-base-content"
          onClick={() =>
            document.getElementById("editProfileModalBottomNav").showModal()
          }
        >
          <RxAvatar className="w-5 h-5 hover:cursor-pointer text-base-content" />
          <span className="text-[12px] text-base-content">Profile</span>
        </button>
        <button className="bg-base-200 text-base-200">
          <div className="w-5 h-5 hover:cursor-pointer avatar-bg-img">
            <img
              src={userData?.avatarUrl}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <span className="text-base-content text-[12px]">Settings</span>
        </button>
      </div> */}
      <AddFriendModal id="addFriendModalBottomNav" userData={userData} />
      <EditProfileModal id="editProfileModalBottomNav" userData={userData} />
    </div>
  );
}
