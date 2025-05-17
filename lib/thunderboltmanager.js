const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const credentials1 = require("../key1.json");

const firebaseConfig = {
    apiKey: "AIzaSyB3U0xwXJPetBwIRsk3r0NCIqfb6iH6l24",
    authDomain: "thunderbolt-a38de.firebaseapp.com",
    projectId: "thunderbolt-a38de",
    storageBucket: "thunderbolt-a38de.firebasestorage.app",
    messagingSenderId: "501094038565",
    appId: "1:501094038565:web:fe6c37a225907d8409d3cc",
};


const secondaryAppConfig = {
    credential: cert(credentials1),
};

const thunderbolt = initializeApp(secondaryAppConfig, 'thunderbolt');

const dbThunderbolt = getFirestore(thunderbolt);
const auth = getAuth(thunderbolt);



class ThunderboltManager {
    async getUserDetails(id) {
        var result = "hello";
        await auth
            .getUser(id)
            .then(async (userRecord) => {       
                const snap = await dbThunderbolt.collection("users").doc(id).get();
                result = {
                    avatarId: snap.data().avatarId,
                    email: userRecord.email,
                    displayName: userRecord.displayName,
                    nlCount : snap.data().countNL
                };
            })
            .catch((error) => {
                result = {
                    avatarId: 0,
                    email: '',
                    displayName: '',
                    nlCount : 0
                };
            });

        return result;

    }

}

const thunderboltm = new ThunderboltManager();

module.exports = thunderboltm;