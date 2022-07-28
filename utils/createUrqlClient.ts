import { dedupExchange, Exchange, fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { LogoutMutation, MeQuery, MeDocument, LoginMutation, RegisterMutation, ChangeForgotPasswordMutation } from "../generated/graphql";
import { UpdateQuery } from "./updateQuery";
import {pipe, tap} from "wonka";
import Router  from "next/router";

const errorExchange: Exchange = ({forward}) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error?.message.includes("Not Authenticated")) {
        Router.replace("/login");
      }
    })
  )
}

export const createUrqlClient = (ssrExchange: any) => ({
    url: "http://localhost:4000/graphql",
    fetchOptions: {
      credentials: "include" as const,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        updates: {
          Mutation: {
            logout: (_result, args, cache, info) => {
              UpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({me: null})
              );
            },
            changeForgotPassword: (_result, args, cache, info) => {
              UpdateQuery<ChangeForgotPasswordMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.changeForgotPassword.errors) {
                    return query;
                  } else {
                    return {
                      me: result.changeForgotPassword.user,
                    };
                  }
                }
              );
            },
            login: (_result, args, cache, info) => {
              UpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query;
                  } else {
                    return {
                      me: result.login.user,
                    };
                  }
                }
              );
            },
            register: (_result, args, cache, info) => {
              UpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.register.errors) {
                    return query;
                  } else {
                    return {
                      me: result.register.user,
                    };
                  }
                }
              );
            },
          },
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
})