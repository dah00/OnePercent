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
  const contentRef = useRef<string>("");
  const { setOnSave } = useSaveEntry();
  const { createMessage } = useMessages();

  useEffect(() => {
    setOnSave(async (data) => {
      const content = contentRef.current ?? "";

      const result = await createMessage({
        title: data.title || null,
        focus_area: data.focusArea || null,
        content,
        message_type: "text",
      });
      if (!result.success && result.error) {
        return { success: false, error: result.error };
      }
      return { success: true };
    });

    const timer = setTimeout(() => {
      richText.current?.focusContentEditor();
    }, 500);

    return () => clearTimeout(timer);
  }, [setOnSave, createMessage]);

  return (
    <View className="flex-1 px-6">
      <RichEditor
        ref={richText}
        placeholder="I am proud I have achieved... "
        initialHeight={300}
        onChange={(text) => {
          contentRef.current = text;
        }}
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
