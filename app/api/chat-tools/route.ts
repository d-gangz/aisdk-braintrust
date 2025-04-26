/*
<my_thoughts>
This is not working out well. Just ignore for now.
<my_thoughts>
<ai_context>
Handles POST requests for chat tool calls. After invoking Braintrust, buffers all json_delta data chunks as strings, then when the stream is finished (type === 'done'), joins and parses the data, and executes the correct function with parsed arguments. Includes extensive inline comments for clarity.
</ai_context>
*/

import { BraintrustAdapter } from "@braintrust/vercel-ai-sdk";
import { invoke, initLogger, wrapTraced } from "braintrust";

// Initialize the Braintrust logger with your project name and API key from the environment variable
initLogger({
  projectName: "aisdk-braintrust",
  apiKey: process.env.BRAINTRUST_API_KEY,
});

// Execution function for the weather tool, now wrapped with tracing
const executeWeather = wrapTraced(
  async function executeWeather({ location }: { location: string }) {
    // Generate a random temperature between 32 and 90 (Fahrenheit)
    const temperature = Math.round(Math.random() * (90 - 32) + 32);
    return {
      location,
      temperature,
    };
  },
  {
    name: "executeWeather",
    type: "tool",
  }
);

// Execution function for converting Fahrenheit to Celsius, now wrapped with tracing
const executeConvertFahrenheitToCelsius = wrapTraced(
  async function executeConvertFahrenheitToCelsius({
    temperature,
  }: {
    temperature: number;
  }) {
    // Convert Fahrenheit to Celsius using the formula: (F - 32) * 5/9
    const celsius = Math.round((temperature - 32) * (5 / 9));
    return {
      celsius,
    };
  },
  {
    name: "executeConvertFahrenheitToCelsius",
    type: "tool",
  }
);

export async function POST(req: Request) {
  const { messages } = await req.json();

  const stream = await invoke({
    projectName: "aisdk-braintrust",
    slug: "weather-chat-tool-call-only-8660",
    messages,
    input: {},
    stream: true,
    mode: "auto",
  });

  // Buffer to collect the full stream for inspection
  const fullStream: unknown[] = [];
  // Buffer to collect all json_delta data as strings
  let jsonDeltaBuffer = "";
  // Buffer to collect tool call results
  const toolResults: unknown[] = [];

  // Iterate over the stream to print each chunk and collect the full stream
  for await (const chunk of stream) {
    console.log("STREAM CHUNK", chunk);
    fullStream.push(chunk);
    // If chunk is json_delta, append its data to the buffer
    if (chunk.type === "json_delta" && typeof chunk.data === "string") {
      jsonDeltaBuffer += chunk.data;
    }
    // If chunk type is 'done', the stream is finished
    if (chunk.type === "done") {
      // Try to parse the collected json_delta buffer
      let parsed;
      try {
        parsed = JSON.parse(jsonDeltaBuffer);
      } catch (err) {
        console.error("Failed to parse tool call JSON:", jsonDeltaBuffer, err);
        break;
      }
      // Tool calls are always arrays of tool call objects
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          // Check for the function call structure
          if (item.name && typeof item.name === "string") {
            if (item.name === "weather" && typeof item.location === "string") {
              // Call the executeWeather function with the location argument
              const result = await executeWeather({ location: item.location });
              toolResults.push({ tool: item.name, result });
            } else if (
              item.name === "convertFahrenheitToCelsius" &&
              typeof item.temperature === "number"
            ) {
              // Call the executeConvertFahrenheitToCelsius function with the temperature argument
              const result = await executeConvertFahrenheitToCelsius({
                temperature: item.temperature,
              });
              toolResults.push({ tool: item.name, result });
            } else {
              throw new Error(
                `Unknown tool name or invalid arguments: ${JSON.stringify(
                  item
                )}`
              );
            }
          }
        }
      }
      // No more tool calls to process after 'done'
      break;
    }
  }

  console.log("FULL STREAM", fullStream);
  console.log("TOOL RESULTS", toolResults);

  // Return the stream as usual for the frontend
  return BraintrustAdapter.toAIStreamResponse(stream);
}
