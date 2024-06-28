import { Link } from "react-router-dom";
import s from "./Signup.module.scss";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { setDoc, doc } from "firebase/firestore";
import { auth, db,storage } from "../../firebase.config";

import { toast } from "react-toastify";

const Signup:React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setIsLoading] = useState<boolean>(false);
  const signup = async (e:FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const storageRef = ref(storage, `images/${Date.now() + userName}`);
      const uploadTask = uploadBytesResumable(storageRef, file as File);
      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          toast.error(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(user, {
              displayName: userName,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "users", user.uid), {
              uid: user.uid,
              displayName: userName,
              email,
              photoUrl: downloadURL,
            });
          });
        }
      );

      setIsLoading(false);
      toast.success("Аккаунт успешно создан");
    } catch (error) {
      setIsLoading(false);
      toast.error("что-то пошло не так");
    }
  };
  return (
    <div className={s.login_block}>
      <h1 className={s.title}>Регистрация</h1>
      {loading ? (
        <h1>Загрузка</h1>
      ) : (
        <form className={s.form} onSubmit={signup}>
          <input
            type="text"
            placeholder="имя пользователя"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e:ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="пароль"
            value={password}
            onChange={(e:ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
          />
          <input
            type="file"
            placeholder="файл"
            onChange={(e:ChangeEvent<HTMLInputElement>) => setFile(e.target.files ? e.target.files[0]: null)}
          />
          <button type="submit">войти</button>
          <p>
            Уже есть аккаунт <Link to="/login"> Авторизоваться</Link>
          </p>
        </form>
      )}
    </div>
  );
};

export default Signup;