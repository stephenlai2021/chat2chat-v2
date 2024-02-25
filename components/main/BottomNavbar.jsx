/* react-icons */
import { IoMdChatboxes } from "react-icons/io";
import { IoPersonAddSharp } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { BsChatDots } from "react-icons/bs";
import { RiUserAddLine } from "react-icons/ri";
import { GrGroup } from "react-icons/gr";
import { RxAvatar } from "react-icons/rx";

/* components */
import UsersCard from "./UsersCard";
import ThemeSwitcher from "../switcher/ThemeSwitcher";

/* utils */
import { languages } from "@/data/utils";

export default function BottomNavbar({
  userData,
  activeTab,
  handleTabClick,
  logoutClick,
}) {
  return (
    <div className="mt-auto hidden users-mobile">
      <div className="btm-na h-14 w-full flex">
        
        {/* group button */}
        <button
          className={`${
            activeTab == "groupChat" ? "menu-top-active text-base-content" : ""
          } w-1/2 flex justify-center items-center`}
        >
          <GrGroup
            className="w-[23px] h-[23px] font-bold text-base-content"
            onClick={() => handleTabClick("groupChat")}
          />
        </button>

        {/* chat button */}
        <button
          className={`${
            activeTab == "privateChat" ? "menu-top-active text-base-content" : ""
          } w-1/2 flex justify-center items-center`}
        >
          <BsChatDots
            className="w-6 h-6 text-base-content"
            onClick={() => handleTabClick("privateChat")}
          />
        </button>

        {/* user avatar */}
        {/* <div className="hidde navbar-sho w-1/3 border-2 border-red-300">
          <div className="drawer h-full w-full flex items-center justify-center">
            <input
              id="navbar-drawer-settings"
              type="checkbox"
              className="drawer-toggle"
            />

            <div className="">
              <label
                htmlFor="navbar-drawer-settings"
                aria-label="close sidebar"
              >
                <RxAvatar className="w-6 h-6 hover:cursor-pointer text-base-content" />
              </label>
            </div>

            <div className="drawer-side">
              <label
                htmlFor="navbar-drawer-settings"
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
                      found={false}
                    />
                  </a>
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
                      <a onClick={logoutClick}>Logout</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div> */}
        
      </div>
    </div>
  );
}
