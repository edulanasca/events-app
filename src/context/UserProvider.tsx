'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, gql, ApolloError } from '@apollo/client';

const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
    }
  }
`;

type User = {
  id: string;
  name: string;
  email: string;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  error: ApolloError | undefined;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data, loading, error } = useQuery(ME_QUERY);
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    if (data) {
      setUser(data.me);
    }
  }, [data, data?.me]);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};