import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
const Greeting = ({ navigation }) => {
    // const Glogin = async () => {
    //     try {
    //         //await GoogleSignIn.askForPlayServicesAsync();
    //         const result = await Google.logInAsync({ //return an object with result token and user
    //             iosClientId: "", //From app.json
    //             androidClientId: '189583449850-l6s62h6fcvd5nb6ueost6007j35aj28c.apps.googleusercontent.com', //From app.json
    //         });
    //         if (result.type === 'success') {
    //             console.log(result);
    //             const credential = GoogleAuthProvider.credential( //Set the tokens to Firebase
    //                 result.idToken,
    //                 result.accessToken
    //             );
                
    //             signInWithCredential(credential) //Login to Firebase
    //                 .catch((error) => {
    //                     console.log(error);
    //                 });
    //         } else {
    //             //CANCEL
    //         }
    //     } catch ({ message }) {
    //         alert('login: Error:' + message);
    //     }
    // };

    return (
        <View className="bg-white min-h-full" style={styles.container}>
            <ScrollView behavior='padding' enabled className="p-6">
                <Text className="font-bold text-2xl text-center">Start your Laughter dose by Signing In</Text>
                <Image source={require("../assets/icon.png")} style={{ width: 300, height: 300 }} />
                <TouchableOpacity className="bg-indigo-500 w-full p-3 text-center rounded-md mt-6" onPress={() => { navigation.navigate("SignIn") }}>
                    <Text className="text-2xl text-white text-center font-bold">Sign In</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity className="bg-blue-100 w-full p-3 text-center rounded-md mt-2" style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }} onPress={()=>{}}>
                    <Text className="text-xl text-black text-center mr-3">Sign In With Google</Text>
                    <Image source={require("../assets/google-icon.png")} style={{ width: 50, height: 50 }} />
                </TouchableOpacity> */}
                <Text className="text-xl text-black text-center mt-6">Don't Have An Account Sign Up Now</Text>
                <TouchableOpacity className="bg-green-500 w-full p-3 text-center rounded-md mt-6" style={styles.activeButton} onPress={() => { navigation.navigate("SignUp") }}>
                    <Text className="text-2xl text-white text-center font-bold">Sign Up</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

export default Greeting

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        //   justifyContent: 'center',
    },
});
