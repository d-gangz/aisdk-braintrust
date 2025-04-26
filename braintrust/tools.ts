/*
<ai_context>
Added two new tools to the Braintrust project: 
1. Weather tool: Returns a random temperature for a given location.
2. ConvertFahrenheitToCelsius tool: Converts a temperature from Fahrenheit to Celsius.
</ai_context>
*/
import * as braintrust from "braintrust";
import { z } from "zod";

const project = braintrust.projects.create({ name: "aisdk-braintrust" });

project.tools.create({
  handler: ({ location }) => {
    // Generate a random temperature between 32 and 90 (Fahrenheit)
    const temperature = Math.round(Math.random() * (90 - 32) + 32);
    return { location, temperature };
  },
  name: "Weather",
  slug: "weather",
  description: "Get the weather in a location (fahrenheit)",
  parameters: z.object({
    location: z.string().describe("The location to get the weather for"),
  }),
  returns: z.object({
    location: z.string(),
    temperature: z.number(),
  }),
  ifExists: "replace",
});

project.tools.create({
  handler: ({ temperature }) => {
    // Convert Fahrenheit to Celsius using the formula: (F - 32) * 5/9
    const celsius = Math.round((temperature - 32) * (5 / 9));
    return { celsius };
  },
  name: "Convert Fahrenheit to Celsius",
  slug: "convert-fahrenheit-to-celsius",
  description: "Convert a temperature in fahrenheit to celsius",
  parameters: z.object({
    temperature: z
      .number()
      .describe("The temperature in fahrenheit to convert"),
  }),
  returns: z.object({
    celsius: z.number(),
  }),
  ifExists: "replace",
});
