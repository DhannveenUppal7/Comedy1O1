import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { TailwindProvider } from 'tailwindcss-react-native';
import ComedyFeed from './screens/ComedyFeed';
import Onboarding from './screens/Onboarding';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import ComedyClubs from './screens/ComedyClubs';
import { auth, db } from './firebase';
import SignIn from './screens/SignIn';
import Greeting from './screens/Greeting';
import SignUp from './screens/SignUp';
import { signOut } from 'firebase/auth';
import ComedyPost from './screens/ComedyPost';
import ComedyImgPost from './screens/ComedyImgPost';
import ProfileScreen from './screens/ProfileScreen';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App({ navigation }) {
  const [onBoarding, setOnBoarding] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const onLoad = async () => {
    // AsyncStorage.clear();
    try {
      const jsonValue = await AsyncStorage.getItem('onboarding_done')
      // console.log(jsonValue)
      if (jsonValue == null) {
        setOnBoarding(false);
        auth.onAuthStateChanged((authUser) => {
          if (authUser) {
            setUser(authUser);
            setLoading(false);
            
          }
          else {
            setUser(null);
            setLoading(false);
          }
        });
      }
      else {
        if (jsonValue === "true") {
          setOnBoarding(true);
          auth.onAuthStateChanged((authUser) => {
            if (authUser) {
              setUser(authUser);
              setLoading(false);
              
            }
            else {
              setUser(null);
              setLoading(false);
            }
          });
        }
      }
    } catch (e) {

    }
  };
  useEffect(() => {
    onLoad();
  }, []);

  function TabBarIcon(props) {
    if (props.name === "laugh") {
      return <FontAwesome5 size={30} style={{ marginBottom: -3 }} {...props} />;
    }
    return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
  }
  const signOutUser = () => {
    auth.signOut().then(() => {
      navigation.replace("SignIn");
    })
  };

  if(loading){
    // return <AppLoading />
    return <Image source={require("./assets/splash.gif")} style={{ width: "100%", height: "100%" }} />
  }
  return (
    <>
    <StatusBar style="dark" />
    <NavigationContainer>
      <TailwindProvider>
        {onBoarding === false ? <Stack.Navigator screenOptions={{
          headerStyle: {
            backgroundColor: '#605adb',
            elevation: 0
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: '900',
            fontSize: 22
          },
          headerTitleAlign: "center",
          headerTitle: "Welcome to Comedy1O1",
          cardStyle: { backgroundColor: 'white' }
        }}>
          <Stack.Screen name="Onboarding" component={Onboarding} initialParams={{ setOnBoarding: setOnBoarding }} />
        </Stack.Navigator> : user ? <Tab.Navigator screenOptions={{
          headerStyle: {
            backgroundColor: '#605adb',
            elevation: 0
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: '900',
            fontSize: 22
          },
          headerTitleAlign: "center",
          cardStyle: { backgroundColor: 'white' },
          tabBarItemStyle: {
            paddingBottom: 1
          },
          tabBarActiveTintColor: "#605adb",
          tabBarLabelStyle: {
            fontWeight: "bold"
          },
          headerRight: () => {
            return (<View style={{ marginRight: 20 }}>
              <TouchableOpacity onPress={signOutUser} activeOpacity="0.5">
                <TabBarIcon name="log-out" color="white" />
              </TouchableOpacity>
            </View>)
          },

        }}>
          <Tab.Screen name="ComedyFeed" options={({ navigation }) => ({
            title: "Comedy Feed",
            tabBarIcon: ({ color }) => <TabBarIcon name="laugh" color={color} />,
          })} component={ComedyFeed}/>
          <Tab.Screen
            name="ComedyPost"
            component={ComedyPost}
            options={{
              title: "",
              headerTitle: "Write A Comedy Post",
              tabBarIcon: ({ tintColor }) => (
                <View
                  style={{
                    position: 'absolute',
                    bottom: -13, // space from bottombar
                    height: 68,
                    width: 68,
                    borderRadius: 58,
                    backgroundColor: '#605adb',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TabBarIcon name="pencil" color={"white"} />

                </View>
              ),
            }}
          />
          <Tab.Screen
            name="ComedyImg"
            component={ComedyImgPost}
            options={{
              title: "",
              headerTitle: "Write A Comedy Post",
              tabBarIcon: ({ tintColor }) => (
                <View
                  style={{
                    position: 'absolute',
                    bottom: -13, // space from bottombar
                    height: 68,
                    width: 68,
                    borderRadius: 58,
                    backgroundColor: '#605adb',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TabBarIcon name="image" color={"white"} />

                </View>
              ),
            }}
          />
          <Tab.Screen name="ComedyClubs" options={({ navigation }) => ({
            title: "Comedy Clubs",
            tabBarIcon: ({ color }) => <TabBarIcon name="people" color={color} />,
          })} component={ComedyClubs} />
        </Tab.Navigator> : <Stack.Navigator initialRouteName='Greeting' screenOptions={{
          headerStyle: {
            backgroundColor: '#605adb',
            elevation: 0
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: '900',
            fontSize: 22
          },
          headerTitleAlign: "center",
          cardStyle: { backgroundColor: 'white' }
        }}>
          <Stack.Screen name="GettingStarted" options={{ headerTitle: "Lets Start!" }} component={Greeting} />
          <Stack.Screen name="SignIn" options={{ headerTitle: "Sign In" }} component={SignIn} />
          <Stack.Screen name="SignUp" options={{ headerTitle: "Sign Up" }} component={SignUp} />
        </Stack.Navigator>}
      </TailwindProvider>
    </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
