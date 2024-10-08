import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../../custom-hooks/useAuth";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { auth } from "../../firebase.config";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import s from "./NavBar.module.scss";
import heart from "../../assets/heart.svg";
import cart from "../../assets/iconcart.svg";
import user from "../../assets/account.png";
import Search from "../Search/Search";
import Menu from "../Menu/Menu";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";
import { useCustomSelector } from "../../custom-hooks/store";


interface User {
  photoURL: string;
}
const NavBar:React.FC = () => {
  const [fullWidthSearch, setFullWidthSearch] = useState<boolean>(false);
  const totalQuantity = useCustomSelector((state) => state.cart.totalQuantity);
  const totalFQuantity = useCustomSelector((state) => state.favorites.totalQuantity);
  const headerRef = useRef<HTMLHeadElement>(null);

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const ProfileActionRef = useRef<HTMLDivElement>(null);
  const stickyHeaderFn = () => {
    window.addEventListener("scroll", ():void => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current?.classList.add(s.sticky_header);
      } else {
        headerRef.current?.classList.remove(s.sticky_header);
      }
    });
  };
  const navigateToCart = ():void => {
    navigate("/cart");
  };
  const navigateToFavorites = ():void => {
    navigate("/favorites");
  };
  useEffect(() => {
    stickyHeaderFn();
    return () => window.removeEventListener("sticky", stickyHeaderFn);
  });

  const toggleProfileActions = ():void => {
    ProfileActionRef.current?.classList.toggle(s.show__profileActions);
  };

  const logOut = ():void => {
    signOut(auth)
      .then(() => {
        toast.success("Вы вышли из системы");
        navigate("/main");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  return (
    <header className={s.header} ref={headerRef}>
      <div className={s.header_container}>
        <div className={fullWidthSearch ? s.hidden : s.logobar}>
          <h1 className={s.logo_title}>
            <Link to="/">GadgetStrateg</Link>
          </h1>
          <Menu />
        </div>
        <form
          className={s.search_container && fullWidthSearch ? s.flex : s.hidden}
        >
          {fullWidthSearch && (
            <button
              onClick={() => setFullWidthSearch(false)}
              className={s.arrow}
            >
              <ArrowLeft />
            </button>
          )}
          <div>
            <Search />
          </div>
        </form>
        {fullWidthSearch ? null : (
          <ul className={s.header_icons}>
            {
              <button
                className={s.searchToggle}
                onClick={() => setFullWidthSearch(true)}
              >
                <SearchIcon />
              </button>
            }
            <li>
              <div className={s.favorite} onClick={navigateToFavorites}>
                <img src={heart} alt="избранное" />
                <span className={s.badge}>{totalFQuantity}</span>
              </div>
            </li>
            <li>
              <div className={s.cart} onClick={navigateToCart}>
                <img src={cart} alt="корзина" />
                <span className={s.badge}>{totalQuantity}</span>
              </div>
            </li>
            <li className={s.profile}>
              <motion.img
                whileTap={{ scale: 1.2 }}
                src={ (currentUser as User)?.photoURL ?? user}
                onClick={toggleProfileActions}
              />
              <div
                className={s.profile_actions}
                ref={ProfileActionRef}
                onClick={toggleProfileActions}
              >
                {currentUser ? (
                  <span onClick={logOut}>Выйти</span>
                ) : (
                  <div className={s.actions}>
                    <Link to="/login" className={s.login}>Вход</Link>
                    <Link to="/signup" className={s.register}>Регистрация</Link>
                  </div>
                )}
              </div>
            </li>
          </ul>
        )}
      </div>
    </header>
  );
};

export default NavBar;
