import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import CardContainerGrid from "../components/Containers/CardContainerGrid";
import searchStyles from "../styles/Search.module.css";

interface SearchProps {
  query: string;
}

const Search: NextPage<SearchProps> = ({ query }) => {
  const router = useRouter();
  const [categorySelector, setCategorySelector] = useState(0);

  useEffect(() => {
    if (query) {
      if (categorySelector === 0) {
      }
      if (categorySelector === 1) {
      }
      if (
        categorySelector === 2 ||
        categorySelector === 3 
      ) {
        
      }
    }
  }, [query, categorySelector]);

  useEffect(() => {
    if (router.query.c === "1") {
      setCategorySelector(1);
    } else if (router.query.c === "2") {
      setCategorySelector(2);
    } else if (router.query.c === "3") {
      setCategorySelector(3);
    } else {
      setCategorySelector(0);
    }
  }, [router]);

  return (
    <div className={searchStyles["search-page-root"]}>
      <Head>
        <title>Search</title>
      </Head>
      <div className={searchStyles["search-categories-fc"]}>
        <div
          onClick={() => {
            setCategorySelector(0);
            router.replace({pathname: './search', query: {q: query, c: 0}}, undefined, {shallow: true})
          }}
          id={
            categorySelector === 0
              ? searchStyles["search-category-active"]
              : undefined
          }
          className={searchStyles["search-category"]}
        >
          <h3>remasters</h3>
        </div>
        <div
          onClick={() => {
            setCategorySelector(1);
            router.replace({pathname: './search', query: {q: query, c: 1}}, undefined, {shallow: true})
          }}
          id={
            categorySelector === 1
              ? searchStyles["search-category-active"]
              : undefined
          }
          className={searchStyles["search-category"]}
        >
          <h3>users</h3>
        </div>
        <div
          onClick={() => {
            setCategorySelector(2);
            router.replace({pathname: './search', query: {q: query, c: 2}}, undefined, {shallow: true})
          }}
          id={
            categorySelector === 2
              ? searchStyles["search-category-active"]
              : undefined
          }
          className={searchStyles["search-category"]}
        >
          <h3>tracks</h3>
        </div>
        <div
          onClick={() => {
            setCategorySelector(3);
            router.replace({pathname: './search', query: {q: query, c: 3}}, undefined, {shallow: true})
          }}
          id={
            categorySelector === 3
              ? searchStyles["search-category-active"]
              : undefined
          }
          className={searchStyles["search-category"]}
        >
          <h3>albums</h3>
        </div>
      </div>
      <CardContainerGrid>

      </CardContainerGrid>
    </div>
  );
};

Search.getInitialProps = ({ query }) => {
  return {
    query: query.q as string,
  };
};

export default Search;
