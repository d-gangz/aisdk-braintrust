import { invoke, initLogger } from "braintrust";
import { BraintrustAdapter } from "@braintrust/vercel-ai-sdk";

// Initialize the Braintrust logger with your project name and API key from the environment variable
initLogger({
  projectName: "aisdk-braintrust",
  apiKey: process.env.BRAINTRUST_API_KEY,
});

/*
<ai_context>
Updates the POST handler to pop out the last message from the messages array, perform necessary checks, and use the popped message's content as userMessage in the Braintrust invoke call. Adds detailed inline comments for clarity.
</ai_context>
*/
export async function POST(req: Request) {
  // Parse the request body to get the messages array
  const { messages } = await req.json();

  console.log("messages", messages);

  // // Ensure messages is an array and not empty
  // if (!Array.isArray(messages) || messages.length === 0) {
  //   // If messages is not an array or is empty, return an error response
  //   return new Response(JSON.stringify({ error: "No messages provided." }), {
  //     status: 400,
  //     headers: { "Content-Type": "application/json" },
  //   });
  // }

  // Pop out the last message from the messages array
  // const lastMessage = messages.pop();

  // console.log("lastMessage", lastMessage);

  // Check if the last message exists and has content
  // const lastMessageContent =
  //   lastMessage && lastMessage.content ? lastMessage.content : "";

  // Call invoke with the last message's content included in the input object
  const stream = await invoke({
    projectName: "aisdk-braintrust",
    slug: "weather-chat-0ed7",
    messages: messages,
    input: {},
    // input: {
    //   input: lastMessageContent, // Add the last message's content as userMessage
    // },
    stream: true,
    mode: "auto",
  });

  return BraintrustAdapter.toAIStreamResponse(stream);
}
