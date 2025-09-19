export default {
  $id: 'auth/signup-request',
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      pattern: '^[a-zA-Z]+$',
    },
    lastName: {
      type: 'string',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
    },
    role: {
      type: 'string',
    },
    occupantType: {
      type: 'string',
      nullable: true,
    },
    unitId: {
      type: 'string',
      nullable: true,
    },
    unitSerialNumber: {
      type: 'string',
      nullable: true,
    },
  },
  required: ['firstName', 'lastName', 'email', 'password', 'role'],
};
