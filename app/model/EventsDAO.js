import {Platform} from 'react-native';

import Constants from '../constants/Constants';

export default class EventsDAO {
  constructor(){
    this.RNFS = require('react-native-fs');

    this.path = this.RNFS.DocumentDirectoryPath+"/events";
    console.log("path DAO",this.path);
  }

  _savePage(pageId){
    const filepath = this.path+"/local/aux/page"+pageId+".json";
    const destPath = this.path+"/local/page"+pageId+".json";

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
    var promises = [];
    for(i=0;i<pageData.results.length;i++){
      console.log("descarregant thumb ("+pageData.results[i].id+"): ",pageData.results[i].picture.thumbnail);
      var singleProm = this.RNFS.downloadFile({
        fromUrl:pageData.results[i].picture.thumbnail,
        toFile:this.path+"/thumbnailEvent"+pageData.results[i].id+".jpg"
      });
      promises.push(singleProm.promise);
    }
    return Promise.all(promises)
    .then(() => {
      return pageData;
    });
  }

  getEventsData(pageId,internet){
    var pagePath = this.path+"/local/aux/page"+pageId+".json";
    var pagePathSaved = this.path+"/local/page"+pageId+".json";
    const url = `https://pausabe.com/apps/CBCN/page${pageId}.json`;

    if(internet){
      return this.RNFS.mkdir(this.path+"/local/aux",{NSURLIsExcludedFromBackupKey:true})
      .then(() => {
          return this.RNFS.downloadFile({
            fromUrl:url,
            toFile:pagePath
          }).promise;
        })
      .then((res)=>{
        if(res.statusCode===200){
          return this.RNFS.readFile(pagePath);
        }
        else{
          throw 'no-page';
        }
      })
      .then(fileData => {
        var eventsData = JSON.parse(fileData);
        return this._checkPage(eventsData,pageId);
      })
      .then(checkRes => {
        console.log("checkRes",checkRes);
        if(checkRes.local){
          return checkRes.eventsData;
        }
        else{
          return this.downloadThumbnails(checkRes.eventsData);
        }
      })
      .then((eventsData)=>{
        return eventsData;
      });
    }
    else if(pageId <= Constants.localPages){
      console.log("handling no internet but maybe local data");
      return this.RNFS.exists(pagePathSaved)
      .then((exists)=>{
        if(exists) return this.RNFS.readFile(pagePathSaved);
        else return false;
      })
      .then((fileData) => {
        if(fileData) return JSON.parse(fileData);
        return false;
      });
    }
  }

  saveLocalImage(itemId,imagePath){
    var imageDestPath = this.path+"/local/imageEvent"+itemId+".jpg";

    return this.RNFS.exists(imageDestPath)
    .then((exists)=>{
      if(!exists){
        return this.RNFS.mkdir(this.path+"/local",{NSURLIsExcludedFromBackupKey:true});
      }
    })
    .then(() => {
      console.log("descarregant real ("+itemId+"): ",imagePath);
      return this.RNFS.downloadFile({
        fromUrl:imagePath,
        toFile: imageDestPath
      }).promise;
    })
    .then(() => {
      return false;
    });
  }

  _checkPage(pageData, pageId){
    if(pageId > Constants.localPages) return {local:false,eventsData:pageData};
    else{
      var pagePath = this.path+"/local/page"+pageId+".json";
      return this.RNFS.exists(pagePath)
      .then((exists) => {
        auxExists = exists;
        if(!exists){
          return this._savePage(pageId);
        }
        else{
          return this.RNFS.readFile(pagePath);
        }
      })
      .then((fileData) => {
        if(auxExists){
          fileJSON = JSON.parse(fileData);
          if(JSON.stringify(fileJSON)!==JSON.stringify(pageData)){
            return this._savePage(pageId)
          }
          else{
            return {local:true,eventsData:pageData};
          }
        }
        else{
          return {local:false,eventsData:pageData};
        }
      })
      .then((res) => {
        if(res) return {local:res.local,eventsData:res.eventsData};
        return {local:false,eventsData:pageData};
      });
    }
  }

  checkRealImage(imageId){
    var imagePath = this.path+"/local/imageEvent"+imageId+".jpg";
    return this.RNFS.exists(imagePath);
  }
}
