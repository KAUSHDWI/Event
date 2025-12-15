import { Redirect } from 'expo-router';
import { useGlobalContext } from '../context/GlobalProvider'; // Correct path
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { isLoading, isLogged } = useGlobalContext();

  // If currently loading user status, show a spinner.
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#09228e" />
      </View>
    );
  }

  // If user is logged in, redirect to the main dashboard (Drawer).
  if (isLogged) {
    return <Redirect href="/(drawer)" />;
  } 
  
  // If user is NOT logged in (and not loading), redirect to Sign In.
  else { // Added else block for clarity, though it's implied
    return <Redirect href="/(auth)/sign-in" />;
  }

  // The lines below `router.push` were removed because they were incorrectly placed and undefined.
  // The `Redirect` component already handles navigation based on `isLogged`.
}