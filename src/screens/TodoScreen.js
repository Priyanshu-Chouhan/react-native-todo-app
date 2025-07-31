import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { TextInput, Button, Card, Text, IconButton, Checkbox } from 'react-native-paper';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

export default function TodoScreen() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'todos'), where('userId', '==', auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todoList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTodos(todoList);
    });

    return unsubscribe;
  }, []);

  const addTodo = async () => {
    if (!task.trim()) {
      Alert.alert('Error', 'Please enter a task');
      return;
    }

    try {
      await addDoc(collection(db, 'todos'), {
        text: task,
        completed: false,
        userId: auth.currentUser.uid,
        createdAt: new Date()
      });
      setTask('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add task');
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await updateDoc(doc(db, 'todos', id), {
        completed: !completed
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete task');
    }
  };

  const renderTodo = ({ item }) => (
    <Card style={styles.todoCard}>
      <Card.Content style={styles.todoContent}>
        <Checkbox
          status={item.completed ? 'checked' : 'unchecked'}
          onPress={() => toggleTodo(item.id, item.completed)}
        />
        <Text
          style={[
            styles.todoText,
            item.completed && styles.completedText
          ]}
        >
          {item.text}
        </Text>
        <IconButton
          icon="delete"
          onPress={() => deleteTodo(item.id)}
          iconColor="#f44336"
        />
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        My Tasks
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Add a new task..."
          value={task}
          onChangeText={setTask}
          mode="outlined"
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={addTodo}
          style={styles.addButton}
          buttonColor="#2c3e50"
        >
          +
        </Button>
      </View>
      
      <FlatList
        data={todos}
        renderItem={renderTodo}
        keyExtractor={item => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    color: '#2c3e50',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  todoCard: {
    marginBottom: 10,
    backgroundColor: 'white',
    elevation: 1,
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
});