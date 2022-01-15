/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import './game-item.js';
import { ElectronMixin } from './mixins/electron-mixin.js';
import '@polymer/iron-icons/iron-icons';
import '@polymer/paper-fab/paper-fab';
class GameList extends ElectronMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
        [bordered]{
          border: 6px dashed var(--paper-grey-400);
        }
      </style>

        <div style="min-height: calc(100vh - 200px);" bordered$="[[!ndsFiles.length]]" id="dropZone">

        <template is="dom-if" if="[[!ndsFiles.length]]">
          <div style="display: flex; align-items: center; justify-content: center; padding: 24px; min-height: calc(100vh - 200px - 48px);">
          <div style="text-align: center;">
            <div style="font-size: 24px; color: var(--paper-grey-500); font-weight: 600;">You haven't added any file yet. </div>
          
             <div style="font-size: 15px; color: var(--paper-grey-500);"> Drag and drop them here or click on the folder icon button in the top right corner.</div>
        
        </div>
          </div>
        </template>

      
      
<template is="dom-repeat" items="[[ndsFiles]]" as="nds" restamp>
<game-item data="[[nds]]" on-delete-clicked="removeGame"></game-item>
</template>



        <template is="dom-if" if="[[ndsFiles.length]]">
      <div style="position: sticky; bottom: 24px; right: 24px; display: flex; align-items: center; justify-content: flex-end;">
      <paper-fab on-click="downloadAllTemplates" disabled$="[[saving]]" icon="file-download" ></paper-fab>

      </div>
      </template>
      </div>
    `;
  }




  removeGame(e){
    var ndsFile=e.detail.ndsFile;
    this.splice("ndsFiles",this.ndsFiles.indexOf(ndsFile),1);
    MiscUtils.Toast.show("File removed successfully");
  }
  pushFiles(files){
    if(!this.ndsFiles){
      this.set("ndsFiles",[]);
    }
    for(var i=0;i<files.length;i++){
//      var ndsFile=new NDSFile(files[i],function());
      this.push("ndsFiles",{file:files[i]});
    }
  }
  _getCurrentPath(){
    const { remote } = require ('electron');
    if(this.directoryPath!=null && this.directoryPath.trim()!=""){
      return this.directoryPath.trim();
    }
var camino=remote.process.env.PORTABLE_EXECUTABLE_DIR;
if(!camino){
  camino=".";
}
return camino;


  }


  
 
  callPythonGenerator(template){
    
    var context=this;
    var ndsFile=template.lastNdsFile;
    console.log("NDS FILE",ndsFile);


    const spawn = require("child_process").spawn;
    
    
    
    var camino=ndsFile.file.path;

    var outputName="YANBF-"+ndsFile.file.name.substring(0,ndsFile.file.name.length-4).replace(/ /g, '_')+".cia";
    var outputLog ="YANBF-"+ndsFile.file.name.substring(0,ndsFile.file.name.length-4).replace(/ /g, '_')+".log";
    console.log("Output name",outputName);

    var selectedPython=this.selectedPython;
    if(selectedPython==null || selectedPython==""){
      MiscUtils.Toast.show("You didn't set a Python3 location or command");
      return;
    }
    var arrayArgs=[];
    var splittedPython=selectedPython.split(" ");
    for(var i=0;i<splittedPython.length;i++){
      var item=splittedPython[i];
      if(item!=null && item!="" && i>0){
        arrayArgs.push(item);
      }
    }

    arrayArgs.push(context._getCurrentPath()+"/generator.py");
    arrayArgs.push(camino);
    arrayArgs.push("-o");
    arrayArgs.push(context._getCurrentPath()+"/output/"+outputName);

    if(ndsFile.boxArtFile!=null){
      arrayArgs.push("-b");
     arrayArgs.push(ndsFile.boxArtFile.path);
     console.log("Path File",ndsFile.boxArtFile.path);
       
    }

    
    console.log("Array args",arrayArgs);
    const pythonProcess = spawn(splittedPython[0],arrayArgs,{cwd:this._getCurrentPath()});

    

    
    template.set("lastNdsFile.running",true);
    template.set("lastNdsFile.finished",false);
    template.set("lastNdsFile.hadSuccess",false);
    return new Promise(function(resolve,reject){

/*    pythonProcess.on("error",function(err){
      console.log("Python error",err);
    });
    pythonProcess.on("close",function(err){
      console.log("Python close",err);
    });*/

    pythonProcess.stderr.on('data', (data) => {

      var result=data.toString();
      console.log("Ptyhon error",result);

      const fs = require('fs');
      var now=new Date();
      fs.writeFile(context._getCurrentPath()+"/output/logs/"+outputLog, now.toString()+": "+result+"\r\n", { flag: "a+" }, function (err) {
        if (err) return console.log(err);
        //console.log('Hello World > helloworld.txt');

        template.set("lastNdsFile.lastErrorLog",context._getCurrentPath()+"/output/logs/"+outputLog);

      });
    });

    pythonProcess.stdout.on('data', (data) => {
      var result=data.toString();




      const fs = require('fs');
      var now=new Date();
      fs.writeFile(context._getCurrentPath()+"/output/logs/"+outputLog, now.toString()+": "+result+"\r\n", { flag: "a+" }, function (err) {
        if (err) return console.log(err);
        //console.log('Hello World > helloworld.txt');

        template.set("lastNdsFile.lastErrorLog",context._getCurrentPath()+"/output/logs/"+outputLog);

      });






      console.log("Ptyhon print",result);

      template.set("lastNdsFile.running",false);
      template.set("lastNdsFile.finished",true);

      if(result!=null && result.indexOf("CIA generated.")>-1){
        console.log("Success!");
        template.set("lastNdsFile.hadSuccess",true);
        
        
      var path = require("path");
      var ciaPath = path.resolve(context._getCurrentPath()+"/output/"+outputName);
      var outputPath = path.resolve(context._getCurrentPath()+"/output");


template.set("lastNdsFile.lastSuccessCia",ciaPath);
template.set("lastNdsFile.outputPath",outputPath);
        resolve({ndsFile:ndsFile,success:true});

      }
      else{
        console.log("Failure!");
        
        template.set("lastNdsFile.hadSuccess",false);
        resolve({ndsFile:ndsFile,success:false});
      }
      
  });
    

});

  }

  downloadAllTemplates(){

    var fs = require('fs');
    var dir = this._getCurrentPath()+'/output';
    
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    if(!fs.existsSync(dir+"/logs")){
      
      fs.mkdirSync(dir+"/logs");
    }


    var context=this;
    var templates=this.shadowRoot.querySelectorAll("game-item");
    
    var templateArray=[];

    for(var i=0;i<templates.length;i++){


      templateArray.push(templates[i]);

//      arr.push(this.downloadTemplate(templates[i]));
    }
    if(!templateArray.length){
      MiscUtils.Toast.show("You didn't add any files");
      return;
    }
    context.set("saving",true);
    /*var arr=[];
    for(var i=0;i<templates.length;i++){


      arr.push(this.callPythonGenerator(templates[i]));

//      arr.push(this.downloadTemplate(templates[i]));
    }*/
      const {shell} = require('electron');
      var path = require("path");
var outputPath = path.resolve(this._getCurrentPath()+"/output");

    return templateArray.reduce((p, template) => {
      return p.then(() => {
          return context.callPythonGenerator(template); //function returns a promise
      });
  }, Promise.resolve()).then((result)=>{
      console.log("Result",result);
    context.set("saving",false);

    MiscUtils.Toast.show("The generation process has ended");
    shell.openPath(outputPath);
    
  }).catch(function(err){
    context.set("saving",false);
    console.error("Errors!",err);

    MiscUtils.Toast.show("The generation process has ended with errors");
    shell.openPath(outputPath);
  });




  



  }
 
  ready(){
    super.ready();

    var context=this;
    setTimeout(function(){
      context.setupDropZone();
    },500);
    

  }
  setupDropZone(){
    var dropZone = this.shadowRoot.querySelector('#dropZone');
var context=this;
// Optional.   Show the copy icon when dragging over.  Seems to only work for chrome.
dropZone.addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
});

// Get file data on drop
dropZone.addEventListener('drop', function(e) {
    e.stopPropagation();
    e.preventDefault();
    var files = e.dataTransfer.files; // Array of all files

    for (var i=0, file; file=files[i]; i++) {
      console.log("FILEddd",file);
        if (file.name.endsWith(".nds") || file.name.endsWith(".dsi")) {
          console.log("IS NDS file!");
            context.pushFiles([file]);
/*            var reader = new FileReader();

            reader.onload = function(e2) {
                // finished reading file data.
                var img = document.createElement('img');
                img.src= e2.target.result;
                document.body.appendChild(img);
            }

            reader.readAsDataURL(file); // start reading the file data.
            */
        }
    }
});
  }
  constructor(){
    super();

    
    var context=this;
    LocalStoreQuery.addFieldCallback("directoryPath",function(path){
      if(path==null || path=="" || path=="null"){
        LocalStoreQuery.set("directoryPath",".");
      }
      else{

        context.set("directoryPath",path);
//        LocalStoreQuery.set("directoryPath",context._getCurrentPath());
      }

    });

    
    LocalStoreQuery.addFieldCallback("selectedPython",function(target){
      if(!target){

        context.set("selectedPython","python3");
        return;
      }
      if(target.startsWith("other")){
        
        if(target.indexOf("---")>-1){
          context.set("selectedPython",target.split("---")[1] || "");
        }
        else{
          context.set("selectedPython","");
        }
      }
      else{
        context.set("selectedPython",target);

      }
      
    });
  }
  static get properties(){
    return{
      selectedPython:{
        type:String,
        notify:true
      },
      saving:{
        type:Boolean,
        notify:true,
        value: false
      },
      cardList:{
        type:Array,
        notify:true
      },
      ndsFiles:{
        type:Array,
        notify:true,
        value:null
      }
    };
  }
}

window.customElements.define('game-list', GameList);
