import React from "react";
import { useMeQuery } from "../../generated/graphql";
import BasicHeaderLink from "../HeaderLinks/BasicHeaderLink";
import {FiUser} from 'react-icons/fi'
import headerStyles from "./Header.module.css";
import SearchInput from "../SearchInput/SearchInput";

const Header: React.FC = () => {
  const [{ data, fetching }] = useMeQuery();

  let userLink;
  if (fetching) {
    userLink = null;
  } else if (!data?.me) {
    userLink = <BasicHeaderLink label="log in" path="/login" Icon={FiUser} />;
  } else {
    userLink = (
      <BasicHeaderLink label="profile" path="/profile" Icon={FiUser} />
    );
  }

  return (
    <div className={headerStyles["header-root"]}>
      <div className={headerStyles["header-links"]}>
        <div className={headerStyles["header-link"]}>{userLink}</div>
      </div>
      <div className={headerStyles["header-search"]}>
        <SearchInput/>
      </div>
    </div>
  );
};

export default Header;
