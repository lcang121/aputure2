import React from 'react';
import { Provider } from 'react-redux';
import { Image, View, StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import store from './store';
import HomeScreen from './screens/HomeScreen';
import TaskFormScreen from './screens/TaskFormScreen';

export type RootStackParamList = {
  Home: undefined;
  Task: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home"  options={{
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                header: () => <View style={styles.header}>
                  <Image
                      source={require('./assets/Aputure_Logo.png')}
                      style={{ width: 300, height: 70, resizeMode: 'contain' }}
                    />
              </View>,
              }}
              component={HomeScreen} />
            <Stack.Screen name="Task" component={TaskFormScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  header: { display: 'flex', alignItems:'center', justifyContent:'center', height: 110 }
});