import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, Image, TouchableOpacity, useWindowDimensions, Platform, RefreshControl, Alert } from 'react-native';
import { Search, Bell, MapPin, Calendar, Scan, Ticket, Music, Utensils, Gamepad2, Palette, Flower2, Heart, TrendingUp } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useNavigation, useFocusEffect } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

// --- RICH INDIAN EVENT DATA ---
const ALL_EVENTS = [
  // 1. Trending Concerts
  { 
    id: '1', 
    title: 'Dil-Luminati Tour | Diljit Dosanjh', 
    date: '26 Oct - 27 Oct', 
    venue: 'JLN Stadium, New Delhi', 
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800', 
    category: 'Music',
    price: '₹5,999',
    tag: 'Trending'
  },
  { 
    id: '2', 
    title: 'Arijit Singh - One Night Only', 
    date: '15 Nov', 
    venue: 'Jio Garden, Mumbai', 
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800', 
    category: 'Music',
    price: '₹3,500',
    tag: 'Selling Fast'
  },
  // 2. Tech & Startups
  { 
    id: '3', 
    title: 'TechSparks 2025', 
    date: '22 Feb - 24 Feb', 
    venue: 'Taj Yeshwantpur, Bengaluru', 
    image: 'https://images.unsplash.com/photo-1540575467063-178a50935339?w=800', 
    category: 'Tech',
    price: '₹2,500',
    tag: null
  },
  // 3. Comedy
  { 
    id: '4', 
    title: 'Zakir Khan Live - Tathastu', 
    date: '10 Dec', 
    venue: 'Siri Fort Auditorium, Delhi', 
    image: 'https://images.unsplash.com/photo-1585699324551-f6012dc017a9?w=800', 
    category: 'Art & Craft',
    price: '₹999',
    tag: 'Low Tickets'
  },
  // 4. Festivals
  { 
    id: '5', 
    title: 'Sunburn Goa 2025', 
    date: '28 Dec - 31 Dec', 
    venue: 'Vagator Beach, Goa', 
    image: 'https://images.unsplash.com/photo-1459749411177-287ce328810e?w=800', 
    category: 'Music',
    price: '₹8,500',
    tag: 'Popular'
  },
  // 5. Sports/IPL
  { 
    id: '6', 
    title: 'IPL Final: CSK vs MI', 
    date: '28 May', 
    venue: 'Narendra Modi Stadium, Ahmedabad', 
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800', 
    category: 'Tech', // Using Tech icon as Placeholder for Sports if needed, or create new category
    price: '₹1,500',
    tag: 'High Demand'
  },
  // 6. Culture & Food
  { 
    id: '7', 
    title: 'Jaipur Literature Festival', 
    date: '05 Jan - 10 Jan', 
    venue: 'Diggi Palace, Jaipur', 
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', 
    category: 'Art & Craft',
    price: 'Free',
    tag: null
  },
  { 
    id: '8', 
    title: 'Zomaland Food Carnival', 
    date: '14 Feb - 15 Feb', 
    venue: 'Bandra Kurla Complex, Mumbai', 
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', 
    category: 'Food Festival',
    price: '₹499',
    tag: 'New'
  },
];

const CATEGORIES = [
  { id: 1, name: 'All Events', icon: <Ticket size={18} color="#ec4899" />, key: 'All' },
  { id: 2, name: 'Music', icon: <Music size={18} color="#f59e0b" />, key: 'Music' },
  { id: 3, name: 'Food & Drinks', icon: <Utensils size={18} color="#ef4444" />, key: 'Food Festival' },
  { id: 4, name: 'Tech & Startup', icon: <Gamepad2 size={18} color="#3b82f6" />, key: 'Tech' }, 
  { id: 5, name: 'Comedy & Arts', icon: <Palette size={18} color="#a855f7" />, key: 'Art & Craft' },
  { id: 6, name: 'Nature', icon: <Flower2 size={18} color="#22c55e" />, key: 'Nature' },
];

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { user } = useGlobalContext();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [likedEvents, setLikedEvents] = useState([]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const toggleLike = (id) => {
    if (likedEvents.includes(id)) {
      setLikedEvents(likedEvents.filter(itemId => itemId !== id));
    } else {
      setLikedEvents([...likedEvents, id]);
    }
  };

  // Filter Logic
  const filteredEvents = ALL_EVENTS.filter(event => {
      const matchCat = activeCategory === 'All' || event.category === activeCategory;
      const matchSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.venue.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
  });

  const cardWidth = width >= 1024 ? '31.5%' : width >= 768 ? '48%' : '100%'; 

  return (
    <View className="flex-1 bg-white">
      {/* 1. TOP HEADER */}
      <View className="flex-row items-center justify-between px-6 py-5 bg-white z-20 border-b border-gray-50">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => navigation.openDrawer()} className="mr-4 lg:hidden">
             <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/56/56763.png'}} className="w-6 h-6" style={{ tintColor: '#09228e' }}/>
          </TouchableOpacity>
        
          <View className="bg-[#f0f2f9] rounded-xl px-4 flex-row items-center h-11 w-full max-w-[400px]">
            <Search size={18} color="#09228e" />
            <TextInput 
              placeholder="Search Mumbai, Concerts..." 
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className={`flex-1 ml-3 text-sm font-semibold text-[#09228e] ${Platform.OS === 'web' ? 'outline-none' : ''}`}
            />
          </View>
        </View>

        <View className="flex-row items-center gap-4 ml-4">
           <TouchableOpacity onPress={() => router.push('/profile')}>
              <Image source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }} className="w-9 h-9 rounded-full border-2 border-white shadow-sm" />
           </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        className="flex-1 bg-[#F8F9FB] px-6" 
        contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* 2. SEXY BANNER */}
        <Animated.View entering={FadeInDown.duration(600)}>
            <LinearGradient
                colors={['#09228e', '#2563eb', '#60a5fa']} 
                start={[0, 0]} end={[1, 0]}
                className="rounded-[24px] p-6 mb-8 flex-row items-center shadow-lg shadow-blue-200 relative overflow-hidden h-[180px]"
            >
                <View className="flex-1 pr-2 z-10">
                    <View className="flex-row items-center mb-1">
                        <View className="bg-white/20 px-2 py-0.5 rounded-md mr-2"><Text className="text-white text-[10px] font-bold">PREMIUM</Text></View>
                        <Text className="text-blue-100 text-xs font-semibold tracking-widest uppercase">Hello {user?.username || 'Guest'},</Text>
                    </View>
                    <Text className="text-white text-3xl font-bold tracking-tight mb-2 leading-8">Diljit Dosanjh{"\n"}Live in Delhi</Text>
                    <View className="flex-row items-center opacity-90 mt-1">
                        <MapPin size={12} color="white" />
                        <Text className="text-white text-xs ml-1">JLN Stadium • Oct 27</Text> 
                    </View>
                </View>
                 {/* Banner Image Right */}
                 <Image source={{ uri: ALL_EVENTS[0].image }} className="w-32 h-32 rounded-2xl rotate-3 shadow-2xl border-2 border-white/20" />
            </LinearGradient>
        </Animated.View>

        {/* 3. TABS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8 overflow-visible h-12">
            {CATEGORIES.map((cat, idx) => (
                <TouchableOpacity 
                    key={cat.id} onPress={() => setActiveCategory(cat.key)}
                    className={`flex-row items-center px-4 h-10 rounded-full mr-3 border transition-all ${
                        activeCategory === cat.key 
                        ? 'bg-[#09228e] border-[#09228e] shadow-md' : 'bg-white border-gray-100'
                    }`}
                >
                    <View className="mr-2 opacity-90">{React.cloneElement(cat.icon, { color: activeCategory === cat.key ? 'white' : cat.icon.props.color })}</View>
                    <Text className={`font-bold text-[13px] ${activeCategory === cat.key ? 'text-white' : 'text-gray-600'}`}>{cat.name}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>

        {/* 4. EVENT GRID */}
        {filteredEvents.length === 0 ? (
            <View className="h-40 justify-center items-center"><Text className="text-gray-400">No events found in this category.</Text></View>
        ) : (
            <View className="flex-row flex-wrap justify-between gap-y-6">
                {filteredEvents.map((event, index) => (
                    <Animated.View 
                        key={index} 
                        entering={FadeInDown.delay(index * 100).springify()}
                        style={{ width: cardWidth }}
                    >
                        <TouchableOpacity 
                            activeOpacity={0.95}
                            onPress={() => router.push({ pathname: `/event/${event.id}`, params: event })}
                            className="bg-white rounded-[24px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-white overflow-hidden"
                        >
                            <View className="relative">
                                <Image source={{ uri: event.image }} className="w-full h-44 bg-gray-200" resizeMode="cover" />
                                
                                {/* Status Tag */}
                                {event.tag && (
                                    <View className="absolute top-3 left-3 bg-[#09228e]/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                                        <Text className="text-white text-[9px] font-bold uppercase">{event.tag}</Text>
                                    </View>
                                )}
                                
                                {/* Heart/Like Button */}
                                <TouchableOpacity 
                                    onPress={() => toggleLike(event.id)}
                                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm"
                                >
                                    <Heart size={16} color={likedEvents.includes(event.id) ? '#ef4444' : '#09228e'} fill={likedEvents.includes(event.id) ? '#ef4444' : 'white'} />
                                </TouchableOpacity>
                            </View>
                            
                            <View className="p-4">
                                <Text className="text-[15px] font-black text-[#09228e] leading-[22px] mb-2" numberOfLines={1}>{event.title}</Text>
                                <View className="flex-row items-center mb-1">
                                    <Calendar size={12} color="#4b5563" />
                                    <Text className="ml-2 text-xs font-semibold text-gray-500">{event.date}</Text>
                                </View>
                                <View className="flex-row items-center mb-3">
                                    <MapPin size={12} color="#4b5563" />
                                    <Text className="ml-2 text-xs font-semibold text-gray-500 truncate">{event.venue}</Text>
                                </View>
                                <View className="h-[1px] bg-gray-100 mb-3" />
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-[#09228e] font-extrabold text-sm">{event.price}</Text>
                                    <Text className="text-[#3b82f6] text-xs font-bold">Book Now</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
                <View style={{ width: cardWidth }} /><View style={{ width: cardWidth }} />
            </View>
        )}
      </ScrollView>
    </View>
  );
}