import s from "./Card.module.scss";
import star from "../../assets/Card/star.svg";
import cart from "../../assets/iconcart.svg";
import React from 'react'
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cartActions } from "../../redux/slices/CartSlice";
import { favoriteActions } from "../../redux/slices/FavoritesSlice";
import { useCustomDispatch, useCustomSelector } from "../../custom-hooks/store";
import { Product } from "../../types/types";




interface CardProps {
  item:Product
}

const Card:React.FC<CardProps> = ({ item }) => {
  const dispatch = useCustomDispatch();
  const favoriteItems =
    useCustomSelector((state) => state.favorites.favoriteItems) || [];
  const isFavorite = favoriteItems.some((favItem) => favItem.id === item.id);

  const addToCart = () => {
    const newItem = {
      id: +item.id,
      productName: item.productName,
      imgUrl: item.imgUrl,
      price: item.price,
      quantity: 1,
      totalPrice: +item.price * 1,
    };
    dispatch(cartActions.addItem(newItem));
  };

  const handleFavoriteClick = () => {
    if (isFavorite) {
      dispatch(favoriteActions.deleteItem(item));
    } else {
      const newItem= {
        id: item.id,
        productName: item.productName,
        imgUrl: item.imgUrl,
        price: item.price,
      };
      dispatch(favoriteActions.addItem(newItem));
    }
  };
  return (
    <div className={s.card}>
      <div className={s.details}>
        <motion.img src={item.imgUrl} whileHover={{ scale: 0.9 }} />
        <h2>
          <Link to={`/shop/${item.id}`}>{item.productName}</Link>
        </h2>
      </div>
      <div>
        <div className={s.rating_container}>
          <img src={star} />
          <span>{item.avgRating}</span>
        </div>
        <span className={s.price}>{item.price} ₽</span>
      </div>
      <div className={s.icons}>
        <motion.img src={cart} whileTap={{ scale: 1.2 }} onClick={addToCart} />
        <svg
          onClick={handleFavoriteClick}
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill={isFavorite ? "#ff0000" : "none"}
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 21s-8-6.15-8-10.9c0-2.27 2-3.1 4-3.1 1.54 0 3 1.07 4 3.1 1-2.03 2.46-3.1 4-3.1 2 0 4 .83 4 3.1 0 4.75-8 10.9-8 10.9z" />
        </svg>
      </div>
    </div>
  );
};

export default Card;
