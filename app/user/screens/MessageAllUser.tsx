import React, { useEffect, useState } from "react";
// @ts-ignore
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { View, ActivityIndicator } from "react-native";

import BanBeTab from "../components/BanBeTab";
import TimKiemTab from "../components/TimKiemTab";
import LoiMoiKetBanTab from "../components/LoiMoiKetBanTab";

const Tab = createMaterialTopTabNavigator();

const MessageAllUserData = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = () => {
      const user = firebase.auth().currentUser;
      if (user) setCurrentUserId(user.uid);
    };
    fetchUser();
  }, []);

  if (!currentUserId) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Tab.Navigator>
      <Tab.Screen name="Bạn bè" component={BanBeTab} />
      <Tab.Screen name="Tìm kiếm" component={TimKiemTab} />
      <Tab.Screen name="Lời mời kết bạn">
        {() => <LoiMoiKetBanTab currentUserId={currentUserId} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default MessageAllUserData;
