import { useParams } from "react-router";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useCustomDispatch } from "../../custom-hooks/store";
import { cartActions } from "../../redux/slices/CartSlice";
import { motion } from "framer-motion";
import s from "./ProductDetails.module.scss";
import { products } from "../../Constants";
import Title from "../../ui/Title";
import ProductList from "../../ui/ProductList/ProductList";
import {StarRating} from "../../ui/Star/Star";
import { toast } from "react-toastify";
import { Product } from "../../types/types";


const ProductDetails:React.FC = () => {
  const { id } = useParams<string>();
  const [tab, setTab] = useState<string>("desc");
  const [rating, setRating] = useState<number>(0);
  const reviewUser = useRef<HTMLInputElement>(null);
  const reviewMsg = useRef<HTMLTextAreaElement>(null);
  const dispatch = useCustomDispatch();
  const product:Product | undefined = products.find((item) => item.id === id);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);
  if (!product) {
    return <h1>Товар не найден</h1>;
  }
  const {
    imgUrl,
    productName,
    price,
    avgRating,
    description,
    shortDesc,
    category,
  } = product;
  const relatedProducts = products.filter((item) => item.category === category);

  const submitHandler = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(reviewMsg.current && reviewUser.current){
    const reviewUserName = reviewUser.current.value;
    const reviewUserMsg = reviewMsg.current.value;
    
    const reviewObj = {
      userName: reviewUserName,
      text: reviewUserMsg,
      rating,
    }
    console.log(reviewObj);
    toast.success("Спасибо за отзыв");
  }}
  const addToCart = ():void => {
    const newItem = {
      id: +id!,
      productName: productName,
      imgUrl: imgUrl,
      price: price,
      quantity: 1,
      totalPrice: +price * 1,
    };
    dispatch(cartActions.addItem(newItem));
  };
 
  return (
    <section className={s.container}>
      <Title title={product.productName} />
      <div className={s.block}>
        <img src={imgUrl} alt={productName} />
        <div className={s.products_details}>
          <h3 className={s.productName}>{productName}</h3>

          <p className={s.product_rating}> ⭐ {avgRating}</p>

          <span className={s.price}>{price} ₽</span>
          <i className={s.shortdesc}>{shortDesc}</i>
          <motion.button
            whileTap={{ scale: 1.2 }}
            className={s.button}
            onClick={addToCart}
          >
            Добавить в корзину
          </motion.button>
        </div>
      </div>
      <section className={s.desc_container}>
        <div className={s.details}>
          <div className={s.nav}>
            <div
              className={`${tab === "desc" ? s.active__tab : ""} `}
              onClick={() => setTab("desc")}
            >
              Описание
            </div>
            <div
              className={`${tab === "rev" ? s.active__tab : ""} `}
              onClick={() => setTab("rev")}
            >
              Отзывы
            </div>
          </div>
          {tab === "desc" ? (
            <p className={s.description}>{description}</p>
          ) : (
            <div className={s.product__review}>
              <div className={s.review__wrapper}>
                <ul>
                    <li >
                      <h6>Валерий</h6>
                      <span>{9.9} (средний рейтинг)</span>
                      <p className={s.rev_text}>Lorem, ipsum dolor.</p>
                    </li>
                </ul>
                <div className={s.rewiew__form}>
                  <form action="" onSubmit={submitHandler}>
                    <div className={s.form__group}>
                      <input
                        type="text"
                        placeholder="Введите имя"
                        ref={reviewUser}
                      />
                    </div>
                    <StarRating
                      maxRating={10}
                      size="24"
                      onSetRating={setRating}
                    />
                    <div className={s.form__group}>
                      <textarea
                        rows={4}
                        placeholder="опишите"
                        ref={reviewMsg}
                      />
                    </div>
                    <button className={s.submit_button}>Отправить</button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
        <h1 className={s.title}>Возможно вам понравится</h1>
        <ProductList data={relatedProducts} />
      </section>
    </section>
  );
};

export default ProductDetails;
