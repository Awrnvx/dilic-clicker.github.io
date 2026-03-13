// firebase-config.js
// Импортируем функции Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, get, child, update, query, orderByChild, limitToLast } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Твой конфиг из консоли Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBHcptZefbC53BR6wMPEtyIF9GCx2y7xjw",
    authDomain: "dilic-clicker.firebaseapp.com",
    projectId: "dilic-clicker",
    storageBucket: "dilic-clicker.firebasestorage.app",
    messagingSenderId: "651188156647",
    appId: "1:651188156647:web:7ef858931f7fb4526b8a42"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Экспортируем для использования в других файлах
export { database, ref, set, get, child, update, query, orderByChild, limitToLast };