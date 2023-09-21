"use client";
// 모든 컴포넌트에서 가져올 수 있는 벨류 생성
// 벨류 -> 유저 정보의 인증 유무 - StateContext
// 유저 정보를 업데이트 하거나 인증 유무를 업데이트하는 것도 구현 - DispatchContext

import { User } from "@/types";
import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";

axios.defaults.withCredentials = true; // 쿠키 전송 허용

interface State {
  authenticated: boolean;
  user: User | undefined;
  loading: boolean;
  isAdmin: boolean;
}

const StateContext = createContext<State>({
  authenticated: false,
  user: undefined,
  loading: true,
  isAdmin: false,
});

const DispatchContext = createContext<any>(null);

interface Action {
  type: string;
  payload: any;
}

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case "LOGIN":
      return {
        ...state,
        authenticated: true,
        user: payload,
      };
    case "LOGOUT":
      return {
        ...state,
        authenticated: false,
        user: null,
      };
    case "STOP_LOADING":
      return {
        ...state,
        loading: false,
      };
    default:
      throw new Error(`어떠한 액션 타입도 아님: ${type}`);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, defaultDispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
    isAdmin: false,
  });

  const dispatch = (type: string, payload?: any) => {
    defaultDispatch({ type, payload });
  };

  // 로그인 유무에 따른 페이지 접근 허용을 위함
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await axios.get("http://localhost:4000/api/auth/me", {
          withCredentials: true,
        });

        dispatch("LOGIN", res.data);
      } catch (error) {
        console.error("요청 실패:", error); // 오류를 콘솔에 표시
      } finally {
        dispatch("STOP_LOADING");
      }
    }
    loadUser();
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
