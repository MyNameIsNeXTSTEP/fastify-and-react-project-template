export default {
  $id: 'auth/signup-response',
  type: 'object',
  required: ['code', 'cookies', 'data'],
  properties: {
    code: {
      type: 'number',
    },
    cookies: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'object',
          properties: {
            value: {
              type: 'string',
            },
            secure: {
              type: 'boolean',
            },
            expires: {
              type: 'string',
            },
          },
        },
        refreshToken: {
          type: 'object',
          properties: {
            value: {
              type: 'string',
            },
            secure: {
              type: 'boolean',
            },
            expires: {
              type: 'string',
            },
          },
        },
      },
    },
    data: {
      type: 'object',
      properties: {
        accountId: {
          type: 'number',
        },
        profileId: {
          type: 'number',
        },
        role: {
          type: 'string',
        },
      },
    },
  },
};