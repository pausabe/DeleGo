import {Platform} from 'react-native';

import Constants from '../utils/Constants';

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

  downloadThumbnails(pageData,localData){
    var promises = [];
    for(i=0;i<pageData.length;i++){
      //console.log("descarregant thumb ("+pageData[i].id+"): ",pageData[i].image.url_thumbnail);
      var singleProm = this.RNFS.downloadFile({
        fromUrl: "https://pausabe.com/apps/CBCN/images/prova1LQ.jpg",//pageData[i].image.url_thumbnail,
        toFile: this.path+"/thumbnailEvent"+pageData[i].id+".jpg"
      });
      promises.push(singleProm.promise);
    }
    return Promise.all(promises)
    .then((res) => {
      console.log("thumb results", res);
      return pageData;
    })
    .catch((error) => {
      this._throwError('time-out',localData);
    });
  }

  getEventsData(pageId,internet){
    var pagePath = this.path+"/local/aux/page"+pageId+".json";
    var pagePathSaved = this.path+"/local/page"+pageId+".json";

    const url = `http://${Constants.local_ip}:81/api/event?page=${pageId}&qnt=${Constants.events_per_page}`;

    console.log("url to get events data: " + url);

    return this.RNFS.exists(pagePathSaved)
    .then((exists)=>{
      if(exists) return this.RNFS.readFile(pagePathSaved);
      else return false;
    })
    .then((fileData) => {
      var localData = null;
      if(fileData) localData = JSON.parse(fileData);

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
        .catch((error) => {
          if(error === 'no-page') this._throwError('no-page');
          else this._throwError('time-out',localData);
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
            return this.downloadThumbnails(checkRes.eventsData,localData);
          }
        })
        .then((eventsData)=>{
          var newIds = [];
          for(i=0;i<eventsData.length;i++){
            newIds.push(parseInt(eventsData[i].id));
          }
          var falseReturn = {};
          for(i=0;i<newIds.length;i++){
            falseReturn[newIds[i]] = false;
          }
          if(pageId > Constants.localPages) {
            return {eventsData: eventsData, realImageSaved: falseReturn};
          }
          else {
            return this._realImagesExist(newIds,this.path+"/local/images/")
            .then((realExists) => {
              if(realExists){
                console.log("realExists",realExists);
                if(realExists.deleteIds.length > 0){
                  return this._deleteImages(realExists.deleteIds)
                  .then(() => {
                    return {eventsData: eventsData, realImageSaved: realExists.bools};
                  });
                }
                else{
                  return {eventsData: eventsData, realImageSaved: realExists.bools};
                }
              }
              else{
                //images folder doesnt exists
                return {eventsData: eventsData, realImageSaved: falseReturn};
              }
            });
          }
        });
      }
      else if(pageId <= Constants.localPages){
        console.log("handling no internet but maybe local data");

        var newIds = [];
        for(i=0;i<localData.length;i++){
          newIds.push(parseInt(localData[i].id));
        }
        var trueReturn = {};
        for(i=0;i<newIds.length;i++){
          trueReturn[newIds[i]] = true;
        }
        if(fileData) return {eventsData: localData, realImageSaved: trueReturn};
        return false;
      }
      else{
        //crec que mai hauria d'estar aquí
        return {eventsData: null, realImageSaved: false};
      }
    });
  }

  _throwError(errCode,localData){
    console.log("oooh, error!");
    throw {errCode: errCode, localData: localData};
  }

  _deleteImages(imageIds){
    console.log("imageIds",imageIds);
    var promises = [];
    for(i=0;i<imageIds.length;i++){
      var auxImagePath = this.path+"/local/images/image-"+imageIds[i]+".jpg";
      console.log("should delte:",imageIds[i]);
      promises.push(this.RNFS.unlink(auxImagePath));
    }
    // console.log("promises",promises);
    return Promise.all(promises);
  }

  _realImagesExist(newIds, folderPath){
    return this.RNFS.exists(folderPath)
    .then((folderExists) => {
      if(folderExists) return this.RNFS.readdir(folderPath);
      return false;
    })
    .then((res)=>{
      if(res){
        var oldIds = [];
        for(i=0;i<res.length;i++){
          var auxId = parseInt(res[i].split("-")[1].split(".")[0]);
          oldIds.push(auxId);
        }
        var distinctIds = [];
        var oldContainsNew = {};
        for(i=0;i<oldIds.length;i++){
          if(!newIds.includes(oldIds[i])) {
            distinctIds.push(oldIds[i]);
            oldContainsNew[oldIds[i]] = false;
          }
          else{
            oldContainsNew[oldIds[i]] = true;
          }
        }
        console.log("distinctIds",distinctIds);
        console.log("oldContainsNew",oldContainsNew);
        return {bools:oldContainsNew,deleteIds:distinctIds};
      }
      return false;
    });
  }

  saveLocalImage(itemId,imagePath/*,flatIndex*/){
    // var imageDestPath = this.path+"/local/images/"+flatIndex+"-image-"+itemId+".jpg";
    var imageDestPath = this.path+"/local/images/image-"+itemId+".jpg";

    console.log("image destine: " + imageDestPath);

    return this.RNFS.mkdir(this.path+"/local/images",{NSURLIsExcludedFromBackupKey:true})
    /*.then(() => {
      return this._fileExistsInFolder("image-"+itemId+".jpg",this.path+"/local/images/",flatIndex);
    })*/
    .then((/*exists*/) => {
      /*console.log("exists",exists);
      if(!exists.bool){*/
        console.log("descarregant real ("+itemId+"): ",imagePath);
        /*if(exists.deleteId !== -1){
          this.RNFS.unlink(this.path+"/local/images/"+flatIndex+"-image-"+exists.deleteId+".jpg");
        }*/
        return this.RNFS.downloadFile({
          fromUrl: imagePath,
          toFile: imageDestPath
        }).promise;
      // }
    });
  }

  /*checkRealImage(imageId,flatIndex){
    var imagesFolderPath = this.path+"/local/images/";
    var imageFuturePath = imagesFolderPath+flatIndex+"-image-"+imageId+".jpg";
    return this.RNFS.exists(imagesFolderPath) //existeix la carpeta d'imatges?
    .then(dirExists => {
      if(dirExists){
        return this.RNFS.exists(imageFuturePath) //existeix la image coincidint index i id?
        .then((imageExists) => {
          if(!imageExists) return this._fileExistsInFolder("image-"+imageId+".jpg", imagesFolderPath,flatIndex); //existeix la imatge amb un index diferent?
          return {index: flatIndex, bool: true};
        })
      }
      return {index: null, bool: false};
    })
    .then((imageExists) => {
      console.log("imageExists",imageExists);
      if(imageExists.bool && imageExists.index !== flatIndex){
        var imageActualPath = imagesFolderPath+imageExists.index+"-image-"+imageId+".jpg";
        console.log("image exists but with diferent index: ",imageActualPath);
        return this.RNFS.copyFile(imageActualPath,imageFuturePath)
        .then(() => {
          var deleteImage = imagesFolderPath+flatIndex+"-image-"+imageId+".jpg";
          console.log("eliminant:"+deleteImage);
          this.RNFS.unlink(deleteImage);
          return true;
        })
      }
      return imageExists.bool;
    })
  }*/

  /*_fileExistsInFolder(fileName,folderPath,flatIndex){
    return this.RNFS.readdir(folderPath)
    .then((res)=>{
      var exists=false;
      var deleteId = -1;
      for(i=0;i<res.length && !exists;i++){
        var auxFileName = res[i].split("-")[1] + ".jpg";
        var auxIndex = parseInt(res[i].split("-")[0]);
        var auxId = parseInt(res[i].split("-")[2].split(".")[0]);
        console.log("flatIndex",flatIndex);
        console.log("auxIndex",auxIndex);
        console.log("auxId",auxId);
        if(flatIndex === auxIndex) deleteId = auxId;
        if(auxFileName === fileName) return {index: auxIndex, bool: true};
      }
      return {index: deleteId, bool: false, deleteId: deleteId};
    });
  }*/

}
