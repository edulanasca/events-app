'use client';

import { ApolloProvider } from "@apollo/client";
import { UserProvider } from "eventsapp/context/UserProvider";
import client from "eventsapp/lib/apolloClient";
import { PropsWithChildren } from "react";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ApolloProvider client={client}>
      <UserProvider>
        {children}
      </UserProvider>
    </ApolloProvider>
  );
}