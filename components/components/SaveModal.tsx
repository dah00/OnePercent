import { icons } from "@/constants/icons";
import { useSaveEntry } from "@/lib/contexts/SaveEntryContext";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Button from "../Button";
import TextField from "../TextField";

interface SaveModalProps {
  showSaveModal: boolean;
  setShowSaveModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SaveModal = ({ showSaveModal, setShowSaveModal }: SaveModalProps) => {
  const [title, setTitle] = useState<string>("");
  const [focusArea, setFocusArea] = useState<string>("");
  const { onSave } = useSaveEntry();

  const closeModal = () => setShowSaveModal(false);

  const handleSave = async () => {
    Toast.show({
      type: "success",
      text1: "+1% Better",
      text2: "New log saved successfully",
    });
    const result = await onSave({ title, focusArea });
    closeModal();
    if (result?.success) {
      router.replace("/(tabs)/Home");
    } else if (result && !result.success) {
      Toast.show({
        type: "error",
        text1: "Save failed",
        text2: result.error ?? "Please try again.",
      });
    }
  };

  return (
    <Modal visible={showSaveModal} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 15}
      >
        <Pressable
          className="flex-1 justify-center items-center bg-black/50"
          onPress={closeModal}
        >
          <View className="bg-white rounded-xl w-[80%] pt-20 pb-8 px-6">
            <View className="absolute top-6 right-6">
              <Pressable onPress={closeModal} hitSlop={12}>
                <Image source={icons.close_cross} className="w-6 h-6" />
              </Pressable>
            </View>
            <View className="gap-2">
              <TextField
                placeholder="Title (Optional)"
                autoCapitalize="words"
                secureTextEntry={false}
                value={title}
                isRequired={false}
                onChangeText={setTitle}
                showError={false}
              />
              <TextField
                placeholder="Focus Area (Optional)"
                autoCapitalize="words"
                secureTextEntry={false}
                value={focusArea}
                isRequired={false}
                onChangeText={setFocusArea}
                showError={false}
              />
            </View>
            <View className="items-center mt-8">
              <Button text="Save" onPress={handleSave} size="md" />
            </View>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default SaveModal;
