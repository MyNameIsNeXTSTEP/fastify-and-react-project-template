export default {
  $id: "auth/login-response",
  type: "object",
  required: ["code", "result"],
  properties: {
    code: {
      type: "number",
    },
    result: {
      type: "object",
      properties: {
        accountId: {
          type: "number",
        },
      },
    },
    cookies: {
      type: "object",
      properties: {
        accessToken: {
          type: "object",
          properties: {
            value: {
              type: "string",
            },
            secure: {
              type: "boolean",
            },
            expires: {
              type: "string",
            },
          },
        },
        refreshToken: {
          type: "object",
          properties: {
            value: {
              type: "string",
            },
            secure: {
              type: "boolean",
            },
            expires: {
              type: "string",
            },
          },
        },
      },
    },
  },
  additionalProperties: false,
};
