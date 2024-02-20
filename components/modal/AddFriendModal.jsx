/* components */
import UsersCard from "../main/UsersCard";
import UsersCardSkeleton from "../skeleton/UsersCardSkeleton";

/* react-icons */
import { IoCloseCircleOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { IoPersonAddSharp } from "react-icons/io5";

export default function AddFriendModal({
  id,
  loading,
  userInfo,
  createChat,
  foundUsers,
  setUserInfo,
  resetUserInfoAndFoundUsers,
  handleUserInfoKeyDown,
  searchUserByNameOrEmail,
  createChatLoading,
}) {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => document.getElementById("addFriendModal").close()}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg">Add friend</h3>

        {/* search input */}
        <div className="my-3 px- input-padding relative">
          {userInfo && (
            <div className="border- absolute left-1 top-[50%] translate-y-[-50%] py-2 px-1">
              <IoCloseCircleOutline
                className="w-[20px] h-[20px] hover:cursor-pointer text-base-content"
                onClick={resetUserInfoAndFoundUsers}
              />
            </div>
          )}
          <input
            type="text"
            value={userInfo}
            onChange={(e) => setUserInfo(e.target.value)}
            onKeyDown={handleUserInfoKeyDown}
            placeholder="Enter name or email"
            className={`bg-base-300 rounded-md input-m ${
              userInfo ? "pl-8" : "pl-4"
            } pr-8 py-3 w-full max-w-x text-base-content`}
          />
          {userInfo && (
            <div className="border- absolute right-1 top-[50%] translate-y-[-50%] py-2 px-1">
              <IoIosSearch
                className="w-[20px] h-[20px] hover:cursor-pointer text-base-content"
                onClick={searchUserByNameOrEmail}
              />
            </div>
          )}
        </div>

        {/* search results */}
        <div className="relative mt-8 flex flex-col">
          {loading && <UsersCardSkeleton />}

          {!loading &&
            foundUsers &&
            foundUsers.map((user) => (
              <div key={user.id} className="relative">
                <UsersCard
                  name={user.name}
                  avatarUrl={user.avatarUrl}
                  email={user.email}
                  lastMessage={user.lastMessage}
                  found={true}
                />
                {/* {createChatLoading ? (
                  <span className="loading loading-spinner loading-sm text-base-content absolute right-0 top-0"></span>
                ) : (
                  <IoPersonAddSharp
                    className="w-5 h-5 text-base-content absolute right-0 top-0 hover:cursor-pointer"
                    onClick={() => createChat(user)}
                  />
                )} */}
              </div>
            ))}
        </div>
      </div>
    </dialog>
  );
}
