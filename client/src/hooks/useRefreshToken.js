import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });

    setAuth((prev) => {
      return {
        ...prev,
        role: response.data.role,
        accessToken: response.data.AccessToken,
      };
    });

    return response.data.AccessToken;
  };

  return refresh;
};

export default useRefreshToken;
