import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase.config";

type CurrentUser = object | null
const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>({});
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  });

  return {
    currentUser,
  };
};

export default useAuth;