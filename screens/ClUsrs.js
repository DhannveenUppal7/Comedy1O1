import { BackHandler, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebase';
import RBSheet from 'react-native-raw-bottom-sheet';
import Button from '../components/Button';
import { doc, updateDoc } from 'firebase/firestore';

const ClUsrs = ({ club, openUsrs, setOpenUsrs }) => {
    const delModal = useRef();
    const [selectedUser, setSelectedUser] = useState(null);
    const deleteUser = () => {
        if(club.createdByID === auth.currentUser.uid){
            let myIndex = club.users.indexOf(selectedUser);
            club.users.splice(myIndex, 1)
            const docRef = updateDoc(doc(db, "clubs", club.id), {
                users: club.users
            })
        };
    };
    const renderItem = (user) => {
        return (
            <>
                <TouchableOpacity className="bg-gray-100 p-6 mr-2 ml-2 rounded-md mb-2" style={styles.user}>
                    <Text className="font-bold text-xl">{user.item.name}</Text>
                    {user.item.uid !== club.createdByID ? club.createdByID === auth.currentUser.uid ? <TouchableOpacity onPress={() => {
                        setSelectedUser(user.item)
                        delModal.current.open();

                    }}>
                        <Ionicons size={30} name="trash" color="red" style={{ marginLeft: 10 }} />
                    </TouchableOpacity> : null : null}
                </TouchableOpacity>
            </>
        )
    };
    BackHandler.addEventListener('hardwareBackPress', function () {
        if (openUsrs === true) {
          setOpenUsrs(false);
          return true;
        }
        return false;
      });
    return (
        <SafeAreaView style={styles.container}>
            <Text className="text-2xl text-center m-3 font-bold">Comedy Souls in the {club.name}</Text>
            <View className=" bg-black w-full h-0.5" style={{ opacity: 0.3 }}></View>
            <RBSheet
                ref={delModal}
                closeOnDragDown={true}
                closeOnPressMask={false}
                customStyles={{
                    draggableIcon: {
                        backgroundColor: "#000"
                    },
                    wrapper: {
                        flex: 1,
                    },
                    container: {
                        height: "50%"
                    }
                }}
            >
                <ScrollView >
                    <Text className="text-xl p-2 text-center">Hey You are Removing {selectedUser?.name} from this Club, if you are sure you can continue as this action cannot be undone.</Text>
                    <Text className="text-lg p-2 text-center font-bold">Note: Some Previous Messages by the user would still be visible</Text>
                    <View style={{ paddingRight: 10, paddingLeft: 10 }}>
                        <Button onClick={deleteUser} checkFor={true} title={"Remove User"} />
                    </View>


                </ScrollView>
            </RBSheet>
            <FlatList contentContainerStyle={{ paddingTop: 15 }} data={club.users} renderItem={renderItem} keyExtractor={item => item.uid} />
        </SafeAreaView>
    )
}

export default ClUsrs

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    user: {
        flexDirection: "row",
        justifyContent: "space-between"
        // backgroundColor: "gray"
    }
})