import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Route, Switch, Redirect } from 'react-router-native';
import AppBar from '../AppBar';
import NewsList from '../NewsList';
import SingleView from '../SingleView';
import SavedPost from '../SavedPost';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
  },
});

const Main = () => {
  return (
    <View style={styles.container}>
      <AppBar />
      <Switch>
        <Route path="/" exact>
            <NewsList/>
        </Route>
        <Route path="/post/:id" exact>
            <SingleView/>
        </Route>
        <Route path="/saved" exact>
            <SavedPost/>
        </Route>
        <Redirect to="/" />
      </Switch>
    </View>
  );
};

export default Main;
