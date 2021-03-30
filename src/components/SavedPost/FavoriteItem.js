import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useHistory} from 'react-router-native';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoriteItem = (props) =>{
    const item = props.item;

    const history = useHistory();

    return(
        <View key={item.objectID} style={{backgroundColor:'white', padding: 10}}>
            <Text onPress={()=> history.push(`post/${item.objectID}`)} style={{fontWeight:'bold'}}>{item.title}</Text>

            {item.url==null?(null):(
                <View style={{ alignItems: 'baseline' }}>
                    <Text onPress={()=> Linking.openURL(`${item.url}`)} style={{textDecorationLine:'underline'}}>({item.url})</Text>
                </View>
            )}

            <TouchableOpacity onPress={()=>props.removeSavedPost(item.objectID)} style={{backgroundColor:'#1f1f1f', width: 70, padding: 5, marginTop: 8, borderRadius: 5}}>
                <Text style={{color:'orange', textAlign: 'center'}}>Remove</Text>
            </TouchableOpacity>
        </View>
    )

}

export default FavoriteItem;    