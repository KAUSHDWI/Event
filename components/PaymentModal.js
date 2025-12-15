import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, Image, TextInput, ScrollView } from 'react-native';
import { X, CreditCard, Smartphone, Banknote, CheckCircle, ShieldCheck } from 'lucide-react-native';
import Animated, { SlideInDown, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function PaymentModal({ visible, onClose, onConfirm, price, eventName }) {
    const [step, setStep] = useState('method'); // 'method', 'processing', 'success'
    const [method, setMethod] = useState(null); // 'card', 'upi', 'paytm'

    useEffect(() => {
        if (!visible) {
            setStep('method');
            setMethod(null);
        }
    }, [visible]);

    const handlePay = () => {
        if (!method) return;
        setStep('processing');
        // Simulate Banking Delays (2 seconds)
        setTimeout(() => {
            onConfirm(); // Actually book the ticket in database
            setStep('success');
        }, 2000);
    };

    const PAYMENT_METHODS = [
        { id: 'upi', name: 'UPI (GPay / PhonePe)', icon: Smartphone, color: '#16a34a' },
        { id: 'paytm', name: 'Paytm Wallet', icon: Banknote, color: '#00baf2' },
        { id: 'card', name: 'Credit / Debit Card', icon: CreditCard, color: '#09228e' },
    ];

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View className="flex-1 bg-black/60 justify-end">
                <Animated.View entering={SlideInDown.springify().damping(15)} className="bg-[#f8f9ff] h-[75%] rounded-t-[30px] overflow-hidden">
                    
                    {/* HEADER */}
                    <View className="flex-row justify-between items-center p-6 border-b border-gray-200 bg-white">
                        <View>
                            <Text className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total to pay</Text>
                            <Text className="text-3xl font-black text-gray-900">{price}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} className="bg-gray-100 p-2 rounded-full">
                            <X size={24} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 p-6">
                        
                        {/* STEP 1: SELECT METHOD */}
                        {step === 'method' && (
                            <Animated.View entering={FadeIn}>
                                <Text className="text-gray-900 font-bold text-lg mb-4">Select Payment Method</Text>
                                
                                {PAYMENT_METHODS.map((pm) => (
                                    <TouchableOpacity 
                                        key={pm.id} 
                                        onPress={() => setMethod(pm.id)}
                                        className={`flex-row items-center p-4 mb-3 rounded-2xl border-2 transition-all ${
                                            method === pm.id 
                                            ? 'border-[#09228e] bg-blue-50' 
                                            : 'border-white bg-white shadow-sm'
                                        }`}
                                    >
                                        <View className="w-12 h-12 rounded-full justify-center items-center" style={{ backgroundColor: pm.color + '20' }}>
                                            <pm.icon size={24} color={pm.color} />
                                        </View>
                                        <Text className="ml-4 font-bold text-gray-700 text-base flex-1">{pm.name}</Text>
                                        {method === pm.id && <View className="w-5 h-5 bg-[#09228e] rounded-full" />}
                                    </TouchableOpacity>
                                ))}

                                {/* Fake Inputs based on selection */}
                                {method === 'card' && (
                                    <Animated.View entering={FadeIn} className="bg-white p-4 rounded-xl border border-gray-200 mt-2">
                                        <TextInput placeholder="0000 0000 0000 0000" className="border-b border-gray-200 py-3 mb-2 font-bold text-gray-700" keyboardType="numeric" />
                                        <View className="flex-row gap-4">
                                            <TextInput placeholder="MM/YY" className="border-b border-gray-200 py-3 flex-1 text-gray-700" />
                                            <TextInput placeholder="CVV" className="border-b border-gray-200 py-3 flex-1 text-gray-700" secureTextEntry />
                                        </View>
                                    </Animated.View>
                                )}

                                {method === 'upi' && (
                                     <Animated.View entering={FadeIn} className="bg-white p-4 rounded-xl border border-gray-200 mt-2 flex-row items-center">
                                         <TextInput placeholder="example@okaxis" className="flex-1 font-bold text-gray-700" />
                                         <Text className="text-green-600 font-bold ml-2">VERIFY</Text>
                                     </Animated.View>
                                )}
                                
                                <View className="flex-row items-center justify-center mt-6 mb-2">
                                    <ShieldCheck size={14} color="gray" />
                                    <Text className="text-gray-400 text-xs ml-1">Payments are 100% Secure & Encrypted</Text>
                                </View>
                            </Animated.View>
                        )}

                        {/* STEP 2: PROCESSING ANIMATION */}
                        {step === 'processing' && (
                            <View className="items-center justify-center py-20">
                                <ActivityIndicator size="large" color="#09228e" />
                                <Text className="mt-6 text-gray-800 font-bold text-lg">Contacting Bank Server...</Text>
                                <Text className="text-gray-400 text-sm mt-1">Please do not press back</Text>
                            </View>
                        )}
                         
                         {/* STEP 3: SUCCESS (Controlled by Parent mostly, but handled here too) */}
                         {step === 'success' && (
                            <View className="items-center justify-center py-10">
                                <View className="bg-green-100 p-6 rounded-full mb-4">
                                    <CheckCircle size={50} color="#16a34a" />
                                </View>
                                <Text className="text-2xl font-black text-gray-900">Payment Successful!</Text>
                                <Text className="text-gray-500 mt-2 text-center">Ticket for {eventName} has been booked.</Text>
                            </View>
                         )}

                    </ScrollView>

                    {/* PAY BUTTON */}
                    {step === 'method' && (
                        <View className="p-6 bg-white border-t border-gray-100">
                            <TouchableOpacity 
                                onPress={handlePay}
                                disabled={!method}
                                className={`h-16 rounded-2xl justify-center items-center shadow-lg ${
                                    method ? 'bg-[#09228e] shadow-blue-300' : 'bg-gray-300'
                                }`}
                            >
                                <Text className="text-white font-bold text-lg">Pay {price}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>
            </View>
        </Modal>
    );
}