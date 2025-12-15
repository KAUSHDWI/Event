// components/CustomDrawerContent.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Home, Calendar, User, Settings, HelpCircle, Monitor } from 'lucide-react-native';
import { useRouter, usePathname } from 'expo-router';

export default function CustomDrawerContent(props) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Home', icon: Home, route: '/' },
    { name: 'Calendar', icon: Calendar, route: '/calendar' },
    { name: 'Profile', icon: User, route: '/profile' },
  ];

  return (
    <View className="flex-1 bg-[#09228e] pt-14 px-4 pb-10">
      {/* 1. Logo (Matches spacing) */}
      <View className="pl-5 mb-14">
        <Text className="text-white text-3xl font-extrabold tracking-widest">LOGO</Text>
      </View>

      {/* 2. Top Menu Items */}
      <View className="flex-1 space-y-3">
        {menuItems.map((item, index) => {
          // Check if this route is active
          const isActive = (pathname === item.route) || (item.route === '/' && pathname === '/');

          return (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(item.route)}
              className={`flex-row items-center pl-4 py-4 rounded-xl ${
                isActive ? 'bg-white shadow-sm' : 'bg-transparent'
              }`}
            >
              <item.icon 
                size={22} 
                strokeWidth={2.5}
                color={isActive ? '#09228e' : '#8da4e3'} 
              />
              <Text className={`ml-4 text-[15px] font-semibold ${
                isActive ? 'text-[#09228e]' : 'text-[#8da4e3]'
              }`}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 3. Divider Line */}
      <View className="h-[1px] bg-white/20 mx-4 mb-4" />

      {/* 4. Bottom Menu Items */}
      <View>
          <TouchableOpacity className="flex-row items-center pl-4 py-4 rounded-xl mb-1">
            <Monitor size={22} color="#8da4e3" />
            <Text className="ml-4 text-[15px] font-semibold text-[#8da4e3]">Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center pl-4 py-4 rounded-xl">
            <HelpCircle size={22} color="#8da4e3" />
            <Text className="ml-4 text-[15px] font-semibold text-[#8da4e3]">Help</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}