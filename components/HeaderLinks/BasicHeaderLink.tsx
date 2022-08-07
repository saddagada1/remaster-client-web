import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IconType } from "react-icons";
import basicLinkStyles from "./BasicHeaderLink.module.css";

interface BasicHeaderLinkProps {
  label: string;
  path: string;
  Icon: IconType;
}

const BasicHeaderLink: React.FC<BasicHeaderLinkProps> = ({label, path, Icon}) => {
  const router = useRouter();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (router.pathname.includes(path)) {
      setActive(true);
    } else {
      setActive(false);
    }//
  }, [router, path])
  
  return (
    <Link href={path}>
      <div id={active ? basicLinkStyles["basic-header-link-active"] : undefined} className={basicLinkStyles["basic-header-link-root"]}>
        <a>{label}</a>
        <Icon/>
      </div>
    </Link>
  );
};
export default BasicHeaderLink;
