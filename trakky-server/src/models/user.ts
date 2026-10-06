// Single tenant: no user/owner-of-record column on any table (see prisma/schema.prisma).
// Authentication gates access to the API, it does NOT partition data: every identity that
// passes openIdAuth reads and writes the same shared dataset.
export interface User {
    email: string;
    email_verified: boolean;
    name: string;
    given_name: string;
    preferred_username: string;
    nickname: string;
    groups: string[];
    sub: string
  }