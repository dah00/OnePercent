import AudioWaveformView from "@/components/Recording/AudioWaveformView";
import { icons } from "@/constants/icons";
import { useSaveEntry } from "@/lib/contexts/SaveEntryContext";
import useAudioRecorderHook from "@/lib/hooks/useAudioRecorderHook";
import React, { useEffect, useRef, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

const RecordEntry = () => {
  const [recordTimer, setRecordTimer] = useState<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { setOnSave } = useSaveEntry();
  const {
    recordingInProgress,
    currentDecibel,
    audioUri,
    startOrStopRecording,
    waveformHeights,
    resetWaveform,
  } = useAudioRecorderHook();

  useEffect(() => {
    setOnSave(() => {
      // createMessage()
      // Upload voice
    });
  }, []);

  // Manage interval based on isRecording state
  useEffect(() => {
    if (recordingInProgress) {
      // Start timer when recording starts
      intervalRef.current = setInterval(() => {
        setRecordTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [recordingInProgress]);

  const formatWithDigits = (num: number, digits: number = 2): string => {
    return num.toString().padStart(digits, "0");
  };

  // Convert seconds to MM:SS format
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${formatWithDigits(mins)}:${formatWithDigits(secs)}`;
  };

  const handleReset = () => {
    setRecordTimer(0);
    resetWaveform();
  };

  return (
    <View>
      {/* Replace the placeholder View with AudioWaveform */}
      <View className="h-64 justify-center items-center">
        <AudioWaveformView waveformHeights={waveformHeights} />
        {currentDecibel != null && (
          <Text style={{ marginBottom: 10 }}>
            {currentDecibel.toFixed(1)} dB
          </Text>
        )}
      </View>

      <View className="flex-row justify-around items-center">
        <Pressable
          onPress={handleReset}
          disabled={recordTimer <= 0 || recordingInProgress}
        >
          <Text
            className={`text-2xl ${
              recordTimer <= 0 || recordingInProgress
                ? "text-button"
                : "text-textPrimary"
            }`}
          >
            Reset
          </Text>
        </Pressable>
        <Pressable onPress={startOrStopRecording}>
          {recordingInProgress ? (
            <Image source={icons.recording} className="w-14 h-14" />
          ) : (
            <Image source={icons.record} className="w-14 h-14" />
          )}
        </Pressable>
        <Text className="text-2xl">{formatTime(recordTimer)}</Text>
      </View>
    </View>
  );
};

export default RecordEntry;
