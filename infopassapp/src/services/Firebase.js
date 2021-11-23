import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";



import { storageSave, storageRemove, storageGet } from './Storage'
const firebaseConfig = {
  apiKey: "AIzaSyDmLwfjdZdTQwo5Pi-1Z0Ed8GYtj_HOZMk",
  authDomain: "infopass-final.firebaseapp.com",
  projectId: "infopass-final",
  storageBucket: "infopass-final.appspot.com",
  messagingSenderId: "188840926113",
  appId: "1:188840926113:web:3a657456221b1bdbc589e0"

};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();


export const login = (email, password) => {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((usuario) => {
        storageSave("TOKEN_KEY", usuario.user.uid)
        resolve(true)
      })
      .catch((error) => {
        storageRemove("TOKEN_KEY")
        let erro = error.code
        if (erro === "auth/wrong-password")
          reject("Usuário ou Senha Inválidos")
        else
          reject("Algo deu errado!")
      })
  })
}


export const sigin = (email, password) => {
  return new Promise((resolve, reject) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        resolve("Usuário Registrado!")
      })
      .catch(() => {
        reject("Usuário já inserido no banco!")
      })
  })
}


export const logoff = () => {
  return new Promise((resolve, reject) => {
    storageRemove("TOKEN_KEY")
    signOut(auth).then(() => {
      resolve()
    }).catch((error) => {
      reject()
    });
  })
}


export const saveLojas = (loja, Geocode) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(loja)
      // descobrir a lat, lng do endereço informado

      Geocode.fromAddress(loja.endereco).then(
        async (response) => {
          const { lat, lng } = response.results[0].geometry.location;
          loja.lat = lat
          loja.lng = lng
          await addDoc(collection(db, "lojas"), loja);
          resolve()
        },
        (error) => {
          reject("Endereço incorreto!")
        }
      );


    } catch (error) {
      reject(error)
    }
  })
}

export const deleteLojas = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      await deleteDoc(doc(db, 'lojas', id));
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}


export const getLojas = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const querySnapshot = await getDocs(collection(db, "lojas"));
      let dados = []
      querySnapshot.forEach((doc) => {
        dados.push({
          id: doc.id,
          endereco: doc.data().endereco,
          descricao: doc.data().descricao,
          lat: doc.data().lat,
          lng: doc.data().lng,
        })
      });
      resolve(dados)
    } catch (error) {
      reject(error)
    }
  })
}




export const isAuthenticated = () => storageGet("TOKEN_KEY") !== null;
export const getToken = () => storageGet("TOKEN_KEY")


