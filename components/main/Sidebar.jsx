/* components */
import AddFriendModal from "../modal/AddFriendModal";
import CreateGroupModal from "../modal/CreateGroupModal";
import EditProfileModal from "../modal/EditProfileModal";

/* react-icons */
import { BsPersonAdd } from "react-icons/bs";

export default function Sidabar({ userData}) {
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

      {/* <div
        className={`
          w-full mt-8 py- px-5 flex items-center justify-center
          tooltip tooltip-bottom
          border- border-red-30
        `}
        data-tip="Create Group"
      >
        <AiOutlineUsergroupAdd
          className={`w-[23px] h-[23px] hover:cursor-pointer text-base-content`}
          onClick={() => document.getElementById("createGroupModal").showModal()}
        />
      </div> */}

      {/* User Avatar */}
      <div className="mt-auto mb-4 toolti tooltip-top" data-tip="Edit profile">
        <div className="w-6 h-6 hover:cursor-pointer">
          {userData?.avatarUrl ? (
            <img
              src={userData?.avatarUrl}
              className={`w-full h-full rounded-full object-cover`}
              onClick={() =>
                document.getElementById("editProfileModal").showModal()
              }
            />
          ) : (
            <img
              src="/avatar.png"
              className={`w-full h-full rounded-full`}
              onClick={() =>
                document.getElementById("editProfileModal").showModal()
              }
            />
          )}
        </div>
      </div>

      <AddFriendModal id="addFriendModal" />      
      <CreateGroupModal id="createGroupModal" />
      <EditProfileModal id="editProfileModal" userData={userData} />
    </div>
  );
}
