import {Platform} from 'react-native';

import Constants from '../constants/Constants';

export default class EventsDAO {
  constructor(){
    this.RNFS = require('react-native-fs');

    this.path = this.RNFS.DocumentDirectoryPath+"/events";
    console.log("path DAO",this.path);
  }

  _savePage(pageId){
    const filepath = this.path+"/offline/aux/page"+pageId+".json";
    const destPath = this.path+"/offline/page"+pageId+".json";

    var promise = this.RNFS.exists(destPath).then((exists) => {
      console.log("saving page "+pageId);
      if(exists){
        this.RNFS.unlink(destPath).then(() => {
          console.log("file deleted");
          this.RNFS.moveFile(filepath,destPath);
        })
      }
      else{
        this.RNFS.moveFile(filepath,destPath);
      }
    });

    return promise;
  }

  downloadThumbnails(pageData){
    var promise = new Promise((resolve, reject) => {
      var promises = [];
      for(i=0;i<pageData.results.length;i++){
        console.log("descarregant: ",pageData.results[i].picture.thumbnail);
        var singleProm = this.RNFS.downloadFile({
          fromUrl:pageData.results[i].picture.thumbnail,
          toFile:this.path+"/thumbnailEvent"+pageData.results[i].id+".jpg"
        });
        promises.push(singleProm.promise);
      }
      Promise.all(promises).then(() => resolve());
    });
    return promise;
  }

  getEventsData(pageId){
    const pagePath = this.path+"/offline/aux/page"+pageId+".json";
    const url = `https://pausabe.com/apps/CBCN/page${pageId}.json`;
    var promise = new Promise((resolve, reject) => {
      this.RNFS.mkdir(this.path+"/offline/aux",{NSURLIsExcludedFromBackupKey:true}).then(() => {
        this.RNFS.downloadFile({
          fromUrl:url,
          toFile:pagePath
        }).promise.then((res)=>{
          if(res.statusCode===200){
            this.RNFS.readFile(pagePath).then(fileData => {
              resolve(JSON.parse(fileData));
            });
          }
          else if(res.statusCode===404){
            resolve("no-page");
          }
        });
      });
    });
    return promise;
  }

  saveOfflineImage(itemId,imagePath){
    var totalProm = new Promise((resolve, reject) => {
      this.RNFS.mkdir(this.path+"/offline",{NSURLIsExcludedFromBackupKey:true}).then(() => {
        console.log("descarregant: ",imagePath);
        var downProm = this.RNFS.downloadFile({
          fromUrl:imagePath,
          toFile:this.path+"/offline/imageEvent"+itemId+".jpg"
        });
        downProm.promise.then(()=>resolve());
      });
    });
    return totalProm;
  }

  checkPage(pageData, pageId){
    var promise = new Promise((resolve, reject) => {
      if(pageId > Constants.offlinePages) resolve(false);
      else{
        var pagePath = this.path+"/offline/page"+pageId+".json";
        this.RNFS.exists(pagePath).then((exists) => {
          if(!exists){
            this._savePage(pageId).then(() => resolve(false));
          }
          else{
            this.RNFS.readFile(pagePath).then(fileData => {
              fileJSON = JSON.parse(fileData);
              if(JSON.stringify(fileJSON)!==JSON.stringify(pageData)){
                this._savePage(pageId).then(() => resolve(false));
              }
              else{
                resolve(true);
              }
            });
          }
        });
      }
    });
    return promise;
  }
}
