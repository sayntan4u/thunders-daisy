const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const credentials1 = require("../key1.json");
const { Prospect } = require("./models/prospect");

const secondaryAppConfig = {
  credential: cert(credentials1),
};

const thunderbolt = initializeApp(secondaryAppConfig, "thunderbolt");

const db = getFirestore(thunderbolt);
const auth = getAuth(thunderbolt);

class ThunderboltManager {

  async getUserDetails(id) {
    var result = "hello";
    await auth
      .getUser(id)
      .then(async (userRecord) => {
        const snap = await db.collection("users").doc(id).get();
        result = {
          avatarId: snap.data().avatarId,
          email: userRecord.email,
          displayName: userRecord.displayName,
          nlCount: snap.data().countNL,
          lastLogin : userRecord.metadata.lastSignInTime
        };
      })
      .catch((error) => {
        result = {
          avatarId: 0,
          email: "",
          displayName: "",
          nlCount: 0,
          lastLogin : ""
        };
      });

    return result;
  }

  async getData(uid, collection = "namelist") {
    const snapshot = await db
      .collection("users")
      .doc(uid)
      .collection(collection)
      .listDocuments();

    const docArray = [];

    for (let i = 0; i < snapshot.length; i++) {
      const snap = await db
        .collection("users")
        .doc(uid)
        .collection(collection)
        .doc(snapshot[i].id)
        .get();

      const p = new Prospect({
        id: snap.data().id,
        name: snap.data().name,
        week: snap.data().week,
        zone: snap.data().zone,
        city: snap.data().city,
        chatting: snap.data().chatting,
        socialMedia: snap.data().socialMedia,
        stage1: snap.data().stage1,
        stage1Week: snap.data().stage1Week,
        stage2: snap.data().stage2,
        stage2Week: snap.data().stage2Week,
        info: snap.data().info,
        infoWeek: snap.data().infoWeek,
        infoResponse: snap.data().infoResponse,
        reinfo: snap.data().reinfo,
        reinfoWeek: snap.data().reinfoWeek,
        reinfoResponse: snap.data().reinfoResponse,
        meetup: snap.data().meetup,
        invi: snap.data().invi,
        inviWeek: snap.data().inviWeek,
        inviResponse: snap.data().inviResponse,
        plan: snap.data().plan,
        planWeek: snap.data().planWeek,
        planStatus: snap.data().planStatus,
        remarks: snap.data().remarks,
      });

      docArray.push(p);
    }

    // console.log(docArray);
    return docArray;
  }

}

const thunderboltm = new ThunderboltManager();

module.exports = thunderboltm;
