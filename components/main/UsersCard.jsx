"use client";

/* utils */
import moment from "moment";

/* react-icons */
import { IoImageOutline } from "react-icons/io5";

function UsersCard({
  name,
  avatarUrl,
  email,
  newMessage,
  lastImage,
  lastMessage,
  lastMessageSentTime,
  found,

  status,
  timeStamp,
  otherData,
}) {
  /* 時間格式 */
  const formatTimeAgo = (timestamp) => {
    const date = timestamp?.toDate();
    const momentDate = moment(date);
    return momentDate.fromNow();
  };

  return (
    <div
      className={`
      ${!found ? "hover:cursor-pointer" : ""} 
      hover:bg-base-300 px-4 w-full flex items-center justify-between rounded p-3 relative 
      `}
    >
      <div className="flex-shrink-0 mr-4 relative">
        {/* Render avatar && new-message-indicator */}
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={
              avatarUrl
                ? avatarUrl
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToK4qEfbnd-RN82wdL2awn_PMviy_pelocqQ&usqp=CAU"
            }
            alt="Avatar"
          />

          {newMessage && (
            <span className="bg-red-500 absolute bottom-0 right-0 w-[14px] h-[14px] border border-2 rounded-full" />
          )}
        </div>
      </div>

      {/* Render name and last-message-sent-time */}
      <div className="flex-1">
        <div className="flex items-center justify-between text-desktop text-phone border-1 border-green-30">
          <h2 className="border-1 border-blue-30 text-md font-semibold truncate text-base-content">
            {name}
          </h2>
          <div className="text-xs text-base-content truncate time-stamp-desktop">
            {lastMessageSentTime ? formatTimeAgo(lastMessageSentTime) : ""}
          </div>
        </div>

        {/* When we add friend, if user found, render email instead of last mesage */}
        {found && (
          <p className="text-base-content truncate text-sm text-desktop text-tablet text-phone">
            {email}
          </p>
        )}
        {/* {!found && (
          <p className="text-base-content truncate text-sm text-desktop text-tablet text-phone">
            {lastMessage}
          </p>
        )} */}

        {!found && lastMessage && !lastImage && (
          <p className="text-base-content truncate text-sm text-desktop text-tablet text-phone">
            {lastMessage}
          </p>
        )}

        {!found && !lastMessage && lastImage && (
          <p className="text-base-content truncate text-sm text-desktop text-tablet text-phone">
            <IoImageOutline className="w-5 h-5" />
          </p>
        )}

        {!found && lastMessage && lastImage && (
          <div className="border- flex text-base-content truncate text-sm text-desktop text-tablet text-phone">
            <IoImageOutline className="w-5 h-5" />
            <span className="ml-2 truncate">{lastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersCard;
