import React, { useState } from 'react';
import { StyleSheet, Platform, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button, HelperText, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { addTask, updateTask, Task } from '../store/tasksSlice';
import uuid from 'react-native-uuid';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

interface Props {
  navigation: any;
  route: any;
}

export default function TaskFormScreen({ navigation, route }: Props) {
  const taskToEdit: Task | undefined = route.params?.task;
  const [title, setTitle] = useState(taskToEdit?.title || '');
  const [description, setDescription] = useState(taskToEdit?.description || '');
  const [date, setDate] = useState(taskToEdit?.date || '');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [dateError, setDateError] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = () => {
    let hasError = false;

    if (!title.trim()) {
      setTitleError('Title is required.');
      hasError = true;
    } else {
      setTitleError('');
    }

    if (!description.trim()) {
      setDescriptionError('Description is required.');
      hasError = true;
    } else {
      setDescriptionError('');
    }

    if (!date.trim()) {
      setDateError('Date is required.');
      hasError = true;
    } else {
      setDateError('');
    }

    if (hasError) {
      return;
    }

    const payload = { title, description, date };

    if (taskToEdit) {
      dispatch(updateTask({ ...taskToEdit, ...payload }));
    } else {
      dispatch(addTask({ id: uuid.v4().toString(), ...payload }));
    }

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text variant="headlineMedium" style={styles.header}>
        {taskToEdit ? 'Edit Task' : 'New Task'}
      </Text>

      <TextInput
        mode="outlined"
        label="Title"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          titleError && setTitleError('');
        }}
        style={styles.input}
        error={!!titleError}
      />
      {!!titleError && <HelperText type="error">{titleError}</HelperText>}

      <TextInput
        mode="outlined"
        label="Description"
        value={description}
        onChangeText={(text) => {
          setDescription(text);
          descriptionError && setDescriptionError('');
        }}
        style={styles.input}
        multiline
        numberOfLines={4}
        error={!!descriptionError}
      />
      {!!descriptionError && <HelperText type="error">{descriptionError}</HelperText>}

      <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.8}>
        <TextInput
          mode="outlined"
          label="Date"
          value={date ? moment(date).format('MMM DD, YYYY') : ''}
          style={styles.input}
          editable={false}
          right={<TextInput.Icon icon="calendar" />}
          error={!!dateError}
        />
      </TouchableOpacity>
      {!!dateError && <HelperText type="error">{dateError}</HelperText>}

      {showDatePicker && (
        <RNDateTimePicker
          value={date ? new Date(date) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(moment(selectedDate).format('YYYY-MM-DD'));
              setDateError('');
            }
          }}
        />
      )}

      <Button
        mode="contained"
        buttonColor="#ec5f5f"
        onPress={handleSubmit}
        contentStyle={styles.buttonContent}
        style={styles.button}
        labelStyle={ styles.taskButton }
      >
        {taskToEdit ? 'Update Task' : 'Save Task'}
      </Button>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 24,
    fontWeight: '600',
  },
  input: {
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
  },
  taskButton: {
    color: 'white',
  }
});
