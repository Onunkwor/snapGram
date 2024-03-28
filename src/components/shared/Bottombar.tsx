import { bottombarLinks } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { INavLink } from "@/types";
import { Link, useLocation } from "react-router-dom";
const Bottombar = () => {
  const { pathname } = useLocation();
  const currentUser = useUserContext();
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link: INavLink) => {
        const isActive = pathname === link.route;
        return (
          <Link
            to={
              link.route === "/profile"
                ? `/profile/${currentUser?._id}`
                : link.route
            }
            key={link.label}
            className={` ${
              isActive && "bg-primary-500 rounded-[10px]"
            } flex-center flex-col gap-1 p-2 transition `}
          >
            <img
              src={link.imgURL}
              alt={link.label}
              width={16}
              height={16}
              className={`${isActive && "invert-white"}`}
            />
          </Link>
        );
      })}
    </section>
  );
};

export default Bottombar;
