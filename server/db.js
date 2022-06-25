const mongodb = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

require("dotenv").config();
// https://stackoverflow.com/questions/11330917/how-to-play-a-mp3-using-javascript
class Db {
    constructor() {
        this.userdb;
    }
    async connectDB() {
      const client = await mongodb.MongoClient.connect(
        process.env.DB_CONNECT_STRING,
        {
          useNewUrlParser: true
        }
      );
    console.log("db is loaded");
    this.userdb = client.db('Timeline').collection("Users");
    return("yes")
    }

    //user security functions
    async registerUser(email, username, password) { 
      console.log(this.userdb.find({username: username}).count());
      let emailTaken = await this.userdb.find({email: email}).count() > 0;
      let usernameTaken = await this.userdb.find({username: username}).count() > 0;

      if(usernameTaken) { //username taken
        console.log("username taken");
        return(0);
      }
      else if (emailTaken) { //email taken
        console.log("email taken");
        return(1);
      }
      else { //register user ie insert to db
        let userStudyData = {wordsKnown: 0, questionData:[], subsData:[]}
        let settingData = {newPerDay: 5, srsLevels: [4, 8, 24, 48, 120, 336, 1080]};
        let userId = (await this.userdb.insertOne({username: username, email: email, password: password, studyData: userStudyData, settings: settingData})).insertedId;
        console.log("user id")
        console.log(userId.toString());
        return(userId);
      }
    }

    async getHashedPass(email, password) {
      console.log("logging in..");
      let user = await this.findUserByEmail(email);
      if(user.password) {
        return(user.password);
      }
      else {
        return(false);
      }
    }

    async getProfile(id) { //return the user's settings
      let user = await this.findUserById(id);
      console.log(user.settings);
      let returnData= {username: user.username, settings: user.settings};
      return(returnData);
    }

    async updateProfile(id, newSettings) { //change user settings
      let mId = ObjectId(id); //convert to mongo id
      let nwpd = parseInt(newSettings.newWordsPerDay);
      let newSrs = (newSettings.srsLevels.split(',')).map(Number).filter(num => !Number.isNaN(num)); // change to number and remove any NaN
      
      let settings = {newPerDay: nwpd, srsLevels: newSrs};
      if(Number.isNaN(nwpd) || newSrs.length<1) { //verify it's valid entries
        console.log("Bad settings input");
        return(false); //failed
      }
      else { //update
        this.userdb.updateOne( 
          { "_id": mId},
          { "$set": 
            {"settings": settings}
          }
        );   
        return(true); //success, "settings.srsLevels": newSrs}
      }
    }

    //helper functions
    async findUserByEmail(email) {
      return(this.userdb.findOne({email: email}))
    }
    
    async findUserById(id) {
      return(this.userdb.findOne(ObjectId(id)));
    }
} 

module.exports = Db;