import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { auth, db } from '../firebase'
import isEmpty from '../helpers/isEmpty';
import Button from '../components/Button';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const ComedyPost = ({ navigation }) => {
    const [post, setPost] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const sendPost = () => {
        if (post.length > 160) {
            alert("Post's cannot have more than 160 Characters");
        }
        else {
            setIsLoading(true);
            const docRef = addDoc(collection(db, "posts"), {
                postDesc: post,
                createdByID: auth.currentUser.uid,
                createdByName: auth.currentUser.displayName,
                createdByEmail: auth.currentUser.email,
                createdAt: serverTimestamp(),
                likes: [],
                postType: "text",
                status: true
            }).then(() => {
                setPost("");
                setIsLoading(false);
                navigation.navigate("ComedyFeed");
            });
        }
    };
    return (
        <View style={styles.container} className="bg-white min-h-full">
            {isLoading ? <View>
                <ActivityIndicator size={50} color="#605adb" />
            </View> :
                <View>

                    <ScrollView>
                        <TextInput className="p-3 mt-8 mr-2 ml-2 border-black rounded-md text-xl" numberOfLines={4} multiline={true} style={{ borderWidth: 1, height: 200, textAlignVertical: 'top', }} onChangeText={setPost} value={post} placeholder="What's the Post all about!" keyboardType="default" />
                        <View style={{ padding: 10 }}>
                            <Button onClick={sendPost} checkFor={(isEmpty(post) === false)} title={"Post"} />
                        </View>
                    </ScrollView>
                </View>
            }

        </View>
    )
}

export default ComedyPost

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-evenly",
        backgroundColor: '#FFFFFF'


    },
})