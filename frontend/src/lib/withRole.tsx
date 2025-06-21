'use client';

import React, { ComponentType } from 'react';
import { RoleGate } from './RoleGate';
import type { Role } from './auth';

/** HOC that wraps a page/component with a client-side RoleGate. */
export function withRole<P extends object>(
  Component: ComponentType<P>,
  ...allow: Role[]
): ComponentType<P> {
  return function Wrapped(props: P) {
    return (
      <RoleGate allow={allow}>
        <Component {...props} />
      </RoleGate>
    );
  };
}
