import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
  );
}
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Title } from 'react-native-paper';

import FormButton from '../components/formButton';
import { AuthContext } from '../navigation/authProvider';

export default function HomeScreen() {
  const { user, logout } = useContext(AuthContext);

  return (
      <View style={styles.container}>
        <Title>ChatKitty Example</Title>
        <FormButton 
          modeValue="contained" 
          title="Logout" 
          onPress={() => logout()}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import { withInAppNotification } from '@chatkitty/react-native-in-app-notification';
import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { IconButton } from 'react-native-paper';

import { getChannelDisplayName, kitty } from '/blog/chatkitty';
import BrowseChannelsScreen from '/blog/screens/BrowseChannelsScreen';
import ChatScreen from '/blog/screens/ChatScreen';
import CreateChannelScreen from '/blog/screens/CreateChannelScreen';
import HomeScreen from '/blog/screens/HomeScreen';

const ChatStack = createStackNavigator();
const ModalStack = createStackNavigator();

export default function HomeStack() {
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      kitty.updateCurrentUser((user) => {
        user.properties = {
          ...user.properties,
          'expo-push-token': token,
        };

        return user;
      });
    });
  }, []);

  return (
    <ModalStack.Navigator mode="modal" headerMode="none">
      <ModalStack.Screen
        name="ChatApp"
        component={withInAppNotification(ChatComponent)}
      />
      <ModalStack.Screen name="CreateChannel" component={CreateChannelScreen} />
    </ModalStack.Navigator>
  );
}

function ChatComponent({ navigation, showNotification }) {
  useEffect(() => {
    return kitty.onNotificationReceived((notification) => {
      showNotification({
        title: notification.title,
        message: notification.body,
        onPress: () => {
          switch (notification.data.type) {
            case 'USER:SENT:MESSAGE':
            case 'SYSTEM:SENT:MESSAGE':
              kitty.getChannel(notification.data.channelId).then((result) => {
                navigation.navigate('Chat', { channel: result.channel });
              });
              break;
          }
        },
      });
    });
  }, [navigation, showNotification]);

  return (
    <ChatStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#5b3a70',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontSize: 22,
        },
      }}
    >
      <ChatStack.Screen
        name="Home"
        component={HomeScreen}
        options={(options) => ({
          headerRight: () => (
            <IconButton
              icon="plus"
              size={28}
              color="#ffffff"
              onPress={() => options.navigation.navigate('BrowseChannels')}
            />
          ),
        })}
      />
      <ChatStack.Screen
        name="BrowseChannels"
        component={BrowseChannelsScreen}
        options={(options) => ({
          headerRight: () => (
            <IconButton
              icon="plus"
              size={28}
              color="#ffffff"
              onPress={() => options.navigation.navigate('CreateChannel')}
            />
          ),
        })}
      />
      <ChatStack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          title: getChannelDisplayName(route.params.channel),
        })}
      />
    </ChatStack.Navigator>
  );
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Constants.isDevice && Platform.OS !== 'web') {
    const {
      status: existingStatus,
    } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}