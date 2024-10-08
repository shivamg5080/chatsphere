import {
  faBell,
  faChevronDown,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";
import NotificationsMenu from "./NotificationsMenu";

const NavBar = ({ setIsSidebar, isSidebar, setIsProfilePopUp }) => {
  const { user, setChats, setUser, notifications } = ChatState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifications, setIsNotifications] = useState(false);

  const navigate = useNavigate();

  const logoutUser = () => {
    localStorage.removeItem("userInfo");
    setChats([]);
    setUser(null);
    navigate("/");
  };

  const handleMenuOpen = () => {
    setIsMenuOpen((prev) => !prev);
    if (isSidebar) {
      setIsSidebar(false);
    }
  };
  return (
    <div className="relative blurEffect w-full h-16 flex items-center justify-between flex-wrap sm:px-8 px-4 z-10">
      <NotificationsMenu
        isNotifications={isNotifications}
        setIsNotifications={setIsNotifications}
      />
      <div
        onClick={() => {
          setIsSidebar(true);
          setIsMenuOpen(false);
        }}
        className="bg-[#002133] h-12 rounded-md w-12 sm:w-40 flex p-4 items-center text-xl gap-3 cursor-pointer hover:scale-105 transition-transform active:scale-95 duration-300 font-bold truncate"
        title="Search a user"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        Start a Chat
      </div>
      <h2 className="font-mono font-extrabold sm:text-2xl text-xl">ChatSphere</h2>
      <div className="flex items-center justify-between w-36 gap-2">
        <div
          onClick={() => {
            setIsNotifications(true);
            setIsSidebar(false);
            setIsMenuOpen(false);
          }}
          className="relative bg-[#002133] h-12 rounded-md w-12 flex p-4 items-center text-xl  cursor-pointer hover:scale-105 transition-transform active:scale-95 duration-300"
        >
          <FontAwesomeIcon icon={faBell} />
          {notifications && notifications.length !== 0 && (
            <span className="absolute -right-1 -top-1 text-sm bg-red-500 h-5 w-5 rounded-full text-center animate-pulse ">
              {notifications?.length}
            </span>
          )}
        </div>
        <div>
          <div
            onClick={handleMenuOpen}
            className="relative h-12 w-20 flex items-center justify-center p-2 hover:backdrop-brightness-75 bg-[#002133] rounded-md gap-2 cursor-pointer hover:scale-105 transition-transform active:scale-95 duration-300"
          >
            <img
              className="h-10 w-10 rounded-full object-contain"
              src={user?.avatar}
              alt="avatar"
            />
            <FontAwesomeIcon
              className={`text-xs mt-2 ${
                isMenuOpen
                  ? "rotate-180 transition-all duration-300"
                  : "rotate-0 transition-all duration-300"
              }`}
              icon={faChevronDown}
            />
          </div>
          <div
            className={`absolute top-16 rounded-md  w-20 h-20 bg-[#002133] flex items-center justify-around flex-col py-2 ${
              isMenuOpen
                ? "opacity-100 translate-y-0 transition-all duration-500 ease-in-out "
                : " opacity-100 -translate-y-56 transition-all duration-500"
            }`}
          >
            <h3
              onClick={() => {
                setIsProfilePopUp(true);
                setIsMenuOpen(false);
              }}
              className="cursor-pointer w-full h-8 text-center hover:bg-[#006761] focus:bg-[#006761] rounded-sm flex items-center justify-center"
            >
              Profile
            </h3>
            <h3
              onClick={logoutUser}
              className="cursor-pointer w-full h-8 text-center hover:bg-[#006761] focus:bg-[#006761] rounded-sm flex items-center justify-center"
            >
              Logout
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
