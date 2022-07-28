import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMeQuery } from "../../generated/graphql";
import requireAuthStyles from "./RequireAuth.module.css";
import { WaveSpinner } from "react-spinners-kit";

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({children}) => {
  const [{ data, fetching }] = useMeQuery();
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!fetching && !data?.me) {
      router.replace("/login");
    } else if (!fetching && data?.me) {
      setIsAuth(true)
    }
  }, [fetching, data, router]);

  return (
    <>
    {!isAuth ? <div className={requireAuthStyles["require-auth-root"]}><WaveSpinner size={5} color="#000" loading={true} sizeUnit="vmin"/></div> : <>{children}</>}
    </>
  );
};
export default RequireAuth;

