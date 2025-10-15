import { Stack } from 'expo-router';

export default function OpportunitiesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="budget" />
      <Stack.Screen name="auto-invest" />
    </Stack>
  );
}
