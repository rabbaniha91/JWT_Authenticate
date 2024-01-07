import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState("");
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const controller = new AbortController();
    let isMount = true;

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/admin/getUsers", {
          signal: controller.signal,
        });
        isMount && setUsers(response?.data);
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          navigate("/login", { state: { from: location }, replace: true });
        }
      }
    };

    getUsers()
    return () => {
      isMount = false;
      controller.abort();
    };
  }, []);
  console.log(users);
  return (
    <div>
      <ul>{}</ul>
    </div>
  );
};

export default Users;
