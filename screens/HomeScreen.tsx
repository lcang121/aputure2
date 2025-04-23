import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet
} from 'react-native';
import {
  FAB,
  Card,
  Text,
  IconButton,
  TextInput,
  Menu,
} from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setTasks, deleteTask } from '../store/tasksSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootState, AppDispatch } from '../store';
import { RootStackParamList } from '../App';
import EmptyState from '../components/EmptyState';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const tasks = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleMenuId, setVisibleMenuId] = useState<null | number>(null);
  const [sortOption, setSortOption] = useState<'title' | 'newest' | 'oldest'>('newest');
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState(tasks);

  useEffect(() => {
    const loadTasks = async () => {
      const json = await AsyncStorage.getItem('TASKS');
      const parsed = json ? JSON.parse(json) : [];
      if (parsed.length > 0) {
        dispatch(setTasks(parsed));
      }
    };
    loadTasks();
  }, [dispatch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
        setFilteredTasks(
            tasks.filter(task =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.date.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, 300); // debounce delay of 300ms

    return () => clearTimeout(timeoutId);
  }, [searchQuery, tasks]);

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortOption === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  });

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search"
        value={searchQuery}
        mode="outlined"
        outlineColor="transparent"
        onChangeText={setSearchQuery}
        outlineStyle={styles.searchOutline}
        style={styles.searchInput}
        right={
          <TextInput.Icon
            icon="magnify"
            color="white"
            style={styles.searchIcon}
          />
        }
      />

      {sortedTasks.length === 0 && searchQuery.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <View style={styles.titleRow}>
            <Text style={styles.title}>All Tasks</Text>
            <Menu
              visible={sortMenuVisible}
              onDismiss={() => setSortMenuVisible(false)}
              anchor={
                <IconButton
                  icon="sort"
                  size={20}
                  iconColor="white"
                  onPress={() => setSortMenuVisible(true)}
                  style={styles.sortButton}
                />
              }
            >
              <Menu.Item
                onPress={() => {
                  setSortOption('title');
                  setSortMenuVisible(false);
                }}
                title="Title (A-Z)"
                leadingIcon={sortOption === 'title' ? 'check' : undefined}
              />
              <Menu.Item
                onPress={() => {
                  setSortOption('newest');
                  setSortMenuVisible(false);
                }}
                title="Date (Newest)"
                leadingIcon={sortOption === 'newest' ? 'check' : undefined}
              />
              <Menu.Item
                onPress={() => {
                  setSortOption('oldest');
                  setSortMenuVisible(false);
                }}
                title="Date (Oldest)"
                leadingIcon={sortOption === 'oldest' ? 'check' : undefined}
              />
            </Menu>
          </View>

          <FlatList
            data={sortedTasks}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <Card.Title
                  title={item.title}
                  titleStyle={styles.cardTitle}
                  right={() => (
                    <Menu
                      visible={visibleMenuId === item.id}
                      onDismiss={() => setVisibleMenuId(null)}
                      anchor={
                        <IconButton
                          icon="dots-vertical"
                          onPress={() => setVisibleMenuId(item.id)}
                        />
                      }
                    >
                      <Menu.Item
                        onPress={() => {
                          setVisibleMenuId(null);
                          navigation.navigate('Task', { task: item });
                        }}
                        title="Edit"
                      />
                      <Menu.Item
                        onPress={() => {
                          dispatch(deleteTask(item.id));
                          setVisibleMenuId(null);
                        }}
                        title="Delete"
                      />
                    </Menu>
                  )}
                />
                <Card.Content>
                  <Text>{item.description}</Text>
                  <Text style={styles.cardDate}>{item.date}</Text>
                </Card.Content>
              </Card>
            )}
          />

          <FAB
            icon="plus"
            label="Add Task"
            color="white"
            style={styles.fab}
            onPress={() => navigation.navigate('Task')}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    marginBottom: 16,
    backgroundColor: '#e2e3e6',
  },
  searchOutline: {
    borderRadius: 16,
  },
  searchIcon: {
    backgroundColor: '#ec5f5f',
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    marginBottom: 12,
  },
  fab: {
    backgroundColor: '#ec5f5f',
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  cardDate: {
    textAlign: 'right',
    color: '#aaa',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  sortButton: {
    marginRight: 4,
    backgroundColor: '#ec5f5f',
    borderRadius: 8,
  },
});
