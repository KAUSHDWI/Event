import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Menu, Settings, Edit3, MapPin, Mail, Phone } from 'lucide-react-native';
import { useNavigation } from 'expo-router';

export default function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="h-48 bg-[#0f2c8f] pt-12 px-6">
        <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                 <Menu color="white" size={24} />
            </TouchableOpacity>
            <Text className="text-white text-lg font-semibold">Profile</Text>
            <Settings color="white" size={24} />
        </View>
      </View>

      {/* Profile Card Overlay */}
      <View className="px-6 -mt-20">
        <View className="bg-white rounded-2xl p-6 shadow-sm items-center">
            <View className="relative">
                <Image 
                    source={{ uri: 'https://i.pravatar.cc/150?img=12' }} 
                    className="w-24 h-24 rounded-full border-4 border-white shadow-sm"
                />
                <TouchableOpacity className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full border-2 border-white">
                    <Edit3 size={12} color="white" />
                </TouchableOpacity>
            </View>
            
            <Text className="text-xl font-bold text-gray-900 mt-4">John Doe</Text>
            <Text className="text-gray-500">UX Designer</Text>

            <View className="flex-row mt-6 w-full justify-between border-t border-gray-100 pt-6">
                <View className="items-center flex-1">
                    <Text className="text-lg font-bold text-gray-900">12</Text>
                    <Text className="text-xs text-gray-400">Events</Text>
                </View>
                <View className="w-[1px] bg-gray-200 h-full" />
                <View className="items-center flex-1">
                    <Text className="text-lg font-bold text-gray-900">4.8</Text>
                    <Text className="text-xs text-gray-400">Rating</Text>
                </View>
                <View className="w-[1px] bg-gray-200 h-full" />
                <View className="items-center flex-1">
                    <Text className="text-lg font-bold text-gray-900">250</Text>
                    <Text className="text-xs text-gray-400">Following</Text>
                </View>
            </View>
        </View>

        {/* Details Section */}
        <View className="mt-6 space-y-4">
            <View className="bg-white p-4 rounded-xl flex-row items-center">
                <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-4">
                    <Mail size={20} color="#2563eb" />
                </View>
                <View>
                    <Text className="text-xs text-gray-400">Email</Text>
                    <Text className="text-gray-800 font-medium">janedoe@gmail.com</Text>
                </View>
            </View>

            <View className="bg-white p-4 rounded-xl flex-row items-center">
                <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-4">
                    <Phone size={20} color="#2563eb" />
                </View>
                <View>
                    <Text className="text-xs text-gray-400">Phone</Text>
                    <Text className="text-gray-800 font-medium">+1 234 567 890</Text>
                </View>
            </View>

            <View className="bg-white p-4 rounded-xl flex-row items-center">
                <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-4">
                    <MapPin size={20} color="#2563eb" />
                </View>
                <View>
                    <Text className="text-xs text-gray-400">Location</Text>
                    <Text className="text-gray-800 font-medium">New York, USA</Text>
                </View>
            </View>
        </View>
      </View>
    </View>
  );
}