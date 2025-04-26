/*
<ai_context>
Streams the final answer in real time as it arrives, while printing tool calls/results as blocks.
Filters out incremental JSON deltas and unrelated progress events.
2024-06-10
</ai_context>
*/

import { invoke } from "braintrust";

function tryParseJSON(data: unknown) {
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch {
    return null;
  }
}

async function main() {
  const result = await invoke({
    projectName: "aisdk-braintrust",
    slug: "weather-chat-0ed7",
    input: {
      input:
        "What is the weather in singapore in celcius? and give me a verbose 200 character fantasy story of the weather in singapore",
    },
    stream: true,
  });

  for await (const chunk of result) {
    // Stream the answer text in real time
    if (chunk.type === "text_delta" && typeof chunk.data === "string") {
      process.stdout.write(chunk.data);
    }
    // Handle tool calls and tool results
    else if (chunk.type === "progress") {
      const progressData = chunk.data && chunk.data.data;
      if (typeof progressData === "string") {
        const parsed = tryParseJSON(progressData);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (item.function_name && item.arguments) {
              // Tool call
              console.log("\n[TOOL CALL]:");
              console.log(`Function: ${item.function_name}`);
              console.log("Arguments:", item.arguments);
            }
          }
        } else if (parsed && parsed.celsius !== undefined) {
          // Tool result for temperature conversion
          console.log("\n[TOOL RESULT]:");
          console.log(parsed);
        } else if (
          parsed &&
          parsed.location &&
          parsed.temperature !== undefined
        ) {
          // Tool result for weather
          console.log("\n[TOOL RESULT]:");
          console.log(parsed);
        }
      }
    }
    // Print a newline at the end of the stream
    else if (chunk.type === "done") {
      process.stdout.write("\n");
    }
  }
}

// Yes this is successful and it has shown the two call and the two result so i suspect it's a a streaming portion to the Vercel AI SDK that has some issue.
main();
