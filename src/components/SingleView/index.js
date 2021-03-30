import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native';
import {useParams} from 'react-router-native';
import * as Linking from 'expo-linking';
import HTML from "react-native-render-html";
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
    separator: {
      height: 10,
    },

    commentAuthor:{
        fontSize: 12,
        fontWeight: '700',
    },
    flatlistHead:{
        padding: 5,
        marginBottom: 10,
        backgroundColor:'white',
    },
    saveBtn:{
        backgroundColor:'#f29d00', 
        width: 50, 
        padding: 5, 
        borderRadius: 5, 
        marginTop: 5
    },
    textBtn:{
        textAlign:'center',
        color:'black'}
  });

const ItemSeparator = () => <View style={styles.separator} />;

const CommentRender = (props) => {
    let item = props.item;
    const contentWidth = useWindowDimensions().width;

    if(!item.text){return(
        <Text>Loading...</Text>
    )}

    return(
    <View>
        <Text style={styles.commentAuthor}>{item.author} on {item.created_at.split("T")[0]}</Text>
        <HTML containerStyle={{marginTop: -15, padding: 0}} source={{ html: item.text }} contentWidth={contentWidth} />
        {item.children.length>0?(
        <>
            {item.children.map((child) => 
            (<View key={child.id} style={{marginLeft: 10}}>
                <CommentRender key={child.id} item={child}/>
            </View>
            ))}
        </>)
        :(null)}
    </View>)
}


const SingleView = () =>{

    const id = useParams().id;

    const [comments, setComments] = useState([]);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [point, setPoint] = useState('');
    const [url, setUrl] = useState('');

    const fetchAPI = async () =>{
        try{
            const response = await fetch(`https://hn.algolia.com/api/v1/items/${id}`)
            const json = await response.json();
    
            setComments(json.children)
            setTitle(json.title)
            setUrl(json.url)
            setAuthor(json.author)
            setPoint(json.points)

        }catch (e){
            console.log(e)
        }

    }

    useEffect(()=>{
        fetchAPI();
    },[])

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

    if(title==''){return (<View><Text>Loading...</Text></View>)}

    return(
            <View style={{marginBottom: 80, flexGrow:1,  backgroundColor:'#F6F6EF'}}>
            <FlatList
            data={comments}
            contentContainerStyle={{ minHeight: `100%` }}
            ListHeaderComponent={()=>(

                <View style={styles.flatlistHead}>
                    <Text style={{fontWeight:'bold'}}>{title}</Text>
                    <Text>{point} points | {author}</Text>

                    {url?(<Text onPress={()=> Linking.openURL(`${url}`)} style={{textDecorationLine:'underline'}}>({url})</Text>):(null)}
                    <TouchableOpacity style={styles.saveBtn} onPress={savePost}>
                        <Text style={styles.textBtn}>Save</Text>
                    </TouchableOpacity>
                </View>

            )}
            ItemSeparatorComponent={ItemSeparator}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={true}
            renderItem={({ item, index, ItemSeparatorComponent })=>(

            <View style={{ flex: 1 , padding: 5, marginTop: 5, backgroundColor: 'white'}}>
                    <CommentRender item={item}/>
            </View>

            )}
            />
            </View>
  
    )

}

export default SingleView