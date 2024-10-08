import React, { ChangeEvent,useEffect,useState } from "react";
import { products } from "../../Constants";
import { useNavigate } from "react-router";
import search from "../../assets/iconsearch.svg";
import s from "./Search.module.scss";
import { Product } from "../../types/types";    


const Search:React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(()=>{
    const callback = (e:KeyboardEvent)=>{
      if(e.code === "Enter" && searchTerm.length > 0){
       handleIconClick();
      }
    };
      document.addEventListener("keydown",callback);
      return ()=>{
        document.removeEventListener("keydown",callback)
      }
    
  },[searchTerm])




  // For changes in input
  const handleSearchChange = (e:ChangeEvent<HTMLInputElement>):void => {
    const value = e.target.value;

    if (value) {
      setSearchTerm(value);
      const filtered = products.filter((product) =>
        product.productName.toLowerCase().includes(value.toLowerCase())
      );

      setFilteredProducts(filtered);
    } else {
      setSearchTerm("");
      setFilteredProducts([]);
    }
  };

  
  // for list
  const handleProductClick = (product:Product) => {
    setSearchTerm(product.productName);
    navigate(`/shop/${product.id}`);
    setFilteredProducts([]);
  };
  // icon
  const handleIconClick = ():void => {
    const filtered = products.filter((product) =>
      product.productName
        .toLowerCase()
        .includes(searchTerm.toLowerCase().trim())
    );
    if (filtered.length > 0) {
      navigate(`/shop/${filtered[0].id}`);
      setFilteredProducts([]);
    } else {
      alert("Товар не найден");
    }
  };

  return (
    <div className={s.search_block}>
      <div className={s.search }>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Поиск товара..."
          className={s.input}
        />
        <img
          src={search}
          className={s.search_icon}
          onClick={searchTerm.length > 0 ? handleIconClick : undefined}
        ></img>
      </div>

      {filteredProducts.length > 0 && (
        <ul className={s.list}>
          {filteredProducts.map((product) => (
            <li key={product.id} onClick={() => handleProductClick(product)}>
              {product.productName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
