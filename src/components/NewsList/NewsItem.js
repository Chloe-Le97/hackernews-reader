import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {useHistory} from 'react-router-native';
import * as Linking from 'expo-linking';

const NewsItem = (props) =>{
    const item = props.item;

    const history = useHistory();

    return(
        <View key={item.objectID}>
            <Text onPress={()=> history.push(`post/${item.objectID}`)}>{item.title}</Text>
            <TouchableWithoutFeedback onPress={()=> Linking.openURL(`${item.url}`)}><Text>({item.url})</Text></TouchableWithoutFeedback>
            <Text>{item.points} points | {item.author} | {item.num_comments} comments</Text>
        </View>
    )

}

export default NewsItem;    