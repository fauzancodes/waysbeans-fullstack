import { createContext, useReducer } from "react";

export const UserContext = createContext();

const initialState = {
  isLogin: false,
  user: {},
};

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "USER_SUCCESS":
    case 'LOGIN_SUCCESS':
      localStorage.setItem("token", payload.token);
      if (payload.cart === null) {
        payload.cart = [];
      }
      if (payload.transaction === null) {
        payload.transaction = [];
      }
      if (payload.profile.photo === "") {
        payload.profile.photo = "/images/profile-picture-placeholder.webp";
      }
      return {
        isLogin: true,
        user: payload,
      };
    case "AUTH_ERROR":
    case 'LOGOUT':
      localStorage.removeItem("token");
      return {
        isLogin: false,
        user: {},
      };
    default:
      throw new Error();
  }
};

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};