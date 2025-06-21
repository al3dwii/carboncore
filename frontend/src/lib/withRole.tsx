import { RoleGate } from './RoleGate';
import { type Role } from './auth';

export function withRole<P>(Component: React.ComponentType<P>, ...allow: Role[]) {
  return function Wrapped(props: P) {
    return (
      // @ts-expect-error — RoleGate is async (Server) but we can embed it
      <RoleGate allow={allow}>
        <Component {...props} />
      </RoleGate>
    );
  };
}
