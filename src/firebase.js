import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyD1SS7Yj4SxP0DDu0K2n5F520AGFizB8RU",
    authDomain: "apollo11-90f5d.firebaseapp.com",
    databaseURL: "https://apollo11-90f5d-default-rtdb.firebaseio.com",
    projectId: "apollo11-90f5d",
    storageBucket: "apollo11-90f5d.appspot.com",
    messagingSenderId: "992124200159",
    appId: "1:992124200159:web:ee1a4a2663f40776c3f56a",
    measurementId: "G-DY4F11287Q"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };