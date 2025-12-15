import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { Menu, Search, Bell } from 'lucide-react-native';
import { useNavigation } from 'expo-router';

export default function CalendarScreen() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState('2025-06-15');

  // Dummy data for events on specific dates
  const events = {
    '2025-06-15': [
      { id: 1, title: 'Sid Sriram Concert', time: '19:00', image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1000' },
      { id: 2, title: 'Art Exhibition', time: '14:00', image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1000' }
    ]
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-12 pb-4 bg-white">
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Menu color="#333" size={24} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Schedule</Text>
        <Bell size={24} color="#333" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Calendar Component */}
        <View className="mt-4">
          <CalendarList
            horizontal={true}
            pagingEnabled={true}
            calendarWidth={360} // Adjust slightly based on device
            pastScrollRange={0}
            futureScrollRange={12}
            scrollEnabled={true}
            showScrollIndicator={false}
            
            // Customizing the logic to highlight selected date
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#2563eb' },
            }}
            
            // The Day Component
            dayComponent={({date, state}) => {
              const isSelected = date.dateString === selectedDate;
              return (
                <TouchableOpacity 
                  onPress={() => setSelectedDate(date.dateString)}
                  className={`w-10 h-14 justify-center items-center rounded-xl my-1 ${isSelected ? 'bg-blue-600 shadow-md shadow-blue-300' : 'bg-transparent'}`}
                >
                  <Text className={`text-xs mb-1 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                    {new Date(date.dateString).toLocaleDateString('en-US', { weekday: 'short' })}
                  </Text>
                  <Text className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                    {date.day}
                  </Text>
                  
                  {/* Dot indicator if event exists */}
                  {events[date.dateString] && !isSelected && (
                    <View className="w-1 h-1 bg-blue-500 rounded-full mt-1" />
                  )}
                </TouchableOpacity>
              );
            }}
            
            theme={{
              calendarBackground: 'transparent',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: '#2563eb',
              todayTextColor: '#2563eb',
              dayTextColor: '#2d4150',
            }}
            style={{ height: 120 }} 
          />
        </View>

        {/* Selected Date Header */}
        <View className="px-6 mt-4">
            <Text className="text-2xl font-bold text-gray-900">
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Text>
            <Text className="text-gray-500 mb-6">
                {events[selectedDate]?.length || 0} Events
            </Text>
        </View>

        {/* Events List for Selected Date */}
        <View className="px-6 pb-20">
            {events[selectedDate] ? (
                events[selectedDate].map((event, index) => (
                    <View key={index} className="flex-row mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <Image source={{ uri: event.image }} className="w-24 h-full" resizeMode="cover" />
                        <View className="p-4 flex-1">
                            <Text className="text-blue-600 text-xs font-bold mb-1">{event.time}</Text>
                            <Text className="text-base font-bold text-gray-800 mb-1">{event.title}</Text>
                            <View className="flex-row items-center">
                                <Image source={{ uri: 'https://i.pravatar.cc/50' }} className="w-5 h-5 rounded-full border border-white" />
                                <Image source={{ uri: 'https://i.pravatar.cc/51' }} className="w-5 h-5 rounded-full border border-white -ml-2" />
                                <Text className="text-xs text-gray-400 ml-2">+20 going</Text>
                            </View>
                        </View>
                    </View>
                ))
            ) : (
                <View className="items-center justify-center mt-10">
                    <Text className="text-gray-400">No events for this day.</Text>
                </View>
            )}
        </View>
      </ScrollView>
    </View>
  );
}