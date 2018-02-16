import {Platform} from 'react-native';

export default class EventsDAO {
  constructor(){
    this.RNFS = require('react-native-fs');

    this.path = this.RNFS.DocumentDirectoryPath+"/events";
    console.log("path DAO",this.path);
  }

  _makeEventsDir(res){
    var promise = new Promise((resolve, reject) => {
      this.RNFS.mkdir(this.path,{NSURLIsExcludedFromBackupKey:true}).then(() => resolve(res));
    });
    return promise;
  }

  _downloadThumbnails(res){
    console.log("now thumbns");
    var promise = new Promise((resolve, reject) => {
      var promises = [];
      for(i=0;i<res.results.length;i++){
        console.log("descarregant: ",res.results[i].picture.thumbnail);
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
    const url = `https://pausabe.com/apps/CBCN/page${page}.json`;
    var promise = fetch(url, {headers: {'Cache-Control': 'no-cache'}})
     .then(res => res.json())
      .then(res => this._makeEventsDir(res))
       .then(res => this._downloadThumbnails(res))
     .catch(error => {
      throw new Error(error);
    });
    console.log("fetch promise",promise);
    return promise;
  }

  saveOfflineImage(itemId,imagePath){
    //fix this!
    var totalPromise = new Promise((resolve, reject) => {
      this.RNFS.mkdir(this.path+"/offline",{NSURLIsExcludedFromBackupKey:true}).then(() => {
        console.log("directory created");
        console.log("descarregant: ",imagePath);
        var downPromise = new Promise((resolve, reject) => {
          this.RNFS.downloadFile({
            fromUrl:imagePath,
            toFile:this.path+"/offline/imageEvent"+itemId+".jpg"
          }).then(()=>resolve());
        return downPromise;
        });
      });
    });
    console.log("save offline image promise",totalPromise);
    return totalPromise;
  }
}
