const Message = ({ isUserMessage, message, timestamp }) => {
    return (
      <View style={[styles.messageContainer, isUserMessage ? styles.userMessage : styles.botMessage]}>
        <Text style={styles.timestamp}>{timestamp}</Text>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    );
  };
  