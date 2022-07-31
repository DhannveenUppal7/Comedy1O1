import { ActivityIndicator, Image, Keyboard, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { auth, db, storage } from '../firebase'
import isEmpty from '../helpers/isEmpty';
import Button from '../components/Button';
import { addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const ComedyImgPost = ({ navigation }) => {
    const [post, setPost] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [imgBlob, setImgBlob] = useState(null);

    const sendImgPost = async () => {
        Keyboard.dismiss();
        if (post.length > 160) {
            alert("Post's cannot have more than 160 Characters");
        }
        else {
            setIsLoading(true);
            const docRef = await addDoc(collection(db, "posts"), {
                postDesc: post,
                createdByID: auth.currentUser.uid,
                createdByName: auth.currentUser.displayName,
                createdByEmail: auth.currentUser.email,
                createdAt: serverTimestamp(),
                likes: [],
                status: false,
                postType: "image"
            });
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
        
                // on load
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                // on error
                xhr.onerror = function (e) {
                    reject(new TypeError("Network request failed"));
                };
                // on complete
                xhr.responseType = "blob";
                xhr.open("GET", imgBlob.uri, true);
                xhr.send(null);
            });

            const storageRef = await ref(storage, `posts/${docRef.id}`);
            await uploadBytesResumable(storageRef, blob);
            await getDownloadURL(storageRef).then(async (url) => {
                await updateDoc(docRef, {
                    postImage: url,
                    status: true
                }).then(() => {
                    setImgBlob(null);
                    setPost("");
                    setIsLoading(false);
                    navigation.navigate("ComedyFeed");
                });
            })
        }
    };
    const uploadImage = async () => {
        Keyboard.dismiss();
        await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "Images",
            allowsEditing: true,
            spect: [1, 1],
            quality: 1
        }).then((blob) => {
            if (!blob.cancelled) {
                setImgBlob(blob);
            }
        })
    };


    return (
        <SafeAreaView style={styles.container} >
            {isLoading ? <View>
                <ActivityIndicator size={50} color="#605adb" />
            </View> :
                <View>
                    <ScrollView>
                        <Text className="font-bold text-2xl text-center mt-4">What's the Meme!</Text>
                        {imgBlob === null ? <TouchableOpacity onPress={uploadImage} style={{ alignItems: "center" }}>
                            <Image source={require("../assets/nofile.png")} className="rounded-lg mt-5" style={{ width: 300, height: 300 }} />
                        </TouchableOpacity> : <TouchableOpacity onPress={uploadImage} style={{ alignItems: "center" }}>
                            <Image source={{ uri: imgBlob.uri }} className="rounded-lg mt-5" style={{ width: 300, height: 300 }} />
                        </TouchableOpacity>}
                        <TextInput className="p-3 mt-8 mr-2 ml-2 border-black rounded-md text-xl" numberOfLines={4} multiline={true} style={{ borderWidth: 1, height: 200, textAlignVertical: 'top', }} onChangeText={setPost} value={post} placeholder="Any Caption!" keyboardType="default" />
                        <View style={{ padding: 10, marginBottom: 16 }}>
                            <Button onClick={sendImgPost} checkFor={imgBlob !== null} title={"Post"} />
                        </View>
                    </ScrollView>
                </View>
            }

        </SafeAreaView>
    )
}

export default ComedyImgPost

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-evenly",
        backgroundColor: '#FFFFFF'


    },
})