import { BackHandler, Button, FlatList, Linking, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase';
import { collection, onSnapshot, orderBy, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Hyperlink from 'react-native-hyperlink'

const ClubChat = ({ club, openClub, setOpenClub }) => {
    const [message, setMessage] = useState("");
    const [chats, setChats] = useState([]);
    useEffect(() => {
        const chatsData = query(collection(db, "clubs", club.id, "messages"), orderBy("createdAt", "desc"));
        onSnapshot(chatsData, (querySnapshot) => {
            setChats(querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            })))
        });
    }, []);
    const send = () => {
        if (message.length > 80) {
            alert("Chat Messages cannot have more than 80 Characters");
        }
        else {
            const docRef = addDoc(collection(db, "clubs", club.id, "messages"), {
                message: message,
                createdByID: auth.currentUser.uid,
                createdByName: auth.currentUser.displayName,
                createdByEmail: auth.currentUser.email,
                createdAt: serverTimestamp(),
            }).then(() => {
                setMessage("");
            });
        }
    }
    const formateTime = (date) => {
        let mDate = date?.toDate();
        if (mDate) {

            let rD = `${mDate?.toDateString()} at ${mDate?.getHours()}:${mDate?.getMinutes()}:${mDate?.getSeconds()}`;
            return rD;
        }
    };
    const renderItem = (message) => {
        // console.log("Post:", post.item.postDesc);
        if (message.item.createdByID === auth.currentUser.uid) {
            return (
                // <Text>{post.item.postDesc}</Text>
                <View style={styles.sender}>
                    <Text style={{ color: "white", }}>~You</Text>
                    <Hyperlink linkStyle={{ color: "white", textDecorationLine: "underline" }} linkDefault={true} onPress={Linking.openURL}>
                        <Text style={{ color: "white", fontSize: 16, marginTop: 3 }}>{message.item.message}</Text>
                    </Hyperlink>
                    <Text style={{ color: "white", }}>{formateTime(message.item?.createdAt)}</Text>
                </View>
            )
        }
        else {
            return (
                // <Text>{post.item.postDesc}</Text>
                <View style={styles.receiver}>
                    <Text style={{ color: "black", }}>~{message.item.createdByName}</Text>
                    <Hyperlink linkStyle={{ color: "black", textDecorationLine: "underline" }} linkDefault={true} onPress={Linking.openURL}>
                        <Text style={{ color: "black", fontSize: 16, marginTop: 3 }}>{message.item.message}</Text>
                    </Hyperlink>                   
                     <Text style={{ color: "black", }}>{formateTime(message.item?.createdAt)}</Text>
                    {/* <View>{formateTime(message.item.createdAt)}</View> */}
                </View>
            )
        }
    };
    BackHandler.addEventListener('hardwareBackPress', function () {
        if (openClub === true) {
          setOpenClub(false);
          return true;
        }
        return false;
      });
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.footer}>
                <View style={{ height: 30 }} ></View>
                <TextInput value={message} onChangeText={setMessage} placeholder="Enter Your Message" style={{
                    height: 100,
                    flex: 1,
                    marginRight: 15,
                    backgroundColor: "#e0dcdc",
                    padding: 10,
                    color: "black",
                    borderRadius: 5,
                    overflow: "hidden",
                    textAlignVertical: 'top',
                    fontSize: 18
                }} multiline={true} />
                <TouchableOpacity onPress={send}>
                    <Ionicons size={30} name="send" color="#605adb" />
                </TouchableOpacity>
                {/* <Button onPress={message != "" ? sendMessage : () => { }} class={styles.sendContainer} type="clear" color="white" icon={<Icon name="send" style={message == "" ? { opacity: 0.34 } : { opacity: 1 }} size={25} color="red"></Icon>}></Button> */}
                {/* <Button onPress={sendMessagePicture} class={styles.sendContainer} type="clear" color="white" icon={<Icon name="image" size={25} color="red"></Icon>}></Button> */}

            </View>
            <Text className="text-3xl font-bold m-6 text-center">Club Messages</Text>
            <View className=" bg-black w-full h-0.5" style={{ opacity: 0.3 }}></View>
            <FlatList contentContainerStyle={{ paddingTop: 15 }} data={chats} renderItem={renderItem} keyExtractor={item => item.id} />
            {/* <Text>ClubChat</Text> */}
        </SafeAreaView>
    )
}

export default ClubChat

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 15
    },
    sender: {
        padding: 15,
        backgroundColor: "#605adb",
        alignSelf: "flex-end",
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: 300,
        position: "relative",
        justifyContent: "center"
    },
    receiver: {
        padding: 15,
        backgroundColor: "#e0dcdc",
        alignSelf: "flex-start",
        borderRadius: 20,
        marginLeft: 15,
        marginBottom: 20,
        maxWidth: 300,
        position: "relative",
        justifyContent: "center"
    }
})