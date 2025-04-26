/*
<ai_context>
Exports a function that returns the tools object for AI tool executions, making the code modular and reusable. Used by the chat API route.
Now includes Braintrust tracing: initializes the logger for the 'aisdk-braintrust' project and wraps tool execution functions with tracing for detailed span-level logs.
*/

import { tool } from "ai";
import { z } from "zod";
import { initLogger, wrapTraced } from "braintrust";

// Initialize the Braintrust logger for the project. The API key should be set in your environment variables.
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

// This function returns the tools object used for AI tool executions.
// Each tool is defined with its description, parameters, and execute logic.
export function getChatTools() {
  return {
    // Tool to get the weather for a given location (returns a random temperature for demo purposes)
    weather: tool({
      description: "Get the weather in a location (fahrenheit)",
      parameters: z.object({
        location: z.string().describe("The location to get the weather for"),
      }),
      execute: executeWeather,
    }),
    // Tool to convert a temperature from Fahrenheit to Celsius
    convertFahrenheitToCelsius: tool({
      description: "Convert a temperature in fahrenheit to celsius",
      parameters: z.object({
        temperature: z
          .number()
          .describe("The temperature in fahrenheit to convert"),
      }),
      execute: executeConvertFahrenheitToCelsius,
    }),
  };
}
