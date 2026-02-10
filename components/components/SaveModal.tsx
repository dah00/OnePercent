import { useSaveEntry } from "@/lib/contexts/SaveEntryContext";
import React, { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
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

  const handleSave = () => {
    onSave({ title, focusArea });
    closeModal();
  };

  return (
    <Modal visible={showSaveModal} animationType="slide" transparent>
      <Pressable
        className="flex-1 justify-center items-center bg-black/50"
        onPress={closeModal}
      >
        <Pressable
          className="bg-white rounded-xl w-[80%] pt-20 pb-8 px-6"
          onPress={() => {}}
        >
          <View className="absolute top-6 right-8">
            <Pressable onPress={closeModal} hitSlop={12}>
              <Text className="font-bold text-xl">X</Text>
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
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default SaveModal;
