import React from "react";
import { Image, Pressable, Text, View } from "react-native";

// ─── Types ─────────────────────────────────────────────────────────────────

// ─── Constants ─────────────────────────────────────────────────────────────

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * What are we going to need?
 * - filter by All/Voice/Text
 * - filter Month? OR pagination
 */

const LogsHistory = () => {
  return (
    <View
      className="bg-backgroundSecondary rounded-2xl "
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      }}
    >
      {/* filters */}
      <View>
        <View>
          <Pressable>
            <View>
              <Image />
              <Text></Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default LogsHistory;
