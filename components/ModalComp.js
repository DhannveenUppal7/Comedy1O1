import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Button from './Button';
import { auth, db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const ModalComp = ({ selectedID,clubs, joinModalx }) => {
    const [myClub, setMyClub] = useState({});
    useEffect(() => {
        let ms = clubs.filter(obj => {
            return obj.id === selectedID;
        });
        setMyClub(ms[0]);
    }, []);

    const joinMyClub = () => {
        let results = myClub.users.filter(obj => {
            return obj.uid === auth.currentUser.uid;
        });
        if(results.length === 0){
            const usersx = myClub.users;
            usersx.push({
                uid: auth.currentUser.uid,
                name: auth.currentUser.displayName,
                email: auth.currentUser.email
            });
            updateDoc(doc(db, "clubs", myClub.id), {
                users: usersx
            }).then(()=>{
                joinModalx.current.close();
                alert("You have been added to the club, now you can start chatting with Comedy Souls")
            })
        }
    }
    
    return (
        <ScrollView>
            <Text className="text-2xl text-center font-bold">Join the {myClub.name}</Text>
            <Text className="text-xl mt-4 mr-2 ml-2 text-center" >Hello, You are joining the {myClub.name} which currently has {myClub.users?.length} {myClub.users?.length === 1 ? "Member" : "Members"}.</Text>
            <View style={{ paddingRight: 10, paddingLeft: 10 }}>
                <Button onClick={joinMyClub} checkFor={true} title={"Join Club"} />
            </View>
        </ScrollView>
    )
}

export default ModalComp

const styles = StyleSheet.create({})