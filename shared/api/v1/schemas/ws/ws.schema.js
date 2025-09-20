export default {
  $id: "ws",
  method: "GET",
  url: "/ws/v1",
  schema: {
    tags: ["Websocket"],
    description: "WS API entrypoint",
    requestConfig: {
      baseURL: "http://localhost:3000/api/ws/v1",
    },
    response: {
      200: {
        type: "object",
        properties: {
          ok: {
            type: "boolean",
          },
        },
      },
    },
  },
};
