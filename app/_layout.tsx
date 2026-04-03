import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NotesProvider } from '../src/context/NotesContext';
import { Colors } from '../src/utils/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotesProvider>
        <StatusBar style="light" backgroundColor={Colors.bg1} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.bg1 },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="note/[id]" />
          <Stack.Screen name="new-note" />
          <Stack.Screen name="edit-note/[id]" />
          <Stack.Screen name="settings" />
        </Stack>
      </NotesProvider>
    </GestureHandlerRootView>
  );
}
