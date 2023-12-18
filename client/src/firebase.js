import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCq1zurZnRxGXo8mllbRUE7cRKhqYdzK8o",
  authDomain: "dasboard-41742.firebaseapp.com",
  projectId: "dasboard-41742",
  storageBucket: "dasboard-41742.appspot.com",
  messagingSenderId: "470136347827",
  appId: "1:470136347827:web:2577b56f6a329b95cee4c6",
  measurementId: "G-8V42HLREDL",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
