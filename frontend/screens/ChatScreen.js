import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [userId, setUserId] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadUserId();
    loadInitialMessage();
  }, []);

  const loadUserId = async () => {
    const id = await AsyncStorage.getItem('userId');
    setUserId(id);
  };

  const loadInitialMessage = () => {
    setMessages([{
      id: '1',
      from: 'agent',
      text: '좋은 아침이에요! 어젯밤 잘 주무셨어요? 😊',
      timestamp: new Date(),
    }]);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !userId) return;

    const userMessage = {
      id: Date.now().toString(),
      from: 'user',
      text: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputText;
    setInputText('');

    try {
      const response = await api.post('/conversations', {
        userId,
        message: messageText,
      });

      const agentMessage = {
        id: (Date.now() + 1).toString(),
        from: 'agent',
        text: response.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={item.from === 'user' ? styles.messageRight : styles.messageLeft}>
      {item.from === 'agent' && <Text style={styles.messageName}>김철수</Text>}
      <View style={item.from === 'user' ? styles.messageBubbleUser : styles.messageBubbleAI}>
        <Text style={item.from === 'user' ? styles.messageTextUser : styles.messageTextAI}>
          {item.text}
        </Text>
      </View>
      <Text style={styles.messageTime}>
        {item.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>김철수</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.inputPlus}>
            <Text style={{ fontSize: 20, color: '#666' }}>+</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="메시지 입력..."
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={{ fontSize: 18, color: '#fff' }}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  messageList: { flex: 1 },
  messageListContent: { padding: 20 },
  messageLeft: { marginBottom: 20 },
  messageRight: { marginBottom: 20, alignItems: 'flex-end' },
  messageName: { fontSize: 12, color: '#666', marginBottom: 4, marginLeft: 4 },
  messageBubbleAI: { backgroundColor: '#f0f0f0', padding: 12, paddingHorizontal: 16, borderRadius: 18, maxWidth: '75%' },
  messageBubbleUser: { backgroundColor: '#0066FF', padding: 12, paddingHorizontal: 16, borderRadius: 18, maxWidth: '75%' },
  messageTextAI: { color: '#1a1a1a', fontSize: 15, lineHeight: 22 },
  messageTextUser: { color: '#fff', fontSize: 15, lineHeight: 22 },
  messageTime: { fontSize: 11, color: '#999', marginTop: 4, marginHorizontal: 4 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0', backgroundColor: '#fff' },
  inputPlus: { width: 36, height: 36, backgroundColor: '#f0f0f0', borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, height: 40, backgroundColor: '#f8f9fa', borderRadius: 20, paddingHorizontal: 16, fontSize: 15 },
  sendButton: { width: 36, height: 36, backgroundColor: '#0066FF', borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
