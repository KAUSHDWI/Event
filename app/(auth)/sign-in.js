import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, useWindowDimensions, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Ticket, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react-native';
import { signIn } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSequence, withTiming, withSpring } from 'react-native-reanimated';

// --- CUSTOM ALERT COMPONENT ---
const FlashMessage = ({ message, type }) => {
    if (!message) return null;
    const isError = type === 'error';
    return (
        <Animated.View entering={FadeInUp.springify()} exiting={FadeInUp.springify()} 
            style={{ 
                position: 'absolute', top: 50, alignSelf: 'center', zIndex: 100, 
                backgroundColor: isError ? '#fee2e2' : '#dcfce7', 
                paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12,
                borderWidth: 1, borderColor: isError ? '#ef4444' : '#22c55e',
                flexDirection: 'row', alignItems: 'center', shadowOpacity: 0.1, shadowRadius: 10
            }}
        >
            {isError ? <AlertCircle size={20} color="#ef4444" /> : <CheckCircle2 size={20} color="#15803d" />}
            <Text style={{ marginLeft: 10, color: isError ? '#991b1b' : '#14532d', fontWeight: 'bold' }}>{message}</Text>
        </Animated.View>
    );
};

export default function SignIn() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768; 
  const { setIsLogged } = useGlobalContext();
  
  const [form, setForm] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [alert, setAlert] = useState({ message: null, type: '' });
  
  // Animation Values
  const shakeTranslateX = useSharedValue(0);

  const showAlert = (msg, type) => {
    setAlert({ message: msg, type });
    setTimeout(() => setAlert({ message: null, type: '' }), 3000);
  };

  const shakeInput = () => {
    shakeTranslateX.value = withSequence(withTiming(-10, { duration: 50 }), withTiming(10, { duration: 50 }), withTiming(-10, { duration: 50 }), withTiming(0, { duration: 50 }));
  };

  const animatedShakeStyle = useAnimatedStyle(() => {
    return { transform: [{ translateX: shakeTranslateX.value }] };
  });

  const submit = async () => {
    if (!form.email || !form.password) {
        shakeInput();
        showAlert('Please fill in all fields', 'error');
        return;
    }
    setIsSubmitting(true);
    try {
      await signIn(form.email, form.password);
      setIsLogged(true);
      showAlert('Success! Welcome back.', 'success');
      setTimeout(() => router.replace('/(drawer)'), 1000);
    } catch (error) {
      shakeInput();
      showAlert(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, flexDirection: isDesktop ? 'row' : 'column', height: '100%', backgroundColor: 'white' }}>
        
        {/* GLOBAL ALERT OVERLAY */}
        {alert.message && <FlashMessage message={alert.message} type={alert.type} />}

        {/* LEFT SIDE */}
        <View style={{ width: isDesktop ? '55%' : '100%', height: isDesktop ? '100%' : '35%', position: 'relative', overflow: 'hidden', backgroundColor: '#09228e' }}>
            <Image source={{uri: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&q=80'}} style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.8 }} resizeMode="cover" />
            <LinearGradient colors={['rgba(9, 34, 142, 0.8)', 'rgba(37, 99, 235, 0.6)']} style={{ width: '100%', height: '100%', position: 'absolute' }} />
            <View className="absolute inset-0 justify-center items-center z-10 p-10">
                 <View className="bg-white/20 p-4 rounded-3xl backdrop-blur-xl mb-6 border border-white/30 shadow-2xl">
                     <Ticket size={40} color="white" fill="white" style={{ transform: [{rotate: '-10deg'}] }} />
                 </View>
                 <Text className="text-white text-lg font-bold tracking-[8px] uppercase opacity-90 mb-2 text-center">EventPlanner</Text>
                 <Text className="text-white font-black text-5xl md:text-6xl text-center leading-tight drop-shadow-md">Welcome{'\n'}Back.</Text>
            </View>
        </View>

        {/* RIGHT SIDE */}
        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
             <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ width: '100%', height: '100%' }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
                    
                    <Animated.View entering={FadeInDown.duration(600).springify()} style={[{ width: '100%', maxWidth: 400 }, animatedShakeStyle]}>
                        <Text className="text-[#09228e] text-3xl font-extrabold mb-2 text-left">Login</Text>
                        <Text className="text-gray-400 mb-8 text-left text-base">Enter your details to manage your events.</Text>

                        {/* EMAIL */}
                        <View className="mb-5">
                            <Text className={`text-[11px] font-bold uppercase mb-2 ml-1 ${focusedInput === 'email' ? 'text-[#09228e]' : 'text-gray-400'}`}>Email Address</Text>
                            <View className={`w-full h-14 bg-white border rounded-2xl flex-row items-center px-4 transition-all ${focusedInput === 'email' ? 'border-[#09228e] bg-blue-50/20' : 'border-gray-200'}`}>
                                <Mail size={20} color={focusedInput === 'email' ? '#09228e' : '#9ca3af'} />
                                <TextInput className="flex-1 ml-3 text-base text-gray-800 outline-none" placeholder="name@email.com" placeholderTextColor="#cbd5e1" value={form.email} onChangeText={(t) => setForm({...form, email: t})} onFocus={() => setFocusedInput('email')} onBlur={() => setFocusedInput(null)} />
                            </View>
                        </View>

                        {/* PASSWORD */}
                        <View className="mb-8">
                            <Text className={`text-[11px] font-bold uppercase mb-2 ml-1 ${focusedInput === 'password' ? 'text-[#09228e]' : 'text-gray-400'}`}>Password</Text>
                            <View className={`w-full h-14 bg-white border rounded-2xl flex-row items-center px-4 transition-all ${focusedInput === 'password' ? 'border-[#09228e] bg-blue-50/20' : 'border-gray-200'}`}>
                                <Lock size={20} color={focusedInput === 'password' ? '#09228e' : '#9ca3af'} />
                                <TextInput className="flex-1 ml-3 text-base text-gray-800 outline-none" placeholder="••••••••" placeholderTextColor="#cbd5e1" value={form.password} onChangeText={(t) => setForm({...form, password: t})} onFocus={() => setFocusedInput('password')} onBlur={() => setFocusedInput(null)} secureTextEntry={!showPass} />
                                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                                    {showPass ? <Eye size={20} color="#09228e"/> : <EyeOff size={20} color="#9ca3af"/>}
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity className="mt-2 self-end"><Text className="text-[#3b82f6] font-semibold text-xs">Forgot Password?</Text></TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={submit} activeOpacity={0.8} className="mb-5 shadow-xl shadow-blue-200">
                             <LinearGradient colors={['#09228e', '#3b82f6']} start={[0, 0]} end={[1, 0]} style={{ height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}>
                                {isSubmitting ? <ActivityIndicator color="#fff"/> : <Text className="text-white font-bold text-lg">Sign In</Text>}
                             </LinearGradient>
                        </TouchableOpacity>

                        <View className="flex-row justify-center mt-4">
                             <Text className="text-gray-400 font-medium">New here? </Text>
                             <TouchableOpacity onPress={() => router.push('/sign-up')}><Text className="text-[#09228e] font-bold">Create Account</Text></TouchableOpacity>
                        </View>
                    </Animated.View>
                </ScrollView>
             </KeyboardAvoidingView>
        </View>
    </View>
  );
}