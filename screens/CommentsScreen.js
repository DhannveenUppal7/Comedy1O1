import { BackHandler, FlatList, Image, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Button from "../components/Button";
import isEmpty from '../helpers/isEmpty';
import Hyperlink from 'react-native-hyperlink'

const CommentsScreen = ({ post, commenting, setCommenting, setUsersi, setSelectedUser }) => {

    const [likedByMe, setLikedByMe] = useState(false);
    const [totalLikes, setTotalLikes] = useState(post.likes.length);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const commentsData = query(collection(db, "posts", post.id, "comments"), orderBy("createdAt", "desc"));
        onSnapshot(commentsData, (querySnapshot) => {
            setComments(querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            })))
        });
    }, []);


    const like = async () => {
        let aLikes = post.likes;
        if (aLikes.includes(auth.currentUser.uid) === false) {
            aLikes.push(auth.currentUser.uid);
            const docRef = updateDoc(doc(db, "posts", post.id), {
                likes: aLikes
            }).then(() => {
                setLikedByMe(true);
                setTotalLikes(totalLikes + 1);
            })
        }
    };

    const unlike = async () => {
        let aLikes = post.likes;
        if (aLikes.includes(auth.currentUser.uid) === true) {
            let myIndex = aLikes.indexOf(auth.currentUser.uid);
            aLikes.splice(myIndex, 1);
            const docRef = updateDoc(doc(db, "posts", post.id), {
                likes: aLikes
            }).then(() => {
                setLikedByMe(false);
                setTotalLikes(totalLikes - 1);
            })
        }
    };
    const commentNow = () => {
        if (post.length > 75) {
            alert("Comment's cannot have more than 75 Characters");
        }
        else {
            const docRef = addDoc(collection(db, "posts", post.id, "comments"), {
                comment: comment,
                createdByID: auth.currentUser.uid,
                createdByName: auth.currentUser.displayName,
                createdByEmail: auth.currentUser.email,
                createdAt: serverTimestamp()
            }).then(() => {
                setComment("");
            });
        }
    };
    const CommentItem = ({ comment }) => {
        // console.log("Post:", post.item.postDesc);
        return (
            // <Text>{post.item.postDesc}</Text>
            <View key={comment.id} className="p-3 mt-3 rounded-md" style={{ borderWidth: 1 }}>
                <Text>~{comment.createdByName}</Text>
                <Hyperlink linkStyle={{ color: "blue" }} linkDefault={true} onPress={Linking.openURL}>
                    <Text className="text-lg">{comment.comment}</Text>
                </Hyperlink>
            </View>
        )
    };
    const openUser = () => {
        setUsersi(true);
        setSelectedUser(post.createdByID);
    }
    BackHandler.addEventListener('hardwareBackPress', function () {
        if (commenting === true) {
          setCommenting(false);
          return true;
        }
        return false;
      });
    return (
        <SafeAreaView style={styles.container} className="bg-white min-h-full">
            <ScrollView className="mx-auto m-2 bg-white rounded-lg shadow-lg max-w-4xl border-black" style={{ borderWidth: 0.3 }}>
                <TextInput className="p-3 mt-3 mr-2 ml-2 border-black rounded-md text-xl" numberOfLines={3} multiline={true} style={{ borderWidth: 1, height: 75, textAlignVertical: 'top', }} onChangeText={setComment} value={comment} placeholder="Comment!" keyboardType="default" />
                <View className="mr-2 ml-2">
                    <Button onClick={commentNow} checkFor={(isEmpty(comment) === false)} title={"Comment"} />
                </View>
                <ScrollView className="mx-auto m-2  max-w-4xl p-6 mb-5" contentContainerStyle={{ paddingBottom: 100 }}>
                    <TouchableOpacity onPress={openUser}>
                        <Text className="mb-2 text-gray-700 font-bold">By {post.createdByName}</Text>
                    </TouchableOpacity>
                    {post.postType === "text" ? <Hyperlink linkStyle={{ color: "blue" }} linkDefault={true} onPress={Linking.openURL}>
                        <Text className="text-lg mt-3">{post.postDesc}</Text>
                    </Hyperlink> : <><View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Image source={{ uri: post.postImage }} className="rounded-md w-full" style={{ height: 300 }} />
                    </View>
                        <Hyperlink linkStyle={{ color: "blue" }} linkDefault={true} onPress={Linking.openURL}>
                            <Text className="text-lg mt-3">{post.postDesc}</Text>
                        </Hyperlink>
                    </>}
                    <View className=" bg-black w-full h-0.5 mt-2" style={{ opacity: 0.1 }}></View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        {/* <FontAwesome5 size={30} name="heart" /> */}
                        {likedByMe || post.likes.includes(auth.currentUser.uid) ? <TouchableOpacity onPress={unlike}>
                            <Ionicons size={30} name="heart" color="red" />
                        </TouchableOpacity> : <TouchableOpacity onPress={like}>
                            <Ionicons size={30} name="heart-outline" color="red" />
                        </TouchableOpacity>}
                        <Text>{totalLikes} Likes</Text>
                    </View>
                    {comments.length === 0 ? <View>
                        <Text className="text-center font-bold text-lg">No Comments Yet</Text>
                    </View> : comments.map((comment) => {
                        return (
                            <CommentItem key={comment.id} comment={comment} />
                            // <Text>{comment}</Text>
                        )
                    })}
                </ScrollView>
            </ScrollView>




            {/* <Text>{post.postDesc}</Text> */}
            {/* </View> */}
        </SafeAreaView>
    )
}

export default CommentsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})