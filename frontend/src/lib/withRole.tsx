import { getUserWithRole } from './auth';
import { redirect } from 'next/navigation';
import React from 'react';

export function withRole<T>(Component: (props: T) => JSX.Element, role: string) {
  return async function Wrapped(props: T) {
    const session = await getUserWithRole();
    if (session?.role !== role) {
      redirect('/');
    }
    return <Component {...props} />;
  };
}
