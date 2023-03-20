type RegisteredClientAppName = keyof typeof REGISTERED_CLIENTS;
export type RegisteredClient = {
  clientId: string;
  clientSecret: string;
};
const REGISTERED_CLIENTS = {
  WEB_APP: {
    CLIENT_ID: 'cb2039d0e35094521ae46a1d11b0ddd1',
    CLIENT_SECRET: 'bd45c244142c28df423e4ab43bfaeec323cb9aa3',
  },
  MOBILE_APP: {
    CLIENT_ID: 'cb2039d0e35094521ae46a1d11b0ddd1',
    CLIENT_SECRET: 'bd45c244142c28df423e4ab43bfaeec323cb9aa3',
  },
};

const mapRegisteredClientToClient = (): Record<
  RegisteredClientAppName,
  RegisteredClient
> => {
  const res: Record<RegisteredClientAppName, RegisteredClient> = {} as Record<
    RegisteredClientAppName,
    RegisteredClient
  >;
  Object.keys(REGISTERED_CLIENTS).forEach((key) => {
    res[key as RegisteredClientAppName] = {
      clientId: REGISTERED_CLIENTS[key as RegisteredClientAppName].CLIENT_ID,
      clientSecret:
        REGISTERED_CLIENTS[key as RegisteredClientAppName].CLIENT_SECRET,
    };
  });
  return res;
};
export const CLIENTS = mapRegisteredClientToClient();
