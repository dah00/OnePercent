import { colors } from "@/constants/colors";
import type { MessageResponse } from "@/lib/api";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

type EntryType = "text" | "voice" | "either";

type InspirationIdea = {
  id: string;
  category: string;
  prompt: string;
  examples: string[];
  suggestedEntryType: EntryType;
};

function dateKey(d: Date) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function seededPick<T>(arr: T[], seed: string): T | undefined {
  if (arr.length === 0) return undefined;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return arr[hash % arr.length];
}

export default function DailyInspirationCard({
  recentMessages,
  onStartEntry,
}: {
  recentMessages: MessageResponse[];
  onStartEntry: () => void;
}) {
  const ideas: InspirationIdea[] = [
    {
      id: "gratitude",
      category: "Gratitude",
      prompt:
        "Write one thing you’re grateful for today — and why it matters to you.",
      examples: ["A small win you noticed", "A person (or moment) that helped you"],
      suggestedEntryType: "text",
    },
    {
      id: "voice-gratitude",
      category: "Gratitude",
      prompt:
        "Record a 30-second voice note: what’s one thing you’re grateful for today?",
      examples: ["What happened?", "How did it make you feel?"],
      suggestedEntryType: "voice",
    },
    {
      id: "reflection-ladder",
      category: "Reflection",
      prompt:
        "Use the reflection ladder: What happened? Why does it matter? What will you do next?",
      examples: ["One sentence for each step", "Keep it honest and simple"],
      suggestedEntryType: "either",
    },
    {
      id: "learning-summary",
      category: "Learning",
      prompt:
        "Write a 2-line learning summary: Today I learned ____. Next time I’ll ____.",
      examples: ["A mistake turned into feedback", "A small insight that changed you"],
      suggestedEntryType: "either",
    },
    {
      id: "next-1-percent-step",
      category: "1% Next Step",
      prompt:
        "What’s the smallest next step you can take today to improve by 1%?",
      examples: ["A 5-minute action", "A message you can send right now"],
      suggestedEntryType: "text",
    },
    {
      id: "courage-micro",
      category: "Courage",
      prompt:
        "Write (or record) a micro-brave moment: What are you avoiding — and what tiny step can you try anyway?",
      examples: ["Make it small enough to start", "Name one fear and one counter-truth"],
      suggestedEntryType: "voice",
    },
    {
      id: "mindful-reset",
      category: "Mindful Reset",
      prompt:
        "Do a quick reset: 3 breaths, then write: What am I feeling right now — and what do I need?",
      examples: ["Need: clarity, rest, support, movement", "No judgment — just awareness"],
      suggestedEntryType: "either",
    },
    {
      id: "win-recap",
      category: "Win Recap",
      prompt:
        "What’s your win from today? Finish the sentence: Because I did ____, I got ____. ",
      examples: ["A habit you kept", "A tough thing you faced"],
      suggestedEntryType: "text",
    },
  ];

  const activeIdea = useMemo(() => {
    const textCount = recentMessages.filter((m) => m.message_type === "text").length;
    const voiceCount = recentMessages.filter((m) => m.message_type === "voice").length;

    const prefer: EntryType =
      textCount === voiceCount
        ? "either"
        : voiceCount > textCount
          ? "voice"
          : "text";

    const candidates =
      prefer === "either"
        ? ideas
        : ideas.filter((idea) => {
            if (prefer === "voice")
              return (
                idea.suggestedEntryType === "voice" ||
                idea.suggestedEntryType === "either"
              );
            return (
              idea.suggestedEntryType === "text" ||
              idea.suggestedEntryType === "either"
            );
          });

    return (
      seededPick(candidates, dateKey(new Date())) ??
      seededPick(ideas, dateKey(new Date())) ??
      ideas[0]
    );
  }, [ideas, recentMessages]);

  const recommendedLabel =
    activeIdea.suggestedEntryType === "either"
      ? "Text or Voice"
      : activeIdea.suggestedEntryType === "text"
        ? "Text"
        : "Voice";

  return (
    <View
      className="bg-backgroundSecondary rounded-2xl p-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-end mb-3">
 
        <View
          className="px-3 py-1 rounded-full"
          style={{
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text className="text-sm">{activeIdea.category}</Text>
        </View>
      </View>

      {/* Prompt */}
      <Text className="text-base" style={{ color: colors.textPrimary }}>
        {activeIdea.prompt}
      </Text>

      {/* Examples */}
      <View className="mt-3 gap-2">
        {activeIdea.examples.map((ex, idx) => (
          <Text key={idx} className="text-sm text-textSecondary">
            • {ex}
          </Text>
        ))}
      </View>

      {/* Action */}
      <Pressable
        onPress={onStartEntry}
        className="mt-4 bg-primary rounded-2xl px-4 py-3 items-center"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <Text className="text-backgroundSecondary text-base font-semibold">
          Turn into an entry
        </Text>
        <Text className="text-backgroundSecondary/80 text-xs mt-1">
          Recommended: {recommendedLabel}
        </Text>
      </Pressable>
    </View>
  );
}