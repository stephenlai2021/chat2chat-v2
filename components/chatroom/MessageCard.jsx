/* react-icons */
import { IoIosMenu } from "react-icons/io";
import { MdOutlineDeleteOutline } from "react-icons/md";

import {
  getToday,
  getYesterday,
  formatDate,
  formatTimeClock,
} from "@/lib/utils";

export default function MessageCard({ message, me, other, deleteMsg }) {
  const isMessageFromMe = message.sender === me.id;

  const showOptionMenu = () => {
    setTimeout(() => {}, 1500);
  };

  return (
    <>
      <div
        key={message.id}
        className={`
          ${isMessageFromMe ? "chat-end" : "chat-start"}
          chat border- border-red-30
        `}
      >
        <div className="chat-image avatar">
          <div className="w-6 rounded-full bg-[url('/avatar.png')]">
            <img
              tabIndex={0}
              src={isMessageFromMe ? me?.avatarUrl : other?.avatarUrl}
              alt="Avatar"
              role="butto"
              className="object-cover"
            />
          </div>
        </div>

        <div
          className={`
            chat-header flex ml-1 h-4
            ${isMessageFromMe ? "mr-2" : "ml-2"}
          `}
        >
          <time className="opacity-50 text-[10px]">
            {formatTimeClock(message.time)}
          </time>
        </div>

        <div
          className={`
            ${
              isMessageFromMe
                ? "chat-bubble chat-bubble-accent"
                : "chat-bubble chat-bubble-primary"
            } 
            flex flex-col items-center justify-center border- border-green-30                      
            string-break relative
          `}
        >
          {/* <img src={message.image} className="max-h-60 rounded" /> */}
          {/* <p
            className={`
                leading-tight string-break text-sm
                ${
                  isMessageFromMe
                    ? "text-accent-content"
                    : "text-primary-content"
                }
                ${message.image ? "mt-2" : "flex justify-start"}             
            `}
            onClick={showOptionMenu}
            >
            {message.content}
          </p> */}

          <div className="dropdown dropdown-left dropdown-en dropdown-bottom">
            <img
              tabIndex={0}
              role="button"
              src={message.image}
              className="max-h-60 rounded"
            />
            <p
              tabIndex={0}
              role={isMessageFromMe ? 'button' : '  `'}
              className={`
                leading-tight string-break text-sm
                ${
                  isMessageFromMe
                    ? "text-accent-content"
                    : "text-primary-content"
                }
                ${message.image ? "mt-2" : "flex justify-start"}             
            `}
            >
              {message.content}
            </p>
            <ul
              tabIndex={0}
              className={`
                dropdown-content z-[100] menu menu-horizontal
                flex bg-base-300 rounded-box shadow m-0 p-0
                ${isMessageFromMe ? "block" : "hidden"} 
              `}
            >
              <li>
                <a className="toolti tooltip-lef" data-tip="Delete">
                  <MdOutlineDeleteOutline
                    className="w-5 h-5 opacity-50"
                    onClick={() => deleteMsg(message.id)}
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="chat-footer opacity-50 ml-1 text-[10px]">
          {formatDate(message.time) == getToday()
            ? "Today"
            : formatDate(message.time) == getYesterday()
            ? "Yesterday"
            : formatDate(message.time).slice(0, -5)}
        </div>

        {/* Menu Icon */}
        {/* <div className="dropdown dropdown-left dropdown-end">
          <IoIosMenu
            tabIndex={0}
            role="button"
            className={`
              ${isMessageFromMe ? "left-[-20px]" : "hidden"} 
              absolute left-[-20px] bottom-[2px] w-4 h-4 hover:cursor-pointer text-warnin opacity-50
              `}
          />
          <ul
            tabIndex={0}
            className={`
                dropdown-content z-[100] menu menu-horizontal
                flex bg-base-300 rounded-box shadow m-0 p-0
              `}
          >
            <li>
              <a className="toolti tooltip-lef" data-tip="Delete">
                <MdOutlineDeleteOutline
                  className="w-5 h-5"
                  onClick={() => deleteMsg(message.id)}
                />
              </a>
            </li>
          </ul>
        </div> */}
      </div>
    </>
  );
}
