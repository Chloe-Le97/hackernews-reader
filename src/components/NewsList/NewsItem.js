import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useHistory} from 'react-router-native';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
    saveBtn:{
        backgroundColor:'#f29d00', 
        width: 50, 
        padding: 5, 
        borderRadius: 5, 
        marginTop: 5
    },
    textBtn:{
        textAlign:'center',
        fontWeight: '600',
        color:'black'}
})

const NewsItem = (props) =>{
    const item = props.item;

    const history = useHistory();

    const savePost = async () =>{
        try {
            let jsonValue = await AsyncStorage.getItem('POSTS')
 

            if(jsonValue!=null){
                let raw = JSON.parse(jsonValue)

                const duplicate = raw.find((news)=> news.objectID== item.objectID)
                if(duplicate){return}

                const savedItem = [item,...JSON.parse(jsonValue)];
                await AsyncStorage.setItem(
                'POSTS',
                JSON.stringify(savedItem)
                );
                console.log('success')
            }else{
                jsonValue= [];
                const savedItem = [item,...jsonValue];
                await AsyncStorage.setItem(
                'POSTS',
                JSON.stringify(savedItem)
            );
            console.log('success')
            }
            
          } catch (error) {
            console.log(error)
          }
    }

    return(
        <View key={item.objectID} style={{backgroundColor:'white', padding: 10}}>
            <Text onPress={()=> history.push(`post/${item.objectID}`)} style={{fontWeight: 'bold'}}>{item.title}</Text>
            {item.url==null?(<></>):(
                <View style={{ alignItems: 'baseline' }}>
                    <Text onPress={()=> Linking.openURL(`${item.url}`)} style={{textDecorationLine:'underline'}}>({item.url})</Text>
                </View>
            )}

            <Text>{item.points} points | {item.author} | {item.num_comments} comments</Text>
            <TouchableOpacity style={styles.saveBtn} onPress={savePost}>
                <Text style={styles.textBtn}>Save</Text>
            </TouchableOpacity>
        </View>
    )

}

export default NewsItem;    