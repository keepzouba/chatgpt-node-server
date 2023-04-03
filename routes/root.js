"use strict";

import { ChatGPTAPI } from "chatgpt";

const chatApi = new ChatGPTAPI({
  apiKey: "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",
});

export default async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    return { root: true };
  });

  fastify.post(
    "/chat",
    {
      schema: {
        // querystring: {
        //   text: { type: "string" },
        // },
        body: {
          type: "object",
          properties: {
            text: { type: "string" },
          },
          required: ["text"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              hello: { type: "string" },
            },
          },
        },
      },
    },
    async function (request, reply) {
      console.log(request.body);

      const { text } = request.body;

      const res = await chatApi.sendMessage(text);

      reply.send({ hello: res.text });
    }
  );
}
