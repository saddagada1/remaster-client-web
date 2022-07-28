import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ChangeForgotPasswordInput = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};

export type ChangePasswordInput = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changeEmail: UserResponse;
  changeForgotPassword: UserResponse;
  changePassword: UserResponse;
  changeUsername: UserResponse;
  createRemaster: Remaster;
  deleteRemaster: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  sendVerifyEmail: Scalars['Boolean'];
  updateRemaster?: Maybe<Remaster>;
  verifyEmail: UserResponse;
};


export type MutationChangeEmailArgs = {
  newEmail: Scalars['String'];
};


export type MutationChangeForgotPasswordArgs = {
  changeFpOptions: ChangeForgotPasswordInput;
};


export type MutationChangePasswordArgs = {
  changePasswordOptions: ChangePasswordInput;
};


export type MutationChangeUsernameArgs = {
  newUsername: Scalars['String'];
};


export type MutationCreateRemasterArgs = {
  name: Scalars['String'];
};


export type MutationDeleteRemasterArgs = {
  id: Scalars['Float'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['Float'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  loginOptions: LoginInput;
};


export type MutationRegisterArgs = {
  registerOptions: RegisterInput;
};


export type MutationUpdateRemasterArgs = {
  id: Scalars['Float'];
  name?: InputMaybe<Scalars['String']>;
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  remaster?: Maybe<Remaster>;
  remasters: Array<Remaster>;
  users: Array<User>;
};


export type QueryRemasterArgs = {
  id: Scalars['Float'];
};

export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type Remaster = {
  __typename?: 'Remaster';
  _id: Scalars['Float'];
  createdAt: Scalars['String'];
  creatorId: Scalars['Float'];
  likes: Scalars['Float'];
  name: Scalars['String'];
  playbackURL: Scalars['String'];
  trackId: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['Float'];
  createdAt: Scalars['String'];
  email: Scalars['String'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
  verified: Scalars['Boolean'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type RegularErrorFragment = { __typename?: 'FieldError', field: string, message: string };

export type RegularUserFragment = { __typename?: 'User', _id: number, email: string, username: string, verified: boolean };

export type RegularUserResponseFragment = { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', _id: number, email: string, username: string, verified: boolean } | null };

export type ChangeEmailMutationVariables = Exact<{
  newEmail: Scalars['String'];
}>;


export type ChangeEmailMutation = { __typename?: 'Mutation', changeEmail: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', _id: number, email: string, username: string, verified: boolean } | null } };

export type ChangeForgotPasswordMutationVariables = Exact<{
  changeFpOptions: ChangeForgotPasswordInput;
}>;


export type ChangeForgotPasswordMutation = { __typename?: 'Mutation', changeForgotPassword: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', _id: number, email: string, username: string, verified: boolean } | null } };

export type ChangePasswordMutationVariables = Exact<{
  changePasswordOptions: ChangePasswordInput;
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', _id: number, email: string, username: string, verified: boolean } | null } };

export type ChangeUsernameMutationVariables = Exact<{
  newUsername: Scalars['String'];
}>;


export type ChangeUsernameMutation = { __typename?: 'Mutation', changeUsername: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', _id: number, email: string, username: string, verified: boolean } | null } };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  loginOptions: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', _id: number, email: string, username: string, verified: boolean } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  registerOptions: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', _id: number, email: string, username: string, verified: boolean } | null } };

export type SendVerifyEmailMutationVariables = Exact<{ [key: string]: never; }>;


export type SendVerifyEmailMutation = { __typename?: 'Mutation', sendVerifyEmail: boolean };

export type VerifyEmailMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', verifyEmail: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', _id: number, email: string, username: string, verified: boolean } | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', _id: number, email: string, username: string, verified: boolean } | null };

export type RemastersQueryVariables = Exact<{ [key: string]: never; }>;


export type RemastersQuery = { __typename?: 'Query', remasters: Array<{ __typename?: 'Remaster', _id: number, createdAt: string, updatedAt: string, name: string }> };

export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  _id
  email
  username
  verified
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const ChangeEmailDocument = gql`
    mutation ChangeEmail($newEmail: String!) {
  changeEmail(newEmail: $newEmail) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useChangeEmailMutation() {
  return Urql.useMutation<ChangeEmailMutation, ChangeEmailMutationVariables>(ChangeEmailDocument);
};
export const ChangeForgotPasswordDocument = gql`
    mutation ChangeForgotPassword($changeFpOptions: ChangeForgotPasswordInput!) {
  changeForgotPassword(changeFpOptions: $changeFpOptions) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useChangeForgotPasswordMutation() {
  return Urql.useMutation<ChangeForgotPasswordMutation, ChangeForgotPasswordMutationVariables>(ChangeForgotPasswordDocument);
};
export const ChangePasswordDocument = gql`
    mutation ChangePassword($changePasswordOptions: ChangePasswordInput!) {
  changePassword(changePasswordOptions: $changePasswordOptions) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const ChangeUsernameDocument = gql`
    mutation ChangeUsername($newUsername: String!) {
  changeUsername(newUsername: $newUsername) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useChangeUsernameMutation() {
  return Urql.useMutation<ChangeUsernameMutation, ChangeUsernameMutationVariables>(ChangeUsernameDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($loginOptions: LoginInput!) {
  login(loginOptions: $loginOptions) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($registerOptions: RegisterInput!) {
  register(registerOptions: $registerOptions) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const SendVerifyEmailDocument = gql`
    mutation SendVerifyEmail {
  sendVerifyEmail
}
    `;

export function useSendVerifyEmailMutation() {
  return Urql.useMutation<SendVerifyEmailMutation, SendVerifyEmailMutationVariables>(SendVerifyEmailDocument);
};
export const VerifyEmailDocument = gql`
    mutation VerifyEmail($token: String!) {
  verifyEmail(token: $token) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useVerifyEmailMutation() {
  return Urql.useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(VerifyEmailDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const RemastersDocument = gql`
    query Remasters {
  remasters {
    _id
    createdAt
    updatedAt
    name
  }
}
    `;

export function useRemastersQuery(options?: Omit<Urql.UseQueryArgs<RemastersQueryVariables>, 'query'>) {
  return Urql.useQuery<RemastersQuery>({ query: RemastersDocument, ...options });
};