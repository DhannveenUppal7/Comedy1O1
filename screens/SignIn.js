import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import Button from '../components/Button';
import isEmpty from '../helpers/isEmpty';
import emailCheck from '../helpers/emailCheck';
import passwordCheck from '../helpers/passwordCheck';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const signIn = async () => {
        signInWithEmailAndPassword(auth, email.toLowerCase(), password).catch(error => {
            alert("Email ID or Password is Wrong.");
          });
    };

    return (
        <View className="bg-white min-h-full">
            <ScrollView behavior='padding' enabled className="p-6">
                <Text className="text-xl text-center font-bold">Hey You Need To Sign In before you begin with your laughter dose.</Text>
                <View className="mt-8">
                    <Image className="w-full h-64 rounded-md " source={{ uri: "https://images.hindustantimes.com/rf/image_size_960x540/HT/p2/2020/05/02/Pictures/_70bd864a-8c7e-11ea-bfc8-a8b22bcdbb5c.jpg" }} />
                    <TextInput className="p-3 mt-8 border-black rounded-md text-xl" style={{ borderWidth: 1 }} onChangeText={setEmail} value={email} placeholder="Enter your Email Address" keyboardType="email-address" />
                    <TextInput className="p-3 mt-8 border-black rounded-md text-xl" style={{ borderWidth: 1 }} onChangeText={setPassword} value={password} placeholder="Enter the Password" keyboardType="default" secureTextEntry />
                    <Button onClick={signIn} checkFor={(emailCheck(email)) ? true : false} title={"Sign In"} />
                </View>
            </ScrollView>
        </View>
    )
}

export default SignIn

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#FFFFFF'


    },

})