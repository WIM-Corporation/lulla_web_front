// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyDFlxKc7Wzyn6ZMGvJUh9MnfJMcKb0nbRE",
  authDomain: "lullatest.firebaseapp.com",
  databaseURL: "https://lullatest.firebaseio.com",
  projectId: "lullatest",
  storageBucket: "lullatest.appspot.com",
  messagingSenderId: "679530149171",
  appId: "1:679530149171:web:c3bfd28310724034ce3a46",
  measurementId: "G-6YS1NYBYBJ"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
