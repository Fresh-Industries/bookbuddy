import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { chatbot } from '../../../apis/ai/ai';

export default function Chatbot() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);

  const sendMessage = useCallback(async () => {
    if (message.trim()) {
      const userMessage = {
        id: Date.now(),
        message: message.trim(),
        isUserMessage: true,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setMessage('');

      try {
        const response = await chatbot(message.trim());
        if (response && response.response) {
          const chatbotMessage = {
            id: Date.now() + 1,
            message: response.response,
            isUserMessage: false,
            timestamp: new Date().toLocaleTimeString(),
          };
          setMessages((prevMessages) => [...prevMessages, chatbotMessage]);
        }
      } catch (error) {
        console.error("Error fetching chatbot response:", error);
        const errorMessage = {
          id: Date.now() + 1,
          message: "Sorry, I couldn't fetch the response. Please try again.",
          isUserMessage: false,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    }
  }, [message]);

  const renderItem = useCallback(({ item }) => (
    <View style={[styles.messageRow, item.isUserMessage ? styles.userMessageRow : styles.botMessageRow]}>
      <View style={[styles.avatar, { backgroundColor: item.isUserMessage ? '#007BFF' : '#18b4b4' }]}>
        <Text style={styles.avatarLabel}>{item.isUserMessage ? 'U' : 'B'}</Text>
      </View>
      <View style={[styles.message, item.isUserMessage ? styles.userMessage : styles.botMessage]}>
        <Text style={styles.time}>{item.timestamp}</Text>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    </View>
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.avatar, styles.headerAvatar]}>
          <Text style={styles.avatarLabel}>B</Text>
        </View>
        <Text style={styles.title}>Bookworm Chat</Text>
        <Text style={styles.subtitle}>Engage in insightful conversations about books</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messageContainer}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#999',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerAvatar: {
    backgroundColor: 'blue',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  messageContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  botMessageRow: {
    justifyContent: 'flex-start',
  },
  avatar: {
    marginRight: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: {
    color: '#fff',
    fontWeight: '700',
  },
  message: {
    maxWidth: '70%',
    borderRadius: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userMessage: {
    backgroundColor: '#007BFF',
    marginLeft: 40,
  },
  botMessage: {
    backgroundColor: '#18b4b4',
    marginRight: 40,
  },
  messageText: {
    color: '#333',
  },
  time: {
    fontSize: 10,
    color: '#999',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    padding: 10,
    backgroundColor: '#FFF',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    marginRight: 10,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  sendButtonText: {
    color: '#007BFF',
    fontWeight: '700',
  },
});
