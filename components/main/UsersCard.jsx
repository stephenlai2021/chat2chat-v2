"use client";

import moment from "moment";

function UsersCard({
  name,
  avatarUrl,
  email,
  newMessage,
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
      ${found == "false" ? "hover:cursor-pointer" : ""} 
      hover:bg-base-300 px-4 w-full flex items-center justify-between rounded p-3 relative 
      `}
    >
      {/* Avatar on the left */}
      <div className="flex-shrink-0 mr-4 relative">
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
          {/* <span
            className={`absolute bottom-0 right-0 w-[14px] h-[14px] border border-2 rounded-full ${
              status ? "bg-red-500" : "bg-gray-500"
            }`}
          ></span> */}

          {newMessage && (
            <span className="bg-red-500 absolute bottom-0 right-0 w-[14px] h-[14px] border border-2 rounded-full" />
          )}
        </div>
      </div>

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
        {email && !lastMessage ? (
          <p className="text-base-content truncate text-sm text-desktop text-tablet text-phone">
            {email}
          </p>
        ) : (
          // if there is last message, render it instead of email
          <p className="text-base-content truncate text-sm text-desktop text-tablet text-phone">
            {lastMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default UsersCard;
