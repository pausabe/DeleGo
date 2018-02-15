import {Platform} from 'react-native';

export default class EventsDAO {
  constructor(){
    this.RNFS = require('react-native-fs');

    this.path = this.RNFS.DocumentDirectoryPath;
    if(Platform.OS === 'ios')
      this.path = this.RNFS.MainBundlePath;
    this.path += "/events";

    console.log("path DAO",this.path);
  }

  makeEventsDir(res){
    var promise = new Promise((resolve, reject) => {
      this.RNFS.mkdir(this.path,{NSURLIsExcludedFromBackupKey:true}).then(() => resolve(res));
    });
    return promise;
  }

  downloadThumbnails(res){
    console.log("now thumbns");
    var promise = new Promise((resolve, reject) => {
      var promises = [];
      for(i=0;i<res.results.length;i++){
        console.log("descarregant: ",res.results[i].picture.thumbnail);
        /*var singleProm = new Promise((resolve, reject) => {
          setTimeout(() => {
            console.log("nova promise");
            resolve();
          }, 3000);
        });*/
        var singleProm = this.RNFS.downloadFile({
          fromUrl:res.results[i].picture.thumbnail,
          toFile:this.path+"/thumbnailEvent"+res.results[i].id+".jpg"
        });
        promises.push(singleProm.promise);
      }

      Promise.all(promises).then(() => {
        // console.log("then de promises all");
        // var pathtest = this.path+"/thumbnailEvent1.jpg";
        // this.RNFS.exists(pathtest).then(res=>console.log("Exists "+pathtest+"? "+res));
        resolve(res);
      });
    });
    return promise;
  }

  getEventsData(page){
    var online = true; //hardcoded

    if(online){
      const url = `https://pausabe.com/apps/CBCN/page${page}.json`;
      var promise = fetch(url, {headers: {'Cache-Control': 'no-cache'}})
       .then(res => res.json())
        .then(res => this.makeEventsDir(res))
         .then(res => this.downloadThumbnails(res))
       .catch(error => {
        throw new Error(error);
      });
      console.log("fetch promise",promise);
      return promise;
    }
    else{
      var path = this.path+`/app/local-data/page${page}.json`;
      console.log("path",path);
      var promise = this.RNFS.readFile(path, 'utf8')
        .then(res => {
          console.log("res:",res);
          return res;
        })
        .catch(error => {
         throw new Error(error);
       });
      return promise;
    }
  }
}
