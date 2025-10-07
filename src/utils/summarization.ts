import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";

/**
 * Generates a summary and cool facts for a GitHub repository from its README content.
 * @param readmeContent - The README content as a string
 * @returns Promise with summary and cool facts
 */
export async function generateRepositorySummary(readmeContent: string): Promise<{
  summary: string;
  cool_facts: string[];
}> {
  const chain = createRepositorySummarizerChain();
  return await chain.invoke({ readme: readmeContent });
}

/**
 * Creates a LangChain chain that summarizes a GitHub repository from its README content.
 * The chain takes an object: { readme: string }
 * and returns: { summary: string, cool_facts: string[] }
 */
function createRepositorySummarizerChain(): import("@langchain/core/runnables").Runnable<
  { readme: string },
  { summary: string; cool_facts: string[] }
> {
  // Define the output schema for pretty, structured results
  const outputSchema = z.object({
    summary: z
      .string()
      .describe("A clear, concise, and engaging summary of the repository."),
    cool_facts: z
      .array(z.string())
      .describe("A list of interesting, unique, or impressive facts about the repository."),
  });

  // Compose a friendly, helpful prompt
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      [
        "You are a world-class technical writer and open source enthusiast.",
        "Given the README file content of a GitHub repository, your job is to:",
        "1. Write a beautiful, concise summary of what the repository is and does.",
        "2. List several cool, unique, or impressive facts about the repository.",
        "Format your answer as a JSON object with a 'summary' (string) and 'cool_facts' (array of strings).",
        "Be engaging, clear, and helpful.",
      ].join(" "),
    ],
    [
      "human",
      [
        "Summarize this GitHub repository from this README file content:",
        "-----",
        "{readme}",
        "-----",
      ].join("\n"),
    ],
  ]);

  // Use a modern, creative LLM
  const llm = new ChatOpenAI({
    model: "gpt-4-0125-preview",
    temperature: 0.3,
  });

  // Build and return the chain
  return prompt.pipe(llm.withStructuredOutput(outputSchema));
}
