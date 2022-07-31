import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useRoute } from '@react-navigation/native';

const ProfileScreen = ({ route }) => {
    const { user } = route.params;
    const [recU, setRecU] = useState({});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getUser();
    }, []);
    const getUser = async () => {
        setLoading(true);
        const docRef = doc(db, "users", user);
        onSnapshot(docRef, (querySnapshot) => {
            setRecU(querySnapshot.data());
            setLoading(false);
        });


        // const docSnap = await getDoc(docRef);
        // if (docSnap.exists()) {
        //   setRecU(docSnap.data());
        //   setLoading(false);
        // } else {
        //   // doc.data() will be undefined in this case
        //   console.log("No such document!");
        // }

    }
    const follow = () => {
        if (recU.followers?.includes(auth.currentUser.uid) === false) {
            let followers = recU.followers;
            followers.push(auth.currentUser.uid);
            const docRef = doc(db, "users", user);
            updateDoc(docRef, {
                followers: followers
            }).then(() => {
                let following = recU.following;
                following.push(user);
                const myRef = doc(db, "users", auth.currentUser.uid);
                updateDoc(myRef, {
                    following: following
                })
            });
        }
    };
    const unfollow = () => {
        if (recU.followers?.includes(auth.currentUser.uid) === true) {
            let followers = recU.followers;
            let myFollow = followers.indexOf(auth.currentUser.uid);
            followers.splice(myFollow, 1);
            const docRef = doc(db, "users", user);
            updateDoc(docRef, {
                followers: followers
            }).then(() => {
                let following = recU.following;
                let myFollowing = following.indexOf(user);
                followers.splice(myFollowing, 1);
                const myRef = doc(db, "users", auth.currentUser.uid);
                updateDoc(myRef, {
                    following: following
                })
            });
        }
    };


    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size={50} color="#605adb" />
            </View>
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingTop: 30 }}>
                <View style={{ alignItems: "center", justifyContent: "space-around" }}>
                    <Image source={require("../assets/user.png")} style={{ width: 150, height: 150 }} />
                    <Text className="text-3xl text-center font-extrabold">{recU.name}</Text>
                </View>
                <View className="m-2 mt-3 bg-black w-full h-0.5"></View>
                {/* <View className="p-6" style={{ flexDirection: "row" }}> */}
                <Text className="p-6 font-bold text-2xl">{recU.followers?.length} Followers</Text>

                {/* </View> */}
                {user !== auth.currentUser.uid ? <View style={{ paddingRight: 20, paddingLeft: 20 }}>
                    {recU.followers?.includes(auth.currentUser.uid) ? <TouchableOpacity onPress={unfollow} className="bg-indigo-500 p-3 text-center rounded-md w-full" style={styles.activeButton}>
                        <Text className="text-2xl text-white text-center">Unfollow</Text>
                    </TouchableOpacity> : <TouchableOpacity onPress={follow} className="bg-indigo-500 p-3 text-center rounded-md w-full" style={styles.activeButton}>
                        <Text className="text-2xl text-white text-center">Follow</Text>
                    </TouchableOpacity>}
                </View> : null}


                <Text className="p-6 font-bold text-2xl">{recU.following?.length} Following</Text>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-evenly",
        backgroundColor: '#FFFFFF'
    }
})