import { colors } from "@/constants/colors";
import { useSaveEntry } from "@/lib/contexts/SaveEntryContext";
import { useMessages } from "@/lib/hooks/useMessages";
import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";

const WriteEntry = () => {
  const richText = useRef<RichEditor>(null);
  const { setOnSave } = useSaveEntry();
  const { createMessage } = useMessages();

  useEffect(() => {
    setOnSave(() => {
      // createMessage()
    });

    // Focus the editor when component mounts
    const timer = setTimeout(() => {
      richText.current?.focusContentEditor();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 px-6">
      {/* Write entry specific content goes here */}
      <RichEditor
        ref={richText}
        placeholder="I am proud I have achieved... "
        initialHeight={300}
        editorStyle={{
          color: colors.textPrimary,
          contentCSSText: "font-size: 16px; line-height: 24px; padding: 12px;",
        }}
        containerStyle={styles.editorContainer}
      />

      {/* TODO: 
            - Fix the button color and backgroundColor
            - keep the Text editor tools above the keyboard when text input goes below the keyboard
     */}
      <RichToolbar
        editor={richText}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
          actions.setStrikethrough,
          actions.undo,
          actions.redo,
        ]}
        iconTint={colors.textPrimary}
        selectedIconTint={colors.primary}
        selectedButtonStyle={{ backgroundColor: colors.button }}
        style={{ backgroundColor: colors.border, borderRadius: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  editorContainer: {
    flex: 1,
    borderRadius: 8,
  },
});

export default WriteEntry;
