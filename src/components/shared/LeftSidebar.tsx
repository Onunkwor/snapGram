import { Link, NavLink, useLocation } from "react-router-dom";

import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import { UserButton, useAuth } from "@clerk/clerk-react";

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const { userId } = useAuth();
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-8">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>
        <Link to={`/profile/${userId}`} className="flex gap-3 items-center">
          <UserButton afterSignOutUrl="/sign-in" />
          <div className="flex flex-col">
            <p className="body bold">{userId}</p>
            <p className="small-regular text-light-3">@{userId}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-3 ">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}
              >
                <NavLink
                  to={link.route}
                  className="p-4 flex items-center gap-4"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default LeftSidebar;
