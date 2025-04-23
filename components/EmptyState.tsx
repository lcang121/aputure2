import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const EmptyState = () => {
    const navigation = useNavigation();
    return (
    <View style={styles.container}>
        <Icon name="calendar-remove-outline" size={80} color="#ccc" />
        <Text style={styles.description}>You have no task yet.</Text>
    <Button mode="contained" onPress={() => navigation.navigate('Task')} style={styles.button}>
        Add Task
    </Button>
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 16,
  },
  description: {
    fontSize: 16,
    color: '#777',
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#ec5f5f',
  },
});

export default EmptyState;