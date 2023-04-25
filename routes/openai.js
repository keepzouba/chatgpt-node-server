import { Configuration, OpenAIApi } from "openai";

// const chatApi = new ChatGPTAPI({
//   apiKey: "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",
// });

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const messagesHistory = [
  { role: "system", content: "You are a helpful assistant." },
]; // 历史数据

export default async function (fastify, opts) {
  fastify.post(
    "/chat",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
          required: ["message"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              content: { type: "object" },
            },
          },
        },
      },
    },
    async function (request, reply) {
      try {
        const { message } = request.body;

        const currentMessage = { role: "user", content: message };

        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: messagesHistory.concat(currentMessage),
        });

        const assistantMessage = completion.data.choices[0];

        console.log("assistantMessage", assistantMessage, completion);
        messagesHistory.push(assistantMessage.message);

        // console.log(completion.data.choices[0].message);

        reply.send({ content: completion });
      } catch (error) {
        // reply.send({ content: { success: false, message: error } });
        throw new Error(error);
      }
    }
  );

  fastify.get(
    "/modals",
    {
      schema: {

        response: {
          200: {
            type: "object",
            properties: {
              content: { type: "object" },
            },
          },
        },
      },
    },
    async function (request, reply) {
      try {
        const modals = await openai.listModels();
        console.log("modals", modals);
        reply.send({ content: modals });
      } catch (error) {
        //   reply.send({ content: { success: false, message: error } });
        throw new Error(error);
      }
    }
  );
}
