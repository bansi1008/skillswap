"use client"; // for Next.js 13+ with App Router

import { useEffect, useState } from "react";
import { database } from "../model/firebase";
import { ref, onValue, push, off } from "firebase/database";
import styles from "./Chat.module.css";

export default function Chat({ user, onClose, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatId, setChatId] = useState(null);

  // Generate consistent chat ID for two users
  const generateChatId = (userId1, userId2) => {
    const sortedIds = [userId1, userId2].sort();
    return `chat_${sortedIds[0]}_${sortedIds[1]}`;
  };

  // Listen to messages for the selected chat
  useEffect(() => {
    if (chatId) {
      const chatRef = ref(database, `chats/${chatId}/messages`);

      const unsubscribe = onValue(chatRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const messagesList = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          // Sort messages by timestamp
          messagesList.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          setMessages(messagesList);
        } else {
          setMessages([]);
        }
      });

      return () => off(chatRef, "value", unsubscribe);
    }
  }, [chatId]);

  const handleUserSelect = (chatUser) => {
    setSelectedUser(chatUser);
    const newChatId = generateChatId(currentUserId, chatUser._id);
    setChatId(newChatId);
    setMessages([]);
  };

  const handleSend = async () => {
    if (input.trim() === "" || !selectedUser || !chatId) return;

    const chatRef = ref(database, `chats/${chatId}/messages`);

    try {
      await push(chatRef, {
        text: input.trim(),
        senderId: currentUserId,
        receiverId: selectedUser._id,
        senderName: "You", // You can pass actual user name as prop
        createdAt: new Date().toISOString(),
      });
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const goBackToContacts = () => {
    setSelectedUser(null);
    setChatId(null);
    setMessages([]);
  };

  return (
    <div className={styles.chatOverlay} onClick={onClose}>
      <div
        className={styles.chatContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {!selectedUser ? (
          // Connections List View
          <div className={styles.contactsList}>
            <div className={styles.chatHeader}>
              <h2 className={styles.chatTitle}>Messages</h2>
              <button className={styles.closeButton} onClick={onClose}>
                ✕
              </button>
            </div>

            <div className={styles.contactsBody}>
              {user && Array.isArray(user) && user.length > 0 ? (
                <div className={styles.contactsGrid}>
                  {user.map((chatUser) => (
                    <div
                      key={chatUser._id}
                      className={styles.contactCard}
                      onClick={() => handleUserSelect(chatUser)}
                    >
                      <div className={styles.contactAvatar}>
                        {chatUser.name
                          ? chatUser.name.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      <div className={styles.contactInfo}>
                        <h3 className={styles.contactName}>
                          {chatUser.name || "Unknown User"}
                        </h3>
                        <p className={styles.contactStatus}>
                          {chatUser.location || "No location"}
                        </p>
                      </div>
                      <div className={styles.contactArrow}>›</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyContacts}>
                  <div className={styles.emptyIcon}>💬</div>
                  <h3>No connections to chat with</h3>
                  <p>Connect with people first to start chatting!</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Individual Chat View
          <div className={styles.chatInterface}>
            <div className={styles.chatHeader}>
              <button className={styles.backButton} onClick={goBackToContacts}>
                ‹
              </button>
              <div className={styles.chatUserInfo}>
                <div className={styles.chatAvatar}>
                  {selectedUser.name
                    ? selectedUser.name.charAt(0).toUpperCase()
                    : "U"}
                </div>
                <div>
                  <h3 className={styles.chatUserName}>
                    {selectedUser.name || "Unknown User"}
                  </h3>
                  <p className={styles.chatUserStatus}>
                    {selectedUser.location || "No location"}
                  </p>
                </div>
              </div>
              <button className={styles.closeButton} onClick={onClose}>
                ✕
              </button>
            </div>

            <div className={styles.messagesContainer}>
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`${styles.messageWrapper} ${
                      message.senderId === currentUserId
                        ? styles.sent
                        : styles.received
                    }`}
                  >
                    <div className={styles.message}>
                      <p className={styles.messageText}>{message.text}</p>
                      <span className={styles.messageTime}>
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyChat}>
                  <div className={styles.emptyChatIcon}>💬</div>
                  <p>Start a conversation with {selectedUser.name}!</p>
                </div>
              )}
            </div>

            <div className={styles.messageInput}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${selectedUser.name}...`}
                className={styles.textInput}
              />
              <button
                onClick={handleSend}
                className={styles.sendButton}
                disabled={!input.trim()}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
