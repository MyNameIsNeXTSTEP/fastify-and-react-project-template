export const enum ERoles {
  ADMIN = 'admin',
  USER = 'user',
};

export type TRoles = keyof typeof ERoles;
