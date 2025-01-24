import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import { readingSessionChatbot } from '../../../apis/ai/ai';
import { useAuth } from '../../../context/AuthContext';

export default function Chatbot() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { authToken } = useAuth();
  const flatListRef = useRef(null);

  useEffect(() => {
    const initialMessage = {
      id: Date.now(),
      message: "Hello! I'm the Bookworm Chatbot. How can I assist you today?",
      isUserMessage: false,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages([initialMessage]);
  }, []);

  const sendMessage = useCallback(async () => {
    if (message.trim()) {
      setIsLoading(true);
      const userMessage = {
        id: Date.now(),
        message: message.trim(),
        isUserMessage: true,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setMessage('');

      try {
        const response = await readingSessionChatbot(message.trim(), authToken);
        const chatbotMessage = {
          id: Date.now() + 1,
          message: response.response,
          isUserMessage: false,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prevMessages) => [...prevMessages, chatbotMessage]);
      } catch (error) {
        console.error("Error fetching chatbot response:", error);
        const errorMessage = {
          id: Date.now() + 1,
          message: "Sorry, I couldn't fetch the response. Please try again.",
          isUserMessage: false,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  }, [message, authToken]);

  const renderItem = useCallback(({ item }) => (
    <View style={[styles.messageRow, item.isUserMessage ? styles.userMessageRow : styles.botMessageRow]}>
      <Avatar
        size="small"
        rounded
        source={{ uri: item.isUserMessage ? "https://your-image-source/user.jpg" : "https://your-image-source/chatbot.jpg" }}
        containerStyle={[styles.avatar, { backgroundColor: item.isUserMessage ? 'dodgerblue' : 'tomato' }]}
      />
      <View style={[styles.message, item.isUserMessage ? styles.userMessage : styles.botMessage]}>
        <Text style={styles.time}>{item.timestamp}</Text>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    </View>
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Avatar
          size="medium"
          rounded
          source={{ uri: "https://your-image-source/avatar.jpg" }}
          containerStyle={styles.headerAvatar}
        />
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
        ListFooterComponent={isLoading ? <ActivityIndicator size="large" color="dodgerblue" /> : null}
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
          <Icon name="send" size={24} color="dodgerblue" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F0',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerAvatar: {
    backgroundColor: 'deepskyblue',
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
    padding: 20,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  botMessageRow: {
    alignSelf: 'flex-start',
  },
  avatar: {
    marginRight: 10,
  },
  message: {
    maxWidth: '80%',
    borderRadius: 20,
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
    backgroundColor: '#DBF3FA',
    marginLeft: 10,
  },
  botMessage: {
    backgroundColor: '#FAD2D2',
    marginRight: 10,
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
  },
});
