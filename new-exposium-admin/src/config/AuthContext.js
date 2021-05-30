import React, { useContext, useState, useEffect } from "react";
import { database } from ".";
import { auth, messaging } from "./firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  const sendNotification = async (notification, FCMToken) => {
    const SERVER_KEY =
      "AAAAyr7oyDA:APA91bH4m8JHTVdSCKUZRCvcZeXEc-FPSsFGZeJQX1G8hrv5dgCdSd8Dqk0hsp86pg1qcfH6PaPVORBLX3mRlnhKKgmjMFfnQDDOftN2mKkIak4jT-vPMgb6RfuKT8ZUDAWdyijFGLia";
    const FCM_PUSH_URL = "https://fcm.googleapis.com/fcm/send";
    const body = {
      to: FCMToken,
      data: { message: "hello" },
      notification,
      icon: "icon_name",
      tag: FCMToken,
      priority: "high",
    };
    try {
      const response = await fetch(FCM_PUSH_URL, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "key=" + SERVER_KEY,
        },
      });
      const results = await response?.json();
      return results;
    } catch (error) {
      // console.log(error.message);
      // console.log(error);
    }
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        database.ref(`Users/${user?.uid}/isOnline`).set(true);
        "Notification" in window &&
          Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
              // Get FCM Token
              messaging
                .requestPermission()
                .then(() => {
                  return messaging.getToken();
                })
                .then((fcmToken) => {
                  database.ref(`Users/${user?.uid}/fcmToken`).set(fcmToken);
                });
            }
          });
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    resetPassword,
    sendNotification,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
