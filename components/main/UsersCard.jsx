"use client";

/* utils */
import {
  getToday,
  getYesterday,
  formatDate,
  formatTimeClock,
} from "@/lib/utils";

/* react-icons */
import { IoImageOutline } from "react-icons/io5";

export default function UsersCard({
  name,
  email,
  found = true,
  avatarUrl,
  lastImage,
  newMessage,
  lastMessage,
  lastMessageSentTime,
}) {
  return (
    <div
      className={`${
        found ? "hover:cursor-pointer" : ""
      } hover:bg-base-300 px-4 w-full flex items-center justify-between rounded p-3 relative`}
    >
      {/* avatar && new-message-indicator */}
      <div className="flex-shrink-0 mr-4 relative">
        <div className="w-12 h-12 rounded-full overflow-hidden avatar-bg">
          <img
            className="w-full h-full object-cover"
            src={
              avatarUrl
                ? avatarUrl
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToK4qEfbnd-RN82wdL2awn_PMviy_pelocqQ&usqp=CAU"
            }
            alt="Avatar"
          />
        </div>
      </div>

      <div className="flex-1">
        {/* name and last message sent time */}
        <div className="flex items-center justify-between text-deskto text-phon">
          <h2 className="text-md font-semibold truncate text-base-content">
            {name}
          </h2>
          <div className="text-base-content truncate text-[10px] opacity-50">
            {lastMessageSentTime ? formatTimeClock(lastMessageSentTime) : ""}
          </div>
        </div>

        {/* last message && new message badge */}
        <div className="flex justify-between">
          <p
            className={`${
              !lastMessage && !lastImage ? "block" : "hidden"
            } text-base-content truncate text-sm text-desktop text-tablet text-phone text-watch`}
          >
            {email}
          </p>

          <p
            className={`${
              found && lastMessage && !lastImage ? "block" : "hidden"
            } text-base-content truncate text-sm text-desktop text-tablet text-phone`}
          >
            {lastMessage}
          </p>

          {/* Render image icon if user submit image only */}
          <p
            className={`${
              found && !lastMessage && lastImage ? "block" : "hidden"
            } text-base-content truncate text-sm text-desktop text-tablet text-phone`}
          >
            <IoImageOutline className="w-5 h-5" />
          </p>

          {/* Render image icon and message if user submit image and message both */}
          <div
            className={`${
              found && lastMessage && lastImage ? "block" : "hidden"
            } border- flex text-base-content truncate text-sm text-desktop text-tablet text-phone`}
          >
            <IoImageOutline className="w-5 h-5" />
            <span className="ml-2 truncate">{lastMessage}</span>
          </div>

          {found && (
            <div className="text-[10px] opacity-50 text-base-content">
              {formatDate(lastMessageSentTime) == getToday()
                ? "Today"
                : formatDate(lastMessageSentTime) == getYesterday()
                ? "Yesterday"
                : formatDate(lastMessageSentTime).substring(0, 4)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
