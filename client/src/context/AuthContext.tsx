import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  GetTokenRes,
  User,
  UserFields,
  UserLoginFields,
} from "../interfaces/Auth";
import { ResError, ResMessage } from "../interfaces/Types";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// const baseUrl = import.meta.env.SERVER_URL; // ts is not working for some reason
// console.log("baseUrl", baseUrl);
const baseUrl = "http://localhost:3000";
interface AuthContextParams {
  user: User;
  authToken: string;
  registerMutation: UseMutationResult<
    GetTokenRes,
    AxiosError<ResMessage>,
    UserFields
  >;
  loginMutation: UseMutationResult<
    GetTokenRes,
    AxiosError<ResMessage>,
    UserLoginFields
  >;

  logout: () => void;
}

export const AuthContext = createContext<AuthContextParams>(
  {} as AuthContextParams
);

const showError = (errorMessage: string) => {
  console.error("Error while fetching data: ", errorMessage);
  toast.error(errorMessage);
};

const showSuccess = (successMessage: string) => {
  console.log("Data was fetched successfully: ", successMessage);
  toast.success(successMessage);
};

const showErrorRes = (error: ResError) => {
  const cusMessage = error?.response?.data.message as string; // what does cus mean? O.o
  const errorMessage = cusMessage && error.message;
  console.error("Failed: ", errorMessage);
  toast.error(errorMessage);
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const navigator = useNavigate();
  const [user, setUser] = useState<User>({} as User);
  const [authToken, setAuthToken] = useState<string>(
    localStorage.getItem("token") || ""
  );

  const handleAuthSuccess = (
    data: GetTokenRes | User,
    isShowSuccess: boolean = true
  ) => {
    let token = "";
    let user = {} as User;
    if ("token" in data) {
      token = data.token;
      user = data.user;
      setAuthToken(token);
      setUser(user);
      localStorage.setItem("token", token);
    } else {
      user = data;
      setUser(user);
    }

    if (isShowSuccess) {
      showSuccess("You have been successfully authorized");
      navigator("/profile");
    }
  };

  const getUserData = async () => {
    if (!authToken) return;

    await axios
      .get(`${baseUrl}/api/user/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((res) => {
        handleAuthSuccess(res.data, false);
      })
      .catch((error: ResError) => {
        logout();
        showError(error.message);
      });
  };

  useEffect(() => {
    getUserData();
  }, []);

  const registerMutation = useMutation<
    GetTokenRes,
    AxiosError<ResMessage>,
    UserFields
  >({
    mutationFn: async (data: UserFields) =>
      (await axios.post(`${baseUrl}/api/auth/register`, data)).data,
    onSuccess: (data: GetTokenRes) => {
      handleAuthSuccess(data);
    },
    onError: (error: ResError) => {
      showErrorRes(error);
    },
  });

  const loginMutation = useMutation<
    GetTokenRes,
    AxiosError<ResMessage>,
    UserLoginFields
  >({
    mutationFn: async (data: UserLoginFields) =>
      (await axios.post(`${baseUrl}/api/auth/login`, data)).data,
    onSuccess: (data: GetTokenRes) => {
      handleAuthSuccess(data);
    },
    onError: (error: ResError) => {
      showErrorRes(error);
    },
  });

  const logout = () => {
    setAuthToken("");
    setUser({} as User);
    localStorage.removeItem("token");
    navigator("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authToken,
        registerMutation,
        loginMutation,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextParams => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used withing AuthProvider");
  }
  return context;
};
