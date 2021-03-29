import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {useHistory} from 'react-router-native';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoriteItem = (props) =>{
    const item = props.item;

    const history = useHistory();

    return(
        <View key={item.objectID} style={{backgroundColor:'white', padding: 10}}>
            <Text onPress={()=> history.push(`post/${item.objectID}`)} style={{fontWeight:'bold'}}>{item.title}</Text>
            <View style={{ alignItems: 'baseline' }}>
                <Text onPress={()=> Linking.openURL(`${item.url}`)} style={{textDecorationLine:'underline'}}>({item.url})</Text>
            </View>
        </View>
    )

}

export default FavoriteItem;    