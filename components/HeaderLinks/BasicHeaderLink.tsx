import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import basicLinkStyles from "./BasicHeaderLink.module.css";

interface BasicHeaderLinkProps {
  label: string;
  path: string;
  icon: IconDefinition;
}

const BasicHeaderLink: React.FC<BasicHeaderLinkProps> = ({label, path, icon}) => {
  const router = useRouter();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (router.pathname.includes(path)) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [router, path])
  
  return (
    <Link href={path}>
      <div id={active ? basicLinkStyles["basic-header-link-active"] : undefined} className={basicLinkStyles["basic-header-link-root"]}>
        <a>{label}</a>
        <FontAwesomeIcon icon={icon} />
      </div>
    </Link>
  );
};
export default BasicHeaderLink;
