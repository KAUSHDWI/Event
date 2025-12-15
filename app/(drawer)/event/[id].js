import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, useWindowDimensions, Modal } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MapPin, Calendar, ArrowLeft, Share2, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useGlobalContext } from '../../../context/GlobalProvider';
import { bookEvent } from '../../../lib/appwrite';

import PaymentModal from '../../../components/PaymentModal'; 
import TicketModal from '../../../components/TicketModal';

export default function EventDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const { user, isLogged } = useGlobalContext();
  const isDesktop = width >= 1024;

  const [paymentVisible, setPaymentVisible] = useState(false);
  const [ticketVisible, setTicketVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // --- IMAGES ---
  // High-Quality Concert Images for Gallery
  const GALLERY_IMAGES = [
    'https://images.unsplash.com/photo-1571266028243-37169503182f?w=300&q=80',
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=300&q=80',
    'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?w=300&q=80',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=300&q=80',
    'https://images.unsplash.com/photo-1459749411177-287ce328810e?w=300&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80',
  ];

  // Clean Light Map to match "Venue" screenshot
  const MAP_IMAGE = 'https://img.freepik.com/free-vector/grayscale-city-map-with-navigation-pointers_23-2147781711.jpg?w=1060&t=st=1708688800~exp=1708689400~hmac=clean_map';

  const handleBookingStart = () => {
    // Auth Check
    // if (!isLogged) return router.push('/(auth)/sign-in');
    setPaymentVisible(true);
  };

  const onPaymentSuccess = async () => {
    try { if (user) await bookEvent(user.accountId, params.id, params.title); } catch (e) {}
    setPaymentVisible(false);
    setTimeout(() => setTicketVisible(true), 500);
  };

  return (
    <View className="flex-1 bg-[#F8F9FB]">
        <Stack.Screen options={{ headerShown: false }} />

        {/* MOBILE HEADER */}
        {!isDesktop && (
            <View className="absolute top-0 left-0 right-0 z-50 p-6 pt-12 flex-row justify-between items-center pointer-events-box-none">
                 <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white/40 backdrop-blur-md rounded-full justify-center items-center shadow-sm">
                    <ArrowLeft color="white" size={24} />
                 </TouchableOpacity>
            </View>
        )}

        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
            {/* WRAPPER */}
            <View className="w-full max-w-[1400px] mx-auto p-4 lg:p-8">
                
                {/* === 1. HERO BANNER === */}
                <Animated.View entering={FadeInDown.duration(600)} className="w-full h-[400px] lg:h-[450px] rounded-[32px] overflow-hidden relative shadow-lg bg-black">
                    <Image 
                        source={{ uri: params.image || GALLERY_IMAGES[0] }} 
                        className="w-full h-full opacity-90" 
                        resizeMode="cover" 
                    />
                    
                    {/* Inner Shadow for readability */}
                    <LinearGradient 
                        colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']} 
                        className="absolute inset-0"
                    />

                    {/* TOP ICONS */}
                    <View className="absolute top-8 right-8 hidden lg:flex flex-row gap-4">
                        <TouchableOpacity className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full items-center justify-center border border-white/20"><Share2 size={18} color="white" /></TouchableOpacity>
                        <TouchableOpacity onPress={() => setIsLiked(!isLiked)} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full items-center justify-center border border-white/20"><Heart size={18} color={isLiked ? "#ef4444" : "white"} fill={isLiked ? "#ef4444" : "transparent"} /></TouchableOpacity>
                    </View>

                    {/* BOTTOM INFO & BUTTON */}
                    <View className="absolute bottom-0 w-full p-6 lg:p-12 flex-col lg:flex-row justify-between items-end gap-6">
                        <View className="flex-1 max-w-4xl">
                            <Text className="text-white text-3xl lg:text-5xl font-extrabold mb-4 leading-tight tracking-tight shadow-md text-shadow">
                                {params.title || "The Homecoming Tour | Sid Sriram"}
                            </Text>
                            <View className="flex-row gap-4 items-center">
                                <View className="flex-row items-center">
                                    <View className="bg-white/20 p-1.5 rounded-md backdrop-blur-sm mr-2"><Calendar size={14} color="white" /></View>
                                    <Text className="text-white text-sm font-semibold">{params.date || "22 Jan - 24 Jan"}</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <View className="bg-white/20 p-1.5 rounded-md backdrop-blur-sm mr-2"><MapPin size={14} color="white" /></View>
                                    <Text className="text-white text-sm font-semibold">{params.venue || "Cultural Hall, Brookefield"}</Text>
                                </View>
                            </View>
                        </View>

                        {/* BLUE BUTTON INSIDE IMAGE */}
                        <TouchableOpacity 
                            onPress={handleBookingStart}
                            activeOpacity={0.9}
                            className="bg-[#1a56db] h-14 px-12 rounded-xl justify-center items-center shadow-xl shadow-blue-900/60 mt-4 lg:mt-0 w-full lg:w-auto hover:bg-[#1545ad] transition-all"
                        >
                            <Text className="text-white font-bold text-lg">Book Your Spot</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* === 2. SPLIT CONTENT === */}
                <View className="flex-col lg:flex-row mt-10 gap-12 px-2 lg:px-0">
                    
                    {/* LEFT COLUMN: 65% Width */}
                    <View className="flex-[2.1]">
                        
                        {/* About */}
                        <View className="mb-10">
                            <Text className="text-[#111827] text-lg font-bold mb-3">About the Event</Text>
                            <Text className="text-gray-500 leading-7 text-[15px]">
                                Some voices don’t just sing, they awaken something deep within. Sid Sriram is one of those rare artists who doesn’t just perform music... he becomes it.
                                {"\n\n"}
                                This concert isn’t just about a setlist or a stage, it’s a journey. A moment suspended in time. A powerful collective experience where every note pulls at memory, every silence says what words never could.
                            </Text>
                            <TouchableOpacity><Text className="text-[#1a56db] font-bold mt-2 text-sm">Read More</Text></TouchableOpacity>
                        </View>

                        {/* Gallery Grid - Matching 6 items look */}
                        <View className="mb-8">
                            <Text className="text-[#111827] text-lg font-bold mb-4">Gallery</Text>
                            <View className="flex-row flex-wrap gap-4">
                                {GALLERY_IMAGES.map((img, i) => (
                                    <View key={i} className="relative rounded-2xl overflow-hidden h-24 w-24 lg:w-[130px] lg:h-[130px] shadow-sm">
                                        <Image source={{ uri: img }} className="w-full h-full bg-gray-300" resizeMode="cover" />
                                        {i === 5 && (
                                            <View className="absolute inset-0 bg-black/60 justify-center items-center">
                                                <Text className="text-white font-bold text-xl">14+</Text>
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* RIGHT COLUMN: 35% Width (Widgets) */}
                    <View className="flex-1 w-full gap-8">
                        
                        {/* Venue / Map Card */}
                        <View>
                            <Text className="text-[#111827] font-bold text-base mb-3">Venue</Text>
                            <View className="bg-[#f0f2f5] h-[220px] rounded-[24px] overflow-hidden relative shadow-sm border border-white">
                                <Image source={{ uri: MAP_IMAGE }} className="w-full h-full opacity-60" resizeMode="cover" />
                                
                                {/* Cultural Hall Pin Overlay */}
                                <View className="absolute top-[40%] left-[55%] -translate-x-1/2 bg-black px-4 py-2 rounded-lg items-center shadow-2xl z-10">
                                    <Text className="text-white text-[11px] font-bold">Cultural Hall</Text>
                                    <View className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full border border-white mt-1" />
                                    <View className="absolute -bottom-1.5 w-3 h-3 bg-black rotate-45" />
                                </View>
                            </View>
                        </View>

                        {/* Tickets Avatar Row */}
                        <View>
                            <Text className="text-[#111827] font-bold text-base mb-3">Tickets Booked</Text>
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row">
                                    {[1,2,3,4,5].map((i) => (
                                        <Image 
                                            key={i} 
                                            source={{ uri: `https://i.pravatar.cc/150?img=${i + 30}` }} 
                                            className="w-10 h-10 rounded-full border-[2px] border-white -ml-3 first:ml-0"
                                        />
                                    ))}
                                    <View className="w-10 h-10 rounded-full bg-[#3b82f6] border-[2px] border-white justify-center items-center -ml-3">
                                        <Text className="text-white text-[10px] font-bold">2K+</Text>
                                    </View>
                                </View>
                                <TouchableOpacity>
                                    <Text className="text-[#1a56db] font-bold text-sm">Invite</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                </View>

                {/* === 3. SIMILAR EVENTS SLIDER === */}
                <View className="mt-10 px-2 lg:px-0">
                    <Text className="text-[#111827] text-xl font-bold mb-5">Similar events</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 20 }}>
                        {[1, 2, 3].map((i) => (
                            <View key={i} className="w-[300px] h-[180px] rounded-[24px] overflow-hidden relative shadow-md bg-gray-900 group cursor-pointer hover:-translate-y-1 transition-transform">
                                <Image 
                                    source={{ uri: `https://images.unsplash.com/photo-${1500000000000 + i*900000}?w=600` }}
                                    className="w-full h-full opacity-90 group-hover:scale-105 transition-transform duration-500"
                                    resizeMode="cover" 
                                />
                                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} className="absolute inset-0 justify-end p-5">
                                    <Text className="text-white font-bold text-lg">Music Fest '25</Text>
                                    <View className="flex-row justify-between items-center mt-1">
                                        <Text className="text-gray-300 text-xs">Vagator • 12 Oct</Text>
                                        <Text className="text-[#3b82f6] text-xs font-bold bg-white/10 px-2 py-1 rounded">Book</Text>
                                    </View>
                                </LinearGradient>
                            </View>
                        ))}
                    </ScrollView>
                </View>

            </View>
        </ScrollView>

        <PaymentModal visible={paymentVisible} onClose={() => setPaymentVisible(false)} onConfirm={onPaymentSuccess} price={params.price || '₹2,500'} eventName={params.title} />
        <TicketModal visible={ticketVisible} onClose={() => { setTicketVisible(false); router.replace('/(drawer)'); }} event={params} />
    </View>
  );
}