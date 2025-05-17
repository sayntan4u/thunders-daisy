const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require("fs");
var _ = require("lodash");
const credentials = require("../key.json");
const thunderboltm = require("./thunderboltmanager");


const thunders = initializeApp({
  credential: cert(credentials),
});


const db = getFirestore(thunders);



//helper function
function camelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

var weekArray = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

class DBManager {
  constructor() {
    this.statusJson = {
      procName: "",
      docName: "",
      status: "",
      week: "",
      year: "",
      progress: 0,
    };

    this.processedWeek = 0;
    this.isRename = false;
  }

  async getFields(group) {
    const fields = [];
    // const data = fs.readFileSync("./settings.conf", "utf8");
    const data = await this.getSettings();

    if (group == "SKB") {
      const SKB_table = JSON.parse(data).SKB_table;
      for (let i = 0; i < SKB_table.length; i++) {
        // addField(SKB_table[i].header);

        if (SKB_table[i].sub_heading.length > 0) {
          for (let j = 0; j < SKB_table[i].sub_heading.length; j++) {
            // addSubField(SKB_table[i].sub_heading[j], SKB_table[i].header);
            fields.push(
              camelize(
                (SKB_table[i].header + SKB_table[i].sub_heading[j]).toString()
              )
            );
          }
        } else {
          fields.push(camelize(SKB_table[i].header));
        }
      }
    } else if (group == "Sapphire") {
      const Sapphire_table = JSON.parse(data).Sapphire_table;
      for (let i = 0; i < Sapphire_table.length; i++) {
        // addField(SKB_table[i].header);

        if (Sapphire_table[i].sub_heading.length > 0) {
          for (let j = 0; j < Sapphire_table[i].sub_heading.length; j++) {
            // addSubField(SKB_table[i].sub_heading[j], SKB_table[i].header);
            fields.push(
              camelize(
                (
                  Sapphire_table[i].header + Sapphire_table[i].sub_heading[j]
                ).toString()
              )
            );
          }
        } else {
          fields.push(camelize(Sapphire_table[i].header));
        }
      }
    }

    return fields;
  }

  //View page
  async getCollectionData(group, year, week) {
    // console.log("getCollectionData called");

    var collection = "";

    if (group == "SKB") {
      collection = "users";
    } else {
      collection = "sapphire";
    }

    const snapshot = await db.collection(collection).listDocuments();

    const docArray = [];

    for (let i = 0; i < snapshot.length; i++) {
      const snap = await db
        .collection(collection)
        .doc(snapshot[i].id)
        .collection(year)
        .doc(week)
        .get();

      var dataRow = "{";
      dataRow += ' "sl" : "' + (i + 1) + '",';
      dataRow += ' "name" : "' + snapshot[i].id + '",';
      var fields = await this.getFields(group);
      fields.push("remarks");

      // console.log(fields);

      for (let i = 0; i < fields.length; i++) {
        dataRow += '"' + fields[i] + '" : "' + snap.data()[fields[i]] + '"';
        // dataRow.push(snap.data()[fields[i]]);
        if (i != fields.length - 1) {
          dataRow += ",";
        }
      }
      dataRow += "}";

      docArray.push(JSON.parse(dataRow));
    }

    // console.log(docArray);
    return docArray;
  }

  updateUser(name, week, year, fieldName, value, group) {
    var userJson = '{"' + fieldName + '" : ' + value + "}";
    if (fieldName == "remarks") {
      userJson = '{"' + fieldName + '" : "' + value + '"}';
    }
    // console.log(userJson);
    const obj = JSON.parse(userJson);
    // console.log(obj);

    if (group == "SKB") {
      db.collection("users").doc(name).collection(year).doc(week).update(obj);
    } else {
      db.collection("sapphire")
        .doc(name)
        .collection(year)
        .doc(week)
        .update(obj);
    }
  }

  updateTotalToSapphire(week, year, obj) {
    db.collection("sapphire")
      .doc("Sayantan")
      .collection(year)
      .doc(week)
      .update(obj);
  }

  //Agenda page

  async getAgendas(date) {
    const agendaArray = [];
    const snapshot = await db
      .collection("agenda")
      .doc(date)
      .collection("tasks")
      .listDocuments();
    for (let i = 0; i < snapshot.length; i++) {
      const snap = await db
        .collection("agenda")
        .doc(date)
        .collection("tasks")
        .doc(snapshot[i].id)
        .get();
      agendaArray.push({
        id: snapshot[i].id,
        task: snap.data().task,
        time: snap.data().time,
        isCompleted: snap.data().isCompleted,
      });
    }
    return agendaArray;
  }

  addAgenda(date, task, id) {
    const data = {
      task: task,
      time: "",
      isCompleted: false,
    };
    // console.log(data);
    db.collection("agenda")
      .doc(date)
      .collection("tasks")
      .doc(id.toString())
      .set(data);
  }

  updateAgenda(date, task = "", id, isCompleted = null, time = "") {
    if (task != "") {
      db.collection("agenda")
        .doc(date)
        .collection("tasks")
        .doc(id.toString())
        .update({ task: task });
    } else {
      db.collection("agenda")
        .doc(date)
        .collection("tasks")
        .doc(id.toString())
        .update({ time: time, isCompleted: isCompleted });
    }
  }

  deleteAgenda(date, id) {
    db.collection("agenda")
      .doc(date)
      .collection("tasks")
      .doc(id.toString())
      .delete();
  }

  //Add page
  async addUser(name, group) {
    const fields = await this.getFields(group);

    var test = "{";
    for (let i = 0; i < fields.length; i++) {
      test += '"' + fields[i] + '" : 0,';
    }
    test = test + ' "remarks" : "" }';

    // console.log(JSON.parse(test));

    if (group == "SKB") {
      const userJson = JSON.parse(test);

      const d = new Date();
      let year = d.getFullYear();
      // console.log(year + 1);

      for (let i = 1; i <= 53; i++) {
        await db
          .collection("users")
          .doc(name)
          .collection(year.toString())
          .doc(i.toString())
          .set(userJson);
        await db
          .collection("users")
          .doc(name)
          .collection((year + 1).toString())
          .doc(i.toString())
          .set(userJson);
      }
      await db.collection("users").doc(name).set({ namelist_link: "" });
    } else {
      const userJson = JSON.parse(test);

      const d = new Date();
      let year = d.getFullYear();

      for (let i = 1; i <= 53; i++) {
        await db
          .collection("sapphire")
          .doc(name)
          .collection(year.toString())
          .doc(i.toString())
          .set(userJson);
        await db
          .collection("sapphire")
          .doc(name)
          .collection((year + 1).toString())
          .doc(i.toString())
          .set(userJson);
      }
      // db.collection("sapphire").doc(name).set({namelist_link : ""});
    }

    return 1;
  }

  async getOnlyUserNames(group) {
    const docArray = [];
    var snapshot;

    if (group == "SKB") {
      snapshot = await db.collection("users").listDocuments();
    } else {
      snapshot = await db.collection("sapphire").listDocuments();
    }

    for (let i = 0; i < snapshot.length; i++) {
      docArray.push(snapshot[i].id);
    }

    return docArray;

  }

  async getUserNames() {
    const snapshot = await db.collection("users").listDocuments();
    const docArray = [];
    for (let i = 0; i < snapshot.length; i++) {
      const namelist_link = await db
        .collection("users")
        .doc(snapshot[i].id)
        .get();

      const thunderboltData = await thunderboltm.getUserDetails(namelist_link.data().namelist_link);

      docArray.push({
        name: snapshot[i].id,
        namelist: namelist_link.data().namelist_link,
        displayName : thunderboltData.displayName,
        avatarId : thunderboltData.avatarId,
        email : thunderboltData.email,
        nlCount : thunderboltData.nlCount
      });
    }
    return docArray;
  }

  async getUserNamesSapphire() {
    const snapshot = await db.collection("sapphire").listDocuments();
    const docArray = [];
    for (let i = 0; i < snapshot.length; i++) {
      docArray.push({ name: snapshot[i].id });
    }
    return docArray;
  }

  async isNameAlreadyExists(name, group){
    const names = await this.getOnlyUserNames(group) ;
    if(names.includes(name)){
      return true;
    }else{
      return false;
    }
  }

  async updateNamelist(name, link) {
    const namelistJson = { namelist_link: link };
    await db.collection("users").doc(name).update(namelistJson);
  }

  async delete(name, group) {
    if (group == "SKB") {
      await db.recursiveDelete(db.collection("users").doc(name));
    } else {
      await db.recursiveDelete(db.collection("sapphire").doc(name));
    }
  }

  //Analyze page

  async getAnalyzeData(year, weekFrom, weekTo, name, group) {
    const docArray = [];
    const idArray = [];

    if (group == "SKB") {
      const snapshot = await db
        .collection("users")
        .doc(name.toString())
        .collection(year.toString())
        .listDocuments();
      let sl = 1;

      for (let i = 1; i <= snapshot.length; i++) {
        if (
          parseInt(snapshot[i - 1].id) >= parseInt(weekFrom) &&
          parseInt(snapshot[i - 1].id) <= parseInt(weekTo)
        ) {
          idArray.push(parseInt(snapshot[i - 1].id));
        }
      }

      idArray.sort(function (a, b) {
        return a - b;
      });

      for (let j = 0; j < idArray.length; j++) {
        const snap = await db
          .collection("users")
          .doc(name.toString())
          .collection(year.toString())
          .doc(idArray[j].toString())
          .get();

        var dataRow = "{";
        dataRow += ' "sl" : "' + sl + '",';
        dataRow += ' "week" : "Week ' + parseInt(idArray[j]) + '",';
        var fields = await this.getFields(group);

        for (let i = 0; i < fields.length; i++) {
          dataRow += '"' + fields[i] + '" : "' + snap.data()[fields[i]] + '"';
          // dataRow.push(snap.data()[fields[i]]);
          if (i != fields.length - 1) {
            dataRow += ",";
          }
        }
        dataRow += "}";

        sl++;

        docArray.push(JSON.parse(dataRow));
      }
    } else {
      const snapshot = await db
        .collection("sapphire")
        .doc(name.toString())
        .collection(year.toString())
        .listDocuments();
      let sl = 1;

      for (let i = 1; i <= snapshot.length; i++) {
        if (
          parseInt(snapshot[i - 1].id) >= parseInt(weekFrom) &&
          parseInt(snapshot[i - 1].id) <= parseInt(weekTo)
        ) {
          idArray.push(parseInt(snapshot[i - 1].id));
        }
      }

      idArray.sort(function (a, b) {
        return a - b;
      });

      for (let j = 0; j < idArray.length; j++) {
        const snap = await db
          .collection("sapphire")
          .doc(name.toString())
          .collection(year.toString())
          .doc(idArray[j].toString())
          .get();

        var dataRow = "{";
        dataRow += ' "sl" : "' + sl + '",';
        dataRow += ' "week" : "Week ' + parseInt(idArray[j]) + '",';
        var fields = await this.getFields(group);

        for (let i = 0; i < fields.length; i++) {
          dataRow += '"' + fields[i] + '" : "' + snap.data()[fields[i]] + '"';
          // dataRow.push(snap.data()[fields[i]]);
          if (i != fields.length - 1) {
            dataRow += ",";
          }
        }
        dataRow += "}";

        sl++;

        docArray.push(JSON.parse(dataRow));
      }
    }

    // console.log(docArray);
    return docArray;
  }

  //Closings page
  async getClosings() {
    const snapshot = await db.collection("closings").listDocuments();

    const docArray = [];
    for (let i = 0; i < snapshot.length; i++) {
      const snap = await db.collection("closings").doc(snapshot[i].id).get();

      docArray.push({
        id: snapshot[i].id,
        irName: snap.data().irName,
        prosName: snap.data().prosName,
        uv: snap.data().uv,
        node: snap.data().node,
        status: snap.data().status,
      });
    }

    const sortArray = ['Purchase Done', '2nd Meeting Done', 'MIA', 'LA', 'LA2', 'AOS', 'CIP'];
    const sortedArray = [];

    for (let i = 0; i < sortArray.length; i++) {
      for (let j = 0; j < docArray.length; j++) {
        if (docArray[j].status == sortArray[i]) {
          sortedArray.push(docArray[j]);
        }
      }
    }

    return sortedArray;
  }

  async addClosing(data) {
    await db.collection("closings").doc().set(data);
  }

  async updateClosingStatus(id, status) {
    await db.collection("closings").doc(id).update({ status: status });
  }

  async updateClosingUV(id, uv) {
    await db.collection("closings").doc(id).update({ uv: uv });
  }

  async deleteClosing(id) {
    await db.recursiveDelete(db.collection("closings").doc(id));
  }

  //Settings page

  async renameField(newFieldName, oldFieldName, group, renameFieldCount) {
    var collection = "";

    if (group == "SKB") {
      collection = "users";
    } else {
      collection = "sapphire";
    }

    const d = new Date();
    let year = d.getFullYear();

    const snapshot = await db.collection(collection).listDocuments();

    this.statusJson.procName = "Rename";

    for (let i = 0; i < snapshot.length; i++) {
      this.statusJson.docName = snapshot[i].id;
      for (let j = 1; j <= 53; j++) {
        var snap = await db
          .collection(collection)
          .doc(snapshot[i].id)
          .collection(year.toString())
          .doc(j.toString())
          .get();

        var addDelField = new Map();
        var prevData = snap.data()[oldFieldName];
        addDelField.set(newFieldName, prevData);
        // addDelField.set(oldFieldName, admin.firestore.FieldValue.delete());

        var obj = Object.fromEntries(addDelField);
        await db
          .collection(collection)
          .doc(snapshot[i].id)
          .collection(year.toString())
          .doc(j.toString())
          .update(obj);

        snap = await db
          .collection(collection)
          .doc(snapshot[i].id)
          .collection((year + 1).toString())
          .doc(j.toString())
          .get();

        addDelField = new Map();
        prevData = snap.data()[oldFieldName];
        addDelField.set(newFieldName, prevData);
        // addDelField.set(oldFieldName, admin.firestore.FieldValue.delete());

        obj = Object.fromEntries(addDelField);
        await db
          .collection(collection)
          .doc(snapshot[i].id)
          .collection((year + 1).toString())
          .doc(j.toString())
          .update(obj);
        this.statusJson.status =
          "added field : " + newFieldName + " to Week " + j.toString();
        this.processedWeek++;
        if (this.isRename) {
          this.statusJson.progress =
            parseFloat(
              this.processedWeek /
              (snapshot.length * (renameFieldCount + 1) * 53)
            ) * 100;
        } else {
          this.statusJson.progress =
            parseFloat(this.processedWeek / (snapshot.length * 53)) * 100;
        }
      }
    }

    this.statusJson.status = "Rename done";
    // console.log("Renamed Fields !");
  }

  async updateFields(fieldObj, group, renameFieldCount) {
    var collection = "";
    if (group == "SKB") {
      collection = "users";
    } else {
      collection = "sapphire";
    }

    const d = new Date();
    let year = d.getFullYear();

    const snapshot = await db.collection(collection).listDocuments();

    this.statusJson.procName = "Update";
    for (let i = 0; i < snapshot.length; i++) {
      this.statusJson.docName = snapshot[i].id;
      for (let j = 1; j <= 53; j++) {
        await db
          .collection(collection)
          .doc(snapshot[i].id)
          .collection(year.toString())
          .doc(j.toString())
          .update(fieldObj);
        await db
          .collection(collection)
          .doc(snapshot[i].id)
          .collection((year + 1).toString())
          .doc(j.toString())
          .update(fieldObj);
        this.statusJson.status = `Updated week ${j.toString()}`;
        this.processedWeek++;
        if (this.isRename) {
          this.statusJson.progress =
            parseFloat(
              this.processedWeek /
              (snapshot.length * (renameFieldCount + 1) * 53)
            ) * 100;
        } else {
          this.statusJson.progress =
            parseFloat(this.processedWeek / (snapshot.length * 53)) * 100;
        }
      }
    }

    // console.log("Updated !");
    this.statusJson.status = "done";
  }

  async getFullCollectionData(group, field) {
    this.processedWeek = 0;
    this.statusJson.progress = 0;
    this.statusJson.status = "Reading data...";

    var collection = "";
    var dataArray = [];

    if (group == "SKB") {
      collection = "users";
    } else {
      collection = "sapphire";
    }

    if (field == "All") {
      const snapshot = await db.collection(collection).listDocuments();
      var totalWeek = snapshot.length * 53 * 2;

      for (let i = 0; i < snapshot.length; i++) {
        this.statusJson.docName = snapshot[i].id;
        const yearData = [];

        for (let year = 2025; year <= 2026; year++) {
          const weekArray = [];
          this.statusJson.year = year.toString();
          for (let week = 1; week <= 53; week++) {
            const snap = await db
              .collection(collection)
              .doc(snapshot[i].id)
              .collection(year.toString())
              .doc(week.toString())
              .get();

            weekArray.push({ week: week, data: snap.data() });

            this.statusJson.week = week.toString();
            this.processedWeek++;
            this.statusJson.progress =
              parseFloat(this.processedWeek / totalWeek) * 100;
            // console.log(statusJson.progress);
          }
          yearData.push({ year: year, data: weekArray });
        }
        if (group == "SKB") {
          const namelist_link_snap = await db
            .collection(collection)
            .doc(snapshot[i].id)
            .get();
          const namelist_link = namelist_link_snap.data().namelist_link;
          dataArray.push({
            name: snapshot[i].id,
            data: yearData,
            namelist_link: namelist_link,
          });
        } else {
          dataArray.push({ name: snapshot[i].id, data: yearData });
        }
      }
    } else {
      var totalWeek = 53 * 2;

      this.statusJson.docName = field;
      const yearData = [];

      for (let year = 2025; year <= 2026; year++) {
        const weekArray = [];
        this.statusJson.year = year.toString();
        for (let week = 1; week <= 53; week++) {
          const snap = await db
            .collection(collection)
            .doc(field)
            .collection(year.toString())
            .doc(week.toString())
            .get();

          weekArray.push({ week: week, data: snap.data() });

          this.statusJson.week = week.toString();
          this.processedWeek++;
          this.statusJson.progress =
            parseFloat(this.processedWeek / totalWeek) * 100;
          // console.log(statusJson.progress);
        }
        yearData.push({ year: year, data: weekArray });
      }
      if (group == "SKB") {
        const namelist_link_snap = await db
          .collection(collection)
          .doc(field)
          .get();
        const namelist_link = namelist_link_snap.data().namelist_link;
        dataArray.push({
          name: field,
          data: yearData,
          namelist_link: namelist_link,
        });
      } else {
        dataArray.push({ name: field, data: yearData });
      }
    }

    var retData = {
      collectionName: collection,
      data: dataArray,
    };

    return retData;
  }

  async uploadFullCollectionData(path) {
    this.processedWeek = 0;
    this.statusJson.progress = 0;
    this.statusJson.procName = "Import";
    this.statusJson.status = "Uploading...";

    const data = fs.readFileSync(path, "utf8");
    const importData = JSON.parse(data);

    var totalWeek = 0;

    if (importData.collectionName == "sapphire") {
      totalWeek = importData.data.length * 2 * 53;
    } else {
      totalWeek = importData.data.length * 2 * 53 + importData.data.length;
    }

    for (let i = 0; i < importData.data.length; i++) {
      const user = importData.data[i];
      this.statusJson.docName = user.name;

      for (let j = 0; j < user.data.length; j++) {
        const yearData = user.data[j];
        this.statusJson.year = yearData.year;

        for (let k = 0; k < yearData.data.length; k++) {
          const weekData = yearData.data[k];
          this.statusJson.week = weekData.week;

          await db
            .collection(importData.collectionName)
            .doc(user.name)
            .collection(yearData.year.toString())
            .doc(weekData.week.toString())
            .set(weekData.data);

          this.processedWeek++;
          this.statusJson.progress =
            parseFloat(this.processedWeek / totalWeek) * 100;
        }
      }
      if (importData.collectionName != "sapphire") {
        await db
          .collection(importData.collectionName)
          .doc(user.name)
          .set({ namelist_link: user.namelist_link });
        this.processedWeek++;
        this.statusJson.progress =
          parseFloat(this.processedWeek / totalWeek) * 100;
      }
    }

    fs.unlink(path, (err) => {
      if (err) console.log(err);
    });

    this.statusJson.status = "done";
  }

  async initSettings() {
    const snapshot = await db.collection("settings").listDocuments();
    if (snapshot.length == 0) {
      const config = {
        config: `
        {
  "initTableView": [
    {
      "header": "#",
      "sub_heading": []
    },
    {
      "header": "Name",
      "sub_heading": []
    }
  ],
  "initTableAnalyze": [
    {
      "header": "#",
      "sub_heading": []
    },
    {
      "header": "Week",
      "sub_heading": []
    }
  ],
  "endTable": {
    "header": "Remarks",
    "sub_heading": []
  },
  "SKB_table": [
    {
      "header": "List",
      "sub_heading": [],
      "isEdited": false,
      "isAdded": false,
      "prev": ""
    },
    {
      "header": "Networking",
      "sub_heading": [
        "Done",
        "Target"
      ],
      "isEdited": false,
      "isAdded": false,
      "prev": ""
    },
    {
      "header": "Infos",
      "sub_heading": [
        "Done",
        "Target"
      ],
      "isEdited": false,
      "isAdded": false,
      "prev": ""
    },
    {
      "header": "Reinfos",
      "sub_heading": [
        "Done",
        "Target"
      ],
      "isEdited": false,
      "isAdded": false,
      "prev": ""
    },
    {
      "header": "Meetups",
      "sub_heading": [
        "Done",
        "Target"
      ],
      "isEdited": false,
      "isAdded": false,
      "prev": ""
    },
    {
      "header": "Invis",
      "sub_heading": [
        "Done",
        "Target"
      ],
      "isEdited": false,
      "isAdded": false,
      "prev": ""
    },
    {
      "header": "Plans",
      "sub_heading": [],
      "isEdited": false,
      "prev": "",
      "isAdded": false
    },
    {
      "header": "Pending Plans",
      "sub_heading": [],
      "isEdited": false,
      "prev": "",
      "isAdded": false
    }
  ],
  "Sapphire_table": [
    {
      "header": "Node Count",
      "sub_heading": [],
      "isEdited": false,
      "isAdded": false,
      "prev": ""
    },
    {
      "header": "Networking",
      "sub_heading": [],
      "isEdited": false,
      "isAdded": false,
      "prev": ""
    },
    {
      "header": "Infos",
      "sub_heading": [],
      "isEdited": false,
      "isAdded": false,
      "prev": ""
    },
    {
      "header": "Reinfos",
      "sub_heading": [],
      "isEdited": false,
      "isAdded": false,
      "prev": ""
    },
    {
      "header": "Meetups",
      "sub_heading": [],
      "isEdited": false,
      "isAdded": false,
      "prev": ""
    },
    {
      "header": "Invis",
      "sub_heading": [],
      "isEdited": false,
      "isAdded": false,
      "prev": ""
    },
    {
      "header": "Plans",
      "sub_heading": [],
      "isEdited": false,
      "isAdded": false,
      "prev": ""
    },
    {
      "header": "Pending Plans",
      "sub_heading": [],
      "isEdited": false,
      "isAdded": false,
      "prev": ""
    },
    {
      "header": "Second Meetings",
      "sub_heading": [],
      "isEdited": false,
      "isAdded": false,
      "prev": ""
    },
    {
      "header": "UV",
      "sub_heading": [],
      "isEdited": false,
      "isAdded": false,
      "prev": ""
    }
  ],
  "totalViewSKBColSpan": 3,
  "totalViewSapphireColSpan": 2,
  "totalAnalyzeSKBColSpan": 3,
  "totalAnalyzeSapphireColSpan": 3,
  "connections": [
    {
      "startNode": "networkingDone",
      "endNode": "networking"
    },
    {
      "startNode": "infosDone",
      "endNode": "infos"
    },
    {
      "startNode": "reinfosDone",
      "endNode": "reinfos"
    },
    {
      "startNode": "meetupsDone",
      "endNode": "meetups"
    },
    {
      "startNode": "invisDone",
      "endNode": "invis"
    },
    {
      "startNode": "plans",
      "endNode": "plans"
    },
    {
      "startNode": "pendingPlans",
      "endNode": "pendingPlans"
    }
  ],
  "today": "Sat",
  "showProfit": true
}
        `};
      await db.collection("settings").doc("config").set(config);
    }
  }

  async getSettings() {
    // const data = fs.readFileSync("./settings.conf", "utf8");
    await this.initSettings();
    const data = await db.collection("settings").doc("config").get();
    // console.log(data.length);
    return data.data().config;
  }

  async saveSettings(config) {
    // const data = fs.readFileSync("./settings.conf", "utf8");
    const data = await this.getSettings();

    const settingsJson = JSON.parse(data);

    this.processedWeek = 0;
    this.statusJson.progress = 0;
    this.isRename = false;

    if (!_.isEqual(config, settingsJson)) {
      var addDelField = new Map();
      var renameFieldCount = 0;

      //Check new SKB Table ADD / Edit

      //Count edited fields
      for (let i = 0; i < config.SKB_table.length; i++) {
        if (config.SKB_table[i].isAdded) {
          //Newly added field
          //
        } else {
          if (config.SKB_table[i].isEdited) {
            //Edited field..change in DB
            renameFieldCount++;
          }
        }
      }
      // console.log(renameFieldCount);

      for (let i = 0; i < config.SKB_table.length; i++) {
        if (config.SKB_table[i].isAdded) {
          //Newly added field
          //
          // await addField(camelize(config.SKB_table[i].header), "SKB");
          if (config.SKB_table[i].sub_heading.length > 0) {
            for (let j = 0; j < config.SKB_table[i].sub_heading.length; j++) {
              // addSubField(SKB_table[i].sub_heading[j], SKB_table[i].header);
              addDelField.set(
                camelize(
                  (
                    config.SKB_table[i].header +
                    config.SKB_table[i].sub_heading[j]
                  ).toString()
                ),
                0
              );
              // config.SKB_table[i].isAdded = false;
            }
          } else {
            addDelField.set(camelize(config.SKB_table[i].header), 0);
          }
          config.SKB_table[i].isAdded = false;
        } else {
          if (config.SKB_table[i].isEdited) {
            //Edited field..change in DB
            this.isRename = true;

            if (config.SKB_table[i].sub_heading.length > 0) {
              for (let j = 0; j < config.SKB_table[i].sub_heading.length; j++) {
                // addSubField(SKB_table[i].sub_heading[j], SKB_table[i].header);
                await this.renameField(
                  camelize(
                    (
                      config.SKB_table[i].header +
                      config.SKB_table[i].sub_heading[j]
                    ).toString()
                  ),
                  camelize(
                    (
                      config.SKB_table[i].prev +
                      config.SKB_table[i].sub_heading[j]
                    ).toString()
                  ),
                  "SKB",
                  renameFieldCount
                );
              }
            } else {
              await this.renameField(
                camelize(config.SKB_table[i].header),
                camelize(config.SKB_table[i].prev),
                "SKB",
                renameFieldCount
              );
            }

            config.SKB_table[i].prev = "";
            config.SKB_table[i].isEdited = false;
          }
        }
      }

      //Check for Delete
      for (let i = 0; i < settingsJson.SKB_table.length; i++) {
        var notFound = true;

        for (let j = 0; j < config.SKB_table.length; j++) {
          if (settingsJson.SKB_table[i].header == config.SKB_table[j].header) {
            notFound = false;
            break;
          }
        }
        if (notFound) {
          //Add delete field
          if (settingsJson.SKB_table[i].sub_heading.length > 0) {
            for (
              let j = 0;
              j < settingsJson.SKB_table[i].sub_heading.length;
              j++
            ) {
              // addSubField(SKB_table[i].sub_heading[j], SKB_table[i].header);
              addDelField.set(
                camelize(
                  (
                    settingsJson.SKB_table[i].header +
                    settingsJson.SKB_table[i].sub_heading[j]
                  ).toString()
                ),
                admin.firestore.FieldValue.delete()
              );
            }
          } else {
            addDelField.set(
              camelize(settingsJson.SKB_table[i].header),
              admin.firestore.FieldValue.delete()
            );
          }
        }
      }

      if (addDelField.size > 0) {
        const obj = Object.fromEntries(addDelField);
        await this.updateFields(obj, "SKB", renameFieldCount);
      }

      //Check new Sapphire Table ADD / Edit

      this.isRename = false;
      renameFieldCount = 0;
      addDelField = new Map();

      //Count edited fields
      for (let i = 0; i < config.Sapphire_table.length; i++) {
        if (config.Sapphire_table[i].isAdded) {
          //Newly added field
          //
        } else {
          if (config.Sapphire_table[i].isEdited) {
            //Edited field..change in DB
            renameFieldCount++;
          }
        }
      }
      // console.log(renameFieldCount);

      for (let i = 0; i < config.Sapphire_table.length; i++) {
        if (config.Sapphire_table[i].isAdded) {
          //Newly added field
          //
          // await addField(camelize(config.SKB_table[i].header), "SKB");
          if (config.Sapphire_table[i].sub_heading.length > 0) {
            for (
              let j = 0;
              j < config.Sapphire_table[i].sub_heading.length;
              j++
            ) {
              // addSubField(SKB_table[i].sub_heading[j], SKB_table[i].header);
              addDelField.set(
                camelize(
                  (
                    config.Sapphire_table[i].header +
                    config.Sapphire_table[i].sub_heading[j]
                  ).toString()
                ),
                0
              );
              // config.SKB_table[i].isAdded = false;
            }
          } else {
            addDelField.set(camelize(config.Sapphire_table[i].header), 0);
          }
          config.Sapphire_table[i].isAdded = false;
        } else {
          if (config.Sapphire_table[i].isEdited) {
            //Edited field..change in DB
            this.isRename = true;

            if (config.Sapphire_table[i].sub_heading.length > 0) {
              for (
                let j = 0;
                j < config.Sapphire_table[i].sub_heading.length;
                j++
              ) {
                // addSubField(SKB_table[i].sub_heading[j], SKB_table[i].header);
                await this.renameField(
                  camelize(
                    (
                      config.Sapphire_table[i].header +
                      config.Sapphire_table[i].sub_heading[j]
                    ).toString()
                  ),
                  camelize(
                    (
                      config.Sapphire_table[i].prev +
                      config.Sapphire_table[i].sub_heading[j]
                    ).toString()
                  ),
                  "Sapphire",
                  renameFieldCount
                );
              }
            } else {
              await this.renameField(
                camelize(config.Sapphire_table[i].header),
                camelize(config.Sapphire_table[i].prev),
                "Sapphire",
                renameFieldCount
              );
            }

            config.Sapphire_table[i].prev = "";
            config.Sapphire_table[i].isEdited = false;
          }
        }
      }

      //Check for Delete
      for (let i = 0; i < settingsJson.Sapphire_table.length; i++) {
        var notFound = true;

        for (let j = 0; j < config.Sapphire_table.length; j++) {
          if (
            settingsJson.Sapphire_table[i].header ==
            config.Sapphire_table[j].header
          ) {
            notFound = false;
            break;
          }
        }
        if (notFound) {
          //Add delete field
          if (settingsJson.Sapphire_table[i].sub_heading.length > 0) {
            for (
              let j = 0;
              j < settingsJson.Sapphire_table[i].sub_heading.length;
              j++
            ) {
              // addSubField(SKB_table[i].sub_heading[j], SKB_table[i].header);
              addDelField.set(
                camelize(
                  (
                    settingsJson.Sapphire_table[i].header +
                    settingsJson.Sapphire_table[i].sub_heading[j]
                  ).toString()
                ),
                admin.firestore.FieldValue.delete()
              );
            }
          } else {
            addDelField.set(
              camelize(settingsJson.Sapphire_table[i].header),
              admin.firestore.FieldValue.delete()
            );
          }
        }
      }

      if (addDelField.size > 0) {
        const obj = Object.fromEntries(addDelField);
        await this.updateFields(obj, "Sapphire", renameFieldCount);
      }
    }

    // try {
    //   fs.writeFile(
    //     "./settings.conf",
    //     JSON.stringify(config, null, 2),
    //     function (err) {
    //       if (err) throw err;
    //       // console.log('Saved!');
    //       // console.log("Saved");
    //     }
    //   );
    // } catch (err) {
    //   console.log(err);
    // }
    await db.collection("settings").doc("config").update({ config: JSON.stringify(config, null, 2) });
  }


  async updateShowProfit(config) {
    // try {
    //   fs.writeFile(
    //     "./settings.conf",
    //     JSON.stringify(config, null, 2),
    //     function (err) {
    //       if (err) throw err;
    //       // console.log('Saved!');
    //       // console.log("Saved");
    //     }
    //   );
    // } catch (err) {
    //   console.log(err);
    // }
    await db.collection("settings").doc("config").update({ config: JSON.stringify(config, null, 2) });
  }


  //Roster

  async initRoster() {
    const snapshot = await db.collection("roster").listDocuments();
    if (snapshot.length == 0) {
      for (let i = 0; i < weekArray.length; i++) {
        await db
          .collection("roster")
          .doc(weekArray[i])
          .set({
            "11AM": "/-select-",
            "1PM": "/-select-",
            "3PM": "/-select-",
            "5PM": "/-select-",
            "7PM": "/-select-",
          });
      }
    } else {
    }
  }

  getWeekArray() {
    //get today
    const d = new Date();
    const today = d.getDay();
    const dayArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // console.log(dayArray[today]);

    var index = 0;

    for (let i = 0; i < weekArray.length; i++) {
      if (weekArray[i] == dayArray[today]) {
        index = i;
        break;
      }
    }
    const arr1 = weekArray.slice(index);
    const arr2 = weekArray.slice(0, index);

    // console.log(arr1);
    // console.log(arr2);

    const arr3 = arr1.concat(arr2);

    return arr3;
  }

  sortRosterData(docArray) {
    const finalWeekArray = this.getWeekArray();
    const sortedArray = [];
    for (let i = 0; i < finalWeekArray.length; i++) {
      for (let j = 0; j < docArray.length; j++) {
        if (docArray[j].day == finalWeekArray[i]) {
          sortedArray.push(docArray[j]);
        }
      }
    }
    return sortedArray;
  }

  async checkDateChange() {
    // const data = fs.readFileSync("./settings.conf", "utf8");
    const data = await this.getSettings();
    const settingsJson = JSON.parse(data);
    const d = new Date();
    const today = d.getDay();
    const dayArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    if (settingsJson.today == "") {
      settingsJson.today = dayArray[today];
      // try {
      //   fs.writeFile(
      //     "./settings.conf",
      //     JSON.stringify(settingsJson, null, 2),
      //     function (err) {
      //       if (err) throw err;
      //     }
      //   );
      // } catch (err) {
      //   console.log(err);
      // }
      await db.collection("settings").doc("config").update({ config: JSON.stringify(settingsJson, null, 2) });
    } else {
      if (settingsJson.today != dayArray[today]) {
        const yesterday = settingsJson.today;
        settingsJson.today = dayArray[today];
        // try {
        //   fs.writeFile(
        //     "./settings.conf",
        //     JSON.stringify(settingsJson, null, 2),
        //     function (err) {
        //       if (err) throw err;
        //     }
        //   );
        // } catch (err) {
        //   console.log(err);
        // }
        await db.collection("settings").doc("config").update({ config: JSON.stringify(settingsJson, null, 2) });
        //clear roster for yesterday code goes here
        await this.clearRoster(yesterday);
      }
    }
    // console.log(settingsJson.today);
  }

  async getRosterData() {
    //Check if roster is initialized
    await this.initRoster();
    //check if date change happened for automatic roster clearance of yesterday
    await this.checkDateChange();

    //fetch roster data
    const snapshot = await db.collection("roster").listDocuments();
    const docArray = [];

    for (let i = 0; i < snapshot.length; i++) {
      const snap = await db.collection("roster").doc(snapshot[i].id).get();
      docArray.push({ day: snapshot[i].id, data: snap.data() });
    }
    return this.sortRosterData(docArray);
  }

  updateRoster(day, time, irName) {
    const obj = {};
    obj[time] = irName;
    db.collection("roster").doc(day).update(obj);
  }

  async clearRoster(day) {
    db.collection("roster")
      .doc(day)
      .set({ "11AM": "/-select-", "1PM": "/-select-", "3PM": "/-select-", "5PM": "/-select-", "7PM": "/-select-" });
  }
}

const dbm = new DBManager();

module.exports = dbm;
