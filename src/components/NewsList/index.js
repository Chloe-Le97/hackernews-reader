import React, {useState, useEffect, useRef} from 'react';
import {View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import NewsItem from './NewsItem';
import { useDebouncedCallback } from 'use-debounce';

const styles = StyleSheet.create({
    separator: {
      height: 10,
    },
    flatlist:{
    //   marginBottom: 100,
      flexGrow:1, 
      height: Dimensions.get('window').height - 30
    },
    pageNumberContainer:{
        width: 280,
        display: 'flex',
        flexDirection: 'row',
        padding: 5,
        marginLeft: 5
    },
    pageNumber:{
        backgroundColor:'orange',
        borderWidth: 1,
        width: 40,
        textAlign: 'center'
    },
    current:{
        borderWidth: 1,
        backgroundColor: 'white',
        width: 40,
    },
    searchBar:{
      padding: 10,

    }
  });

const ItemSeparator = () => <View style={styles.separator} />;

const NewsList = () => {

    const scrollViewRef = useRef();

    const [news, setNews] = useState([]);
    const [maxPage, setMaxPage] = useState(100);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(true)

    const fetchApiNews = async () =>{
        let response;
        
        if(searchInput!=''){
          response = await fetch(`http://hn.algolia.com/api/v1/search?query=${searchInput}&page=${currentPage}&tags=story`);

          const json = await response.json();
          
          setNews(json.hits);
          setLoading(false)
          setMaxPage(json.nbPages);

        }else{

          response = await fetch(`https://hn.algolia.com/api/v1/search_by_date?page=${currentPage}&tags=story`);

          const json = await response.json();
          
          setNews(json.hits);
          setLoading(false)
          setMaxPage(json.nbPages);
        }
  
    }

    useEffect(()=>{
        fetchApiNews()
    },[currentPage])

    const searchNews = useDebouncedCallback(
      async (value)=>{
        const response = await fetch(`http://hn.algolia.com/api/v1/search?query=${value}&page=${currentPage}&tags=story`);
        const json = await response.json();

        // flatListRef.current?.scrollToOffset({ animated: false, offset: 0 })
        setNews(json.hits);
        setLoading(false)
        setMaxPage(json.nbPages);
      },500
    )

 

    const setPage = (page) =>{
      setLoading(true); 
      setCurrentPage(page);
      scrollViewRef.current?.scrollTo({ x: (page-3)*40, y: 0, animated: true });
    }


    let pageItems = []

    for (let i=1; i<= maxPage; i++){
      if(i == currentPage){
        pageItems.push(<TouchableOpacity key={i} disabled={true} style={styles.current}><Text style={{textAlign:'center'}}>{currentPage}</Text></TouchableOpacity>)
      }
      else{
        pageItems.push(<TouchableOpacity key={i} style={styles.pageNumber} onPress={()=> setPage(i)}><Text style={{textAlign:'center'}}>{i}</Text></TouchableOpacity>)
      }
    }

    return(
        <View style={{marginBottom: 150, flexGrow:1, backgroundColor:'#F6F6EF'}}>
        <TextInput style={styles.searchBar} placeholder="Search" value={searchInput} onChangeText={(text) => {setSearchInput(text);searchNews(text)}}></TextInput>
 
        {loading==true?(<View style={{height: `100%`}}><Text>Loading...</Text></View>):(
          <FlatList
            data={news}
            ItemSeparatorComponent={ItemSeparator}
            contentContainerStyle={{ minHeight: `100%` }}
            scrollEnabled={true}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index, ItemSeparatorComponent })=>(
              <View key={item.objectID} style={{ flex: 1 }}>
                <NewsItem item={item}/> 
              </View>
            )}
          />)}

                <View style={styles.pageNumberContainer}>
                  <ScrollView horizontal ref={scrollViewRef}>
                    {pageItems}
                  </ScrollView>
                

            </View>
      </View>
    )
}

export default NewsList;