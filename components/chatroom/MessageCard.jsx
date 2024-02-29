/* utils */
import moment from "moment";

/* next */
import Image from "next/image";

/* react-icons */
import { CiMenuKebab } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";

/* react */
import { useState } from "react";

/* components */
import DeleteMsgModal from "../modal/DeleteMsgModal";

function MessageCard({ message, me, other, index, deleteMsg }) {
  const isMessageFromMe = message.sender === me.id;

  const [showMenu, setShowMenu] = useState(false);
  const [deleteMsgMenu, setDeleteMsgMenu] = useState(false);

  const formatTimeAgo = (timestamp) => {
    const date = timestamp?.toDate();
    const momentDate = moment(date);
    // return momentDate.fromNow();
    // return momentDate.format("LT");
    return momentDate.format("lll");
  };

  return (
    <div
      key={message.id}
      className={`${isMessageFromMe ? "chat chat-end" : "chat chat-start"}`}
    >
      {/* chat avatar */}
      {/* {isMessageFromMe && (
        <div className="chat-image avatar avatar-show hidden">
          <div className="w-10 rounded-full">
            <img src={me.avatarUrl} alt="Avatar" />
          </div>
        </div>
      )}
      {!isMessageFromMe && (
        <div className="chat-image avatar avatar-show hidden">
          <div className="w-10 rounded-full">
            <img src={other?.avatarUrl} alt="Avatar" />
          </div>
        </div>
      )} */}

      {/* chat bubble */}
      <div className="relative">
        <div
          className={`
            ${
              isMessageFromMe
                ? "chat-bubble chat-bubble-accent"
                : "chat-bubble chat-bubble-primary"
            } 
          `}
        >
          {message.image && (
            <div className="flex justify-center">
              <img src={message.image} className="max-h-60 mb-4 rounded" />
            </div>
          )}
          <p
            // className={`max-w-[360px] text-wrap leading-tight ${
            className={`text-wrap leading-tight min-w-[150px] ${
              isMessageFromMe ? "text-accent-content" : "text-primary-content"
            }`}
          >
            {message.content}
          </p>
          {/* isMessageFromMe ? "text-accent-content justify-end" : "text-primary-content justify-start" */}
          <div
            className={`text-xs mt-1 min-w-[60px] flex ${
              isMessageFromMe ? "text-accent-content" : "text-primary-content"
            }`}
          >
            {formatTimeAgo(message.time)}
          </div>
        </div>
        <CiMenuKebab
          // <IoIosClose
          className={`
            ${isMessageFromMe ? "right-[-8px] top-0" : "hidden"} 
            absolute w-5 h-5 hover:cursor-pointer text-warning
          `}
          onClick={() => setDeleteMsgMenu(!deleteMsgMenu)}
        />
        <div
          className={`
            ${deleteMsgMenu ? "block" : "hidden"}
            flex p-2 bg-info rounded-box absolute right-4 top-6 bg-info
          `}
        >
          <h3 className="text-sm mr-2 text-info-content flex items-center">Delete ?</h3>
          <div className="join">
            <button
              className="btn join-item btn-xs bg-error"
              onClick={() => deleteMsg(message.id)}
            >
              Yes
            </button>
            <button
              className="btn join-item btn-xs"
              onClick={() => setDeleteMsgMenu(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageCard;
