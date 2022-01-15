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
import '@polymer/iron-collapse/iron-collapse';
import '@polymer/paper-ripple/paper-ripple';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-spinner/paper-spinner';
import '@polymer/iron-icons/image-icons';
class GameItem extends PolymerElement {
  static get template() {
    return html`
      <style >
        :host {
          display: block;

          
        }
        .card {
            margin: 24px;
            
            border-radius: 5px;
            background-color: #fff;
            box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
          }
          .subtitle{
              font-size: 13px;
            color: #757575;
          }
          .title{
              font-size: 17px;
          }
          .collapse-content{
              background-color: var(--paper-amber-50);
              
          }
      </style>

      <div class="card" style="cursor: pointer;">
      <div style="display: flex; align-items: center; position: relative;"  on-click="toggleExpand">
          <div class="canvas-container" style="border-right: 1px solid var(--paper-grey-500); width: 66px; height: 66px; background-size: cover; background-image: url('[[data.image]]'); background-position: center; background-repeat: no-repeat;">
          </div>
        
            <div style="line-height: 17px; flex-grow: 100;">
                 <div style="padding: 8px 12px">
                    <div class="title">[[name]]</div>
                    <div class="subtitle">[[publisher]]</div>
                </div>
            </div>
            
            <template is="dom-if" if="[[lastNdsFile.running]]">
              <paper-spinner style="min-width: 28px;" active="[[lastNdsFile.running]]"></paper-spinner>
            </template>

            <template is="dom-if" if="[[lastNdsFile.finished]]">

            <template is="dom-if" if="[[lastNdsFile.lastErrorLog]]">
              <paper-icon-button style="min-width: 40px;" icon="description" alt="Python Log" on-click="openErrorLog"></paper-icon-button>
                
              </template>


              <template is="dom-if" if="[[lastNdsFile.hadSuccess]]">
              <template is="dom-if" if="[[lastNdsFile.lastSuccessCia]]">
              <paper-icon-button style="min-width: 40px;" icon="folder-open" alt="Show file" on-click="openFileInExplorer"></paper-icon-button>
                
              </template>

                <div><iron-icon icon="check-circle" style="color: var(--paper-green-500);"></iron-icon></div>
              </template>

              <template is="dom-if" if="[[!lastNdsFile.hadSuccess]]">
              
           
              <div><iron-icon icon="cancel" style="color: var(--paper-red-500);"></iron-icon></div>

              </template>


            </template>
            
            <div style="min-width: 40px;">
            <template is="dom-if" if="[[!expanded]]"> <paper-icon-button icon="icons:expand-more"></paper-icon-button>
            </template>

            <template is="dom-if" if="[[expanded]]"> <paper-icon-button icon="icons:expand-less"></paper-icon-button>
            </template>

            </div>



            <paper-ripple></paper-ripple>

       </div>
        <iron-collapse opened="[[expanded]]">
            <div class="collapse-content">
              <div style="padding: 24px;">


              <div>
              Game File:
              <div class="subtitle" style="color: var(--paper-blue-500);">[[gamePath]]</div>
              </div>
            
              <div><upload-button photo accept=".png" image-file="{{lastNdsFile.boxArtFile}}" image-url="{{lastNdsFile.boxArtUrl}}" manual-upload><paper-button on-click="setBoxArt"><iron-icon icon="image:image" style="margin-right: 8px;"></iron-icon>Set Box Art</paper-button></upload-button></div>
              <template is="dom-if" if="[[lastNdsFile.boxArtUrl]]">

              <div style$="background-image: url('[[lastNdsFile.boxArtUrl]]'); width: 128px; height: 128px; background-position: center; background-size: contain; background-repeat: no-repeat; border: 1px solid var(--paper-grey-400);"></div>

              <div style="display: flex; align-items: center;">
              <div>[[lastNdsFile.boxArtFile.path]]</div>
              <paper-icon-button icon="delete" on-click="removeFiles"></paper-icon-button>
              </div>
              </template>
              <div><paper-button on-click="dispatchRemove"><iron-icon icon="delete" style="margin-right: 8px;"></iron-icon>Remove NDS File</paper-button></div>
           

            

            </div>


          </div>
        </iron-collapse>
       </div>

    `;
  }
  dispatchRemove(){
    this.set("expanded",false);
    var context=this;
    setTimeout(function(){
      context.dispatchEvent(new CustomEvent('delete-clicked', {detail: {ndsFile:context.data}}));       

    },250);

  }
  setCanvas(canvas){
    var element=this.shadowRoot.querySelector(".canvas-container");
    while (element.firstChild) {
      element.removeChild(element.lastChild);
    }
    if(canvas!=null){
      element.appendChild(canvas);
    }
  }
  toggleExpand(){
      this.set("expanded",!this.expanded);

      if(this.expanded==true){
        this.dispatchEvent(new CustomEvent('expand-done', {detail: {ndsFile:this.data}}));      
        
      }
  }
  _myDataChanged(data){
    //console.log("Data",data);
    var context=this;
    if(this.lastNdsFile){
      this.lastNdsFile.kill();
    }

    if(data!=null){
      if(data.name){
        this.set("name",data.name);
      }
      if(data.publisher){
        this.set("publisher",data.publisher);
      }
    }

    if(data!=null && data.file!=null){
     
      this.set("lastNdsFile",new NDSFile(data.file,function(internalData){
      //  console.log("DATA 3D!",internalData);
          
          context.set("name",internalData.name);
          context.set("publisher",internalData.publisher);
          context.set("tid",internalData.tid);
          context.set("overrideTid",internalData.overrideTid);
          context.set("gameTitle",internalData.gameTitle);
          context.set("gamePath",internalData.gamePath);


          if(internalData.canvasObject)
          context.setCanvas(internalData.canvasObject);
      }));


    }
  }
  reloadTid(){
    this.lastNdsFile.reloadTid();
  }
  overTidChanged(overrideTid){
    
    if(this.lastNdsFile!=null && overrideTid!=null)
    this.lastNdsFile.overrideTid=overrideTid;
  }
  titleChanged(gameTitle){
    if(this.lastNdsFile!=null && gameTitle!=null){
      this.lastNdsFile.gameTitle=gameTitle;


    }
  }
  pathChanged(gamePath){
    if(this.lastNdsFile!=null && gamePath!=null){
      this.lastNdsFile.gamePath=gamePath;


    }
  }
  openFileInExplorer(e){
    e.preventDefault();
    e.stopPropagation();
    var url=this.lastNdsFile.lastSuccessCia;
    var path = require("path");
    var output=this.lastNdsFile.outputPath;
    console.log("URL",url);
    if(url!=null){
      const {shell} = require('electron');
      shell.showItemInFolder(path.resolve(url));
    }
  }
  openErrorLog(e){
    e.preventDefault();
    e.stopPropagation();
    var url=this.lastNdsFile.lastErrorLog;
    var path = require("path");
    console.log("URL",url);
    if(url!=null){
      const {shell} = require('electron');
      shell.openPath(path.resolve(url));
    }
  }
  removeFiles(){
    this.set("lastNdsFile.boxArtUrl",null);
    this.set("lastNdsFile.boxArtFile",null);
    this.shadowRoot.querySelector("upload-button").clearFile();
  }
  static get properties(){
      return{
        boxArtUrl:{
          type:String,
          notify:true,
          value: null
        },
        boxArtFile:{
          type:Object,
          notify:true,
          value: null
        },
        running:{
          type:Boolean,
          notify:true,
          value: false
        },
        finished:{
          type:Boolean,
          notify:true,
          value: false
        },

        hadSuccess:{
          type:Boolean,
          notify:true,
          value: false
        },
        gameTitle:{
          type:String,
          notify:true,
          observer: "titleChanged"
        }, 
        gamePath:{
          type:String,
          notify:true,
          observer: "pathChanged"
        },
        overrideTid:{
          type:String,
          notify:true,
          observer: "overTidChanged"
        },
        expanded:{
            type:Boolean,
            notify:true,

            value: false
        },
        data:{
            type:Object,
            notify:true,
            observer:"_myDataChanged"
        }
      };
  }
}

window.customElements.define('game-item', GameItem);
