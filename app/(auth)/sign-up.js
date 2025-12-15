import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, useWindowDimensions, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, User, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react-native';
import { createUser } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming, withSpring } from 'react-native-reanimated';

// Custom Flash Alert
const FlashMessage = ({ message, type }) => {
    if (!message) return null;
    const isError = type === 'error';
    return (
        <Animated.View entering={FadeInDown.springify()} style={{ 
            position: 'absolute', top: 50, alignSelf: 'center', zIndex: 100, 
            backgroundColor: isError ? '#fee2e2' : '#dcfce7', paddingVertical: 12, paddingHorizontal: 20, 
            borderRadius: 12, borderWidth: 1, borderColor: isError ? '#ef4444' : '#22c55e', 
            flexDirection: 'row', alignItems: 'center'
        }}>
            {isError ? <AlertCircle size={20} color="#ef4444" /> : <CheckCircle2 size={20} color="#15803d" />}
            <Text style={{ marginLeft: 10, color: isError ? '#991b1b' : '#14532d', fontWeight: 'bold' }}>{message}</Text>
        </Animated.View>
    );
};

export default function SignUp() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768; 
  const { setIsLogged } = useGlobalContext();
  
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [alert, setAlert] = useState({ message: null, type: '' });

  // --- PASSWORD VALIDATION LOGIC ---
  const [reqs, setReqs] = useState({ length: false, upper: false, lower: false, num: false, special: false });

  useEffect(() => {
    const pwd = form.password;
    setReqs({
        length: pwd.length >= 8,
        upper: /[A-Z]/.test(pwd),
        lower: /[a-z]/.test(pwd),
        num: /\d/.test(pwd),
        special: /[!@#$%^&*]/.test(pwd),
    });
  }, [form.password]);

  // Determine password strength level (0-4)
  const strengthLevel = Object.values(reqs).filter(Boolean).length;
  // Colors for strength bars: Red -> Orange -> Blue -> Green
  const getBarColor = (index) => {
      if (index < strengthLevel) {
          if (strengthLevel <= 1) return '#ef4444'; // Red
          if (strengthLevel <= 3) return '#f97316'; // Orange
          return '#22c55e'; // Green
      }
      return '#e5e7eb'; // Gray (empty)
  };

  const showAlert = (msg, type) => {
    setAlert({ message: msg, type });
    setTimeout(() => setAlert({ message: null, type: '' }), 4000);
  };

  const submit = async () => {
    if (!form.username || !form.email || !form.password) return showAlert('Please fill all fields', 'error');
    if (strengthLevel < 5) return showAlert('Password does not meet requirements', 'error');
    
    setIsSubmitting(true);
    try {
      await createUser(form.email, form.password, form.username);
      setIsLogged(true);
      showAlert('Account Created!', 'success');
      setTimeout(() => router.replace('/(drawer)'), 1000);
    } catch (error) {
      showAlert(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, flexDirection: isDesktop ? 'row' : 'column', height: '100%', backgroundColor: 'white' }}>
        
        {alert.message && <FlashMessage message={alert.message} type={alert.type} />}

        {/* === LEFT SIDE (Blue) === */}
        <View style={{ width: isDesktop ? '55%' : '100%', height: isDesktop ? '100%' : '20%', position: 'relative', backgroundColor: '#051b75' }}>
             <Image source={{uri: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1600&q=80'}} style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.6 }} resizeMode="cover"/>
            <LinearGradient colors={['rgba(59, 130, 246, 0.4)', 'rgba(9, 34, 142, 0.9)']} style={{ width: '100%', height: '100%', position: 'absolute' }} />
            <View className="absolute inset-0 justify-center items-center p-6">
                 {isDesktop && <View className="bg-white/10 p-4 rounded-full mb-4 border border-white/20"><CheckCircle2 size={32} color="white" /></View>}
                 <Text className="text-white font-black text-4xl md:text-5xl text-center drop-shadow-lg">{isDesktop ? "Start Your\nJourney" : "Sign Up"}</Text>
            </View>
        </View>

        {/* === RIGHT SIDE (White Form) === */}
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyCenter: 'center', alignItems: 'center', padding: 32 }}>
                    <Animated.View entering={FadeInDown.duration(600).springify()} style={{ width: '100%', maxWidth: 400 }}>
                        
                        {isDesktop && <><Text className="text-[#3b82f6] font-extrabold uppercase text-xs mb-1">Create Profile</Text><Text className="text-[#09228e] text-3xl font-black mb-8">Sign Up</Text></>}

                        {/* NAME */}
                        <View className="mb-4">
                            <Text className={`text-[11px] font-bold uppercase mb-2 ml-1 ${focusedInput === 'name' ? 'text-[#09228e]' : 'text-gray-400'}`}>Full Name</Text>
                            <View className={`w-full h-12 bg-white border rounded-xl flex-row items-center px-4 transition-all ${focusedInput === 'name' ? 'border-[#09228e] bg-blue-50/20' : 'border-gray-200'}`}>
                                <User size={18} color={focusedInput === 'name' ? '#09228e' : '#9ca3af'} />
                                <TextInput className="flex-1 ml-3 text-[15px]" placeholder="Your Name" value={form.username} onChangeText={t=>setForm({...form,username:t})} onFocus={()=>setFocusedInput('name')} onBlur={()=>setFocusedInput(null)}/>
                            </View>
                        </View>

                        {/* EMAIL */}
                        <View className="mb-4">
                            <Text className={`text-[11px] font-bold uppercase mb-2 ml-1 ${focusedInput === 'email' ? 'text-[#09228e]' : 'text-gray-400'}`}>Email</Text>
                            <View className={`w-full h-12 bg-white border rounded-xl flex-row items-center px-4 transition-all ${focusedInput === 'email' ? 'border-[#09228e] bg-blue-50/20' : 'border-gray-200'}`}>
                                <Mail size={18} color={focusedInput === 'email' ? '#09228e' : '#9ca3af'} />
                                <TextInput className="flex-1 ml-3 text-[15px]" placeholder="you@email.com" value={form.email} onChangeText={t=>setForm({...form,email:t})} onFocus={()=>setFocusedInput('email')} onBlur={()=>setFocusedInput(null)} keyboardType="email-address"/>
                            </View>
                        </View>

                        {/* PASSWORD (with requirements logic) */}
                        <View className="mb-6">
                            <Text className={`text-[11px] font-bold uppercase mb-2 ml-1 ${focusedInput === 'pass' ? 'text-[#09228e]' : 'text-gray-400'}`}>Password</Text>
                            <View className={`w-full h-12 bg-white border rounded-xl flex-row items-center px-4 transition-all ${focusedInput === 'pass' ? 'border-[#09228e] bg-blue-50/20' : 'border-gray-200'}`}>
                                <Lock size={18} color={focusedInput === 'pass' ? '#09228e' : '#9ca3af'} />
                                <TextInput className="flex-1 ml-3 text-[15px]" placeholder="••••••••" value={form.password} onChangeText={t=>setForm({...form,password:t})} onFocus={()=>setFocusedInput('pass')} onBlur={()=>setFocusedInput(null)} secureTextEntry={!showPass} />
                                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                                    {showPass ? <Eye size={18} color="#09228e"/> : <EyeOff size={18} color="#9ca3af"/>}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* PASSWORD STRENGTH VISUALS (From screenshot) */}
                        <View className="flex-row gap-2 mb-4 h-1 w-full px-1">
                            {[0,1,2,3].map((i) => (
                                <View key={i} className="flex-1 rounded-full transition-all duration-300" style={{ backgroundColor: getBarColor(i + 1) }} />
                            ))}
                        </View>

                        <Text className="text-gray-600 font-bold mb-2">Password requirements:</Text>
                        <View className="mb-8">
                            {[
                                { k: 'length', t: 'At least 8 characters' },
                                { k: 'upper', t: 'At least one uppercase letter' },
                                { k: 'lower', t: 'At least one lowercase letter' },
                                { k: 'num', t: 'At least one number' },
                                { k: 'special', t: 'At least one special character' },
                            ].map((r, i) => (
                                <View key={i} className="flex-row items-center mb-1">
                                    <View className={`w-1.5 h-1.5 rounded-full mr-2 ${reqs[r.k] ? 'bg-green-500' : 'bg-gray-400'}`} />
                                    <Text className={`text-[13px] ${reqs[r.k] ? 'text-gray-500 line-through' : 'text-gray-500'}`}>{r.t}</Text>
                                </View>
                            ))}
                        </View>

                        {/* SUBMIT BUTTON */}
                        <TouchableOpacity onPress={submit} activeOpacity={0.8} className="mb-5 shadow-xl shadow-blue-200" disabled={strengthLevel < 5}>
                             <LinearGradient
                                colors={strengthLevel < 5 ? ['#cbd5e1', '#94a3b8'] : ['#3b82f6', '#09228e']}
                                start={[0, 0]} end={[1, 0]}
                                style={{ height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', opacity: strengthLevel < 5 ? 0.8 : 1 }}
                             >
                                {isSubmitting ? <ActivityIndicator color="#fff"/> : <Text className="text-white font-bold text-lg">Create Account</Text>}
                             </LinearGradient>
                        </TouchableOpacity>

                        <View className="flex-row justify-center mt-2">
                             <Text className="text-gray-400 font-medium">Already have an account? </Text>
                             <TouchableOpacity onPress={() => router.push('/sign-in')}><Text className="text-[#09228e] font-bold">Sign In</Text></TouchableOpacity>
                        </View>

                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    </View>
  );
}