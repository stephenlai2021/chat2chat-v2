"use client";

/* react-icons */
import { BsPersonAdd } from "react-icons/bs";

/* components */
import AddFriendModal from "../modal/AddFriendModal";
import EditProfileModal from "../modal/EditProfileModal";

export default function BottomNavbar({ userData }) {
  return (
    <div className="mt-auto hidden users-mobile">
      <div className="btm-na h-14 w-full flex bg-base-200 shadow-inner">
        <div className={`w-1/2 flex flex-col justify-center items-center`}>
          <BsPersonAdd
            className={`w-[23px] h-[23px] font-bold text-base-content hover:cursor-pointer`}
            onClick={() =>
              document.getElementById("addFriendModalBottomNav").showModal()
            }
          />
          <span className="btm-nav-label text-xs">Add Friend</span>
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
          {userData?.avatarUrl ? (
            <img
              src={userData?.avatarUrl}
              onClick={() =>
                document.getElementById("editProfileModalBottomNav").showModal()
              }
              className="object-cover rounded-full w-[24px] h-[24px] font-bold text-base-content hover:cursor-pointer"
            />
          ) : (
            <img
              src="/avatar.png"              
              className="object-cover rounded-full w-[24px] h-[24px] font-bold text-base-content hover:cursor-pointer"
            />
          )}
          <span className="btm-nav-label text-xs">You</span>
        </div>
        
        <AddFriendModal id="addFriendModalBottomNav" userData={userData} />
        <EditProfileModal id="editProfileModalBottomNav" userData={userData} />
      </div>
    </div>
  );
}
