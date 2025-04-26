Hi Team,

I'm using the Braintrust.invoke method with the Vercel AI SDK's BraintrustAdapter.toAIStreamResponse to stream responses in my chat application. My prompt includes two tools, and I can see the tool calls and results in the Braintrust traces. However, in my useChat hook's messages array (from @ai-sdk/react), I only see the user input and the final output, with no tool calls or tool results.

My goal is to display the tool calls and tool results in the UI as they stream in, using the messages array in the useChat hook. I've tried setting the mode in the invoke function to both auto and parallel, but this hasn't resolved the issue.

Here’s a simplified version of my setup:
api/chat/route.ts:

```typescript

import { invoke } from "braintrust";
import { BraintrustAdapter } from "@braintrust/vercel-ai-sdk";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessageContent = messages[messages.length - 1]?.content || "";

  const stream = await invoke({
    projectName: "aisdk-braintrust",
    slug: "weather-chat-0ed7",
    input: { input: lastMessageContent },
    messages,
    stream: true,
    mode: "parallel",
  });

  return BraintrustAdapter.toAIStreamResponse(stream);
}
```

Chat Component with useChat Hook:
```typescript

import { useChat } from "@ai-sdk/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === "user" ? "User: " : "AI: "}
          {message.parts?.map((part, i) => (
            <div key={`${message.id}-${i}`}>
              {part.type === "text" && part.text}
              {part.type === "tool-invocation" && (
                <pre>{JSON.stringify(part.toolInvocation, null, 2)}</pre>
              )}
            </div>
          ))}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  );
}
```

Issue: The messages array in the useChat hook only contains the user input and final AI output, but no tool calls or results, even though they appear in the Braintrust traces.

Questions:
1. Is there a specific configuration in Braintrust.invoke or BraintrustAdapter.toAIStreamResponse needed to include tool calls and results in the streamed response for the Vercel AI SDK's useChat hook?

2. Could the issue be related to how the messages array is processed or formatted in the invoke call or the adapter?

3. Are there any recommended approaches to ensure tool calls and results are included in the messages array for real-time UI display?

Thank you for your help!

