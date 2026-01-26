import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {subjectsColors, voices} from '@/constants'
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

/**
 * A utility function to merge multiple classnames into a single string.
 * It uses the clsx library under the hood.
 * @param {...inputs} - A variable number of classnames to merge.
 * @returns {string} - A single string containing all the merged classnames.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/**
 * Returns the color associated with a given subject.
 * @param {string} subject - The subject to get the color for.
 * @returns {string} The color associated with the subject.
 */

export const getSubjectColor = (subject: string) => {
  return subjectsColors[subject as keyof typeof subjectsColors]
}


/**
 * Configures an assistant for a given voice and style.
 * @param {string} voice - The voice of the assistant.
 * @param {string} style - The style of the assistant.
 * @returns {CreateAssistantDTO} - The configured assistant.
 */
export const configureAssistant = (voice: string, style: string) => {
  //id for voice (male, female, casual/formal)
  const voiceId = voices[voice as keyof typeof voices][
          style as keyof (typeof voices)[keyof typeof voices]
          ] || "sarah";

  const vapiAssistant: CreateAssistantDTO = {
    name: "Companion",
    firstMessage:
        "Hello, let's start the session. Today we'll be talking about {{topic}}.",
    transcriber: {
      provider: "deepgram",
      model: "nova-3",
      language: "en",
    },
    voice: {
      provider: "11labs",
      voiceId: voiceId,
      stability: 0.4,
      similarityBoost: 0.8,
      speed: 1,
      style: 0.5,
      useSpeakerBoost: true,
    },
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a highly knowledgeable tutor teaching a real-time voice session with a student. Your goal is to teach the student about the topic and subject.

                    Tutor Guidelines:
                    Stick to the given topic - {{ topic }} and subject - {{ subject }} and teach the student about it.
                    Keep the conversation flowing smoothly while maintaining control.
                    From time to time make sure that the student is following you and understands you.
                    Break down the topic into smaller parts and teach the student one part at a time.
                    Keep your style of conversation {{ style }}.
                    Keep your responses short, like in a real voice conversation.
                    Do not include any special characters in your responses - this is a voice conversation.
              `,
        },
      ],
    },
    //clientMessages: [] ,
    //serverMessages: [],
  };
  return vapiAssistant;
};

