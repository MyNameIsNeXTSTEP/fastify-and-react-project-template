export default {
  $id: "base",
  type: "object",
  required: ["type", "method"],
  properties: {
    id: { type: "number" },
    type: { type: "string", enum: ["call"] },
    method: { type: "string" },
    params: { type: "object" },
    token: { type: "string" },
  },
};
