import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import Button from '../components/Button';
import isEmpty from '../helpers/isEmpty';
import emailCheck from '../helpers/emailCheck';
import passwordCheck from '../helpers/passwordCheck';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const SignUp = () => {
    const [uName, setUName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const signUp = async () => {
        await createUserWithEmailAndPassword(auth, email.toLowerCase(), password).then(async (authUser) => {
            await updateProfile(auth?.currentUser, {
                displayName: uName,
            }).then(()=>{
                setDoc(doc(db, "users", auth.currentUser.uid), {
                    name: uName,
                    email: email,
                    password: password,
                    followers: [],
                    following: []
                })
            });
        }).catch(error => {
            alert("Error While Creating Account.");
        });
    };

    return (
        <View className="bg-white min-h-full">
            <ScrollView behavior='padding' enabled className="p-6">
                <Text className="text-xl text-center font-bold">Hey You Need To Sign In before you begin with your laughter dose.</Text>
                <View className="mt-8">
                    <Image className="w-full h-64 rounded-md " source={{ uri: "https://images.hindustantimes.com/rf/image_size_960x540/HT/p2/2020/05/02/Pictures/_70bd864a-8c7e-11ea-bfc8-a8b22bcdbb5c.jpg" }} />
                    <TextInput className="p-3 mt-8 border-black rounded-md text-xl" style={{ borderWidth: 1 }} onChangeText={setUName} value={uName} placeholder="Enter your Name" keyboardType="default" />
                    <TextInput className="p-3 mt-8 border-black rounded-md text-xl" style={{ borderWidth: 1 }} onChangeText={setEmail} value={email} placeholder="Enter your Email Address" keyboardType="email-address" />
                    <TextInput className="p-3 mt-8 border-black rounded-md text-xl" style={{ borderWidth: 1 }} onChangeText={setPassword} value={password} placeholder="Enter the Password" keyboardType="default" secureTextEntry />
                    <Button onClick={signUp} checkFor={(isEmpty(uName) === false && emailCheck(email) && passwordCheck(password)) ? true : false} title={"Sign Up"} />
                </View>
            </ScrollView>
        </View>
    )
}

export default SignUp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#FFFFFF'


    },

})