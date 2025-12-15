import React from 'react';
import { useWindowDimensions } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from '../../components/CustomDrawerContent';

export default function DrawerLayout() {
  const { width } = useWindowDimensions();
  // If width is greater than 768px (Tablet/PC), keep drawer open
  const isLargeScreen = width >= 768;

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        // This is the Key Fix: 'permanent' makes it a fixed sidebar
        drawerType: isLargeScreen ? 'permanent' : 'front',
        drawerStyle: {
          backgroundColor: '#09228e',
          width: 280, // Slightly wider to match design
          borderRightWidth: 0,
        },
        // Remove overlay color on desktop so it looks like a dashboard
        drawerOverlayStyle: isLargeScreen ? { backgroundColor: 'transparent' } : undefined,
        sceneContainerStyle: { backgroundColor: '#F8F9FB' },
      }}
    />
  );
}