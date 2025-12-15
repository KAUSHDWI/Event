import React from 'react';
import { View, Text, Modal, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ticket, Share2, Download, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { ZoomIn } from 'react-native-reanimated';
import QRCode from 'react-native-qrcode-svg'; // You might need: npx expo install react-native-qrcode-svg

export default function TicketModal({ visible, onClose, event }) {
    const { width } = useWindowDimensions();

    if (!visible || !event) return null;

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 bg-black/80 justify-center items-center p-6">
                <Animated.View 
                    entering={ZoomIn.duration(400)}
                    className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl relative"
                >
                    {/* Header Image */}
                    <Image source={{ uri: event.image }} className="w-full h-40" resizeMode="cover" />
                    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} className="absolute top-0 w-full h-40 justify-between p-4">
                         <TouchableOpacity onPress={onClose} className="self-end bg-black/40 p-1 rounded-full"><X size={20} color="white"/></TouchableOpacity>
                    </LinearGradient>

                    {/* Content */}
                    <View className="p-6 items-center">
                        <Text className="text-[#09228e] text-2xl font-black text-center mb-1">{event.title}</Text>
                        <Text className="text-gray-500 font-medium text-xs uppercase mb-6">{event.venue} • {event.date}</Text>

                        {/* Cut Line */}
                        <View className="w-full h-[1px] border border-dashed border-gray-300 relative mb-6">
                            <View className="absolute -left-8 -top-3 w-6 h-6 bg-black rounded-full" />
                            <View className="absolute -right-8 -top-3 w-6 h-6 bg-black rounded-full" />
                        </View>

                        {/* QR Code Section */}
                        <View className="mb-2">
                             {/* Mock QR - Replace with actual data if needed */}
                             <QRCode value={`Eventify-Ticket-${event.id}`} size={120} />
                        </View>
                        <Text className="text-xs text-gray-400 mt-2 text-center">Scan at entrance • Gate 4</Text>
                        <Text className="text-xl font-bold text-[#09228e] mt-4">Admit One</Text>
                    </View>

                    {/* Footer Actions */}
                    <View className="bg-[#f8f9ff] p-4 flex-row justify-center gap-4 border-t border-gray-100">
                        <TouchableOpacity className="flex-row items-center bg-[#09228e] px-6 py-3 rounded-xl shadow-lg shadow-blue-200">
                            <Download size={18} color="white" />
                            <Text className="text-white font-bold ml-2">Download</Text>
                        </TouchableOpacity>
                         <TouchableOpacity className="flex-row items-center bg-white border border-gray-200 px-4 py-3 rounded-xl">
                            <Share2 size={18} color="#09228e" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}