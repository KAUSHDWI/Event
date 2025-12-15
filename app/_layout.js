import React from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "../global.css"; 
import GlobalProvider from '../context/GlobalProvider'; 

export default function RootLayout() {
  return (
    <GlobalProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          
          <Stack.Screen name="index" />
          
          <Stack.Screen name="(auth)" />

          <Stack.Screen name="(drawer)" />
          
          {/* DELETED THE LINE BELOW BECAUSE THE FILE IS MOVED INSIDE DRAWER */}
          {/* <Stack.Screen name="event/[id]" options={{...}} /> */} 
        
        </Stack>
      </GestureHandlerRootView>
    </GlobalProvider>
  );
}