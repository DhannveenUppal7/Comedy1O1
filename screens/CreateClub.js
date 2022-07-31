import { ActivityIndicator, BackHandler, Image, Keyboard, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Button from '../components/Button';
import isEmpty from '../helpers/isEmpty';
import { addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const CreateClub = ({ setCreating,creating }) => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [imgBlob, setImgBlob] = useState(null);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Create Your Club",
        })
    }, []);

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

    const createClub = async () => {
        Keyboard.dismiss();
        if (name.length > 15) {
            alert("Clubs's cannot have more than 15 Characters");
        }
        else {
            setIsLoading(true);
            const docRef = await addDoc(collection(db, "clubs"), {
                name: name,
                createdByID: auth.currentUser.uid,
                createdByName: auth.currentUser.displayName,
                createdByEmail: auth.currentUser.email,
                createdAt: serverTimestamp(),
                users: [{
                    uid: auth.currentUser.uid,
                    name: auth.currentUser.displayName,
                    email: auth.currentUser.email
                }],
                status: false
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

            const storageRef = await ref(storage, `clubImages/${docRef.id}`);
            await uploadBytesResumable(storageRef, blob);
            await getDownloadURL(storageRef).then(async (url) => {
                await updateDoc(docRef, {
                    clubImage: url,
                    status: true
                }).then(() => {
                    setImgBlob(null);
                    setName("");
                    setIsLoading(false);
                    setCreating(false);
                });
            })
        }
    };

    BackHandler.addEventListener('hardwareBackPress', function () {
        if (creating === true) {
          setCreating(false);
          return true;
        }
        return false;
      });
    return (
        <SafeAreaView style={styles.container}>
            {/* <Text>CreateClub</Text> */}
            {isLoading ? <View>
                <ActivityIndicator size={50} color="#605adb" />
            </View> :
                <View>

                    <ScrollView>
                        <TextInput className="p-3 mt-8 mr-2 ml-2 border-black rounded-md text-xl" style={{ borderWidth: 1, textAlignVertical: 'top', }} onChangeText={setName} value={name} placeholder="What's the Club Name" keyboardType="default" />
                        <Text className="font-bold text-2xl mt-6 text-center">Club Photograph</Text>
                        {imgBlob === null ? <TouchableOpacity onPress={uploadImage} style={{ alignItems: "center" }}>
                            <Image source={require("../assets/nofile.png")} className="rounded-lg mt-5" style={{ width: 300, height: 300 }} />
                        </TouchableOpacity> : <TouchableOpacity onPress={uploadImage} style={{ alignItems: "center" }}>
                            <Image source={{ uri: imgBlob.uri }} className="rounded-lg mt-5" style={{ width: 300, height: 300, borderWidth: 1, borderColor: "black" }} />
                        </TouchableOpacity>}
                        <View style={{ padding: 10 }}>
                            <Button onClick={createClub} checkFor={(isEmpty(name) === false) && imgBlob !== null} title={"Create Club"} />
                        </View>
                    </ScrollView>
                </View>
            }

        </SafeAreaView>
    )
}

export default CreateClub

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-evenly",
        backgroundColor: '#FFFFFF'
    }
})