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
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/iron-icons/iron-icons';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-toast/paper-toast';
import '@polymer/paper-button/paper-button';
import './my-icons.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';
import './controls/upload-button';
import '@polymer/paper-checkbox/paper-checkbox';
import { ElectronMixin } from './mixins/electron-mixin';
import '@polymer/paper-radio-button/paper-radio-button';
import '@polymer/paper-radio-group/paper-radio-group';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class MyApp extends ElectronMixin(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          --app-primary-color: var(--paper-indigo-500);
          --app-secondary-color: black;

          display: block;
        }
        .drawer-checkbox{
          margin: 4px 16px;
        }

        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }

        app-header {
          color: #fff;
          background-color: #212121;
        }

        app-header paper-icon-button {
          --paper-icon-button-ink-color: white;
        }

        .drawer-list {
          margin: 0 20px;
        }

        .drawer-list a {
          display: block;
          padding: 0 16px;
          text-decoration: none;
          color: var(--app-secondary-color);
          line-height: 40px;
        }

        .drawer-list a.iron-selected {
          color: black;
          font-weight: bold;
        }
        paper-radio-button{
          display: block;
        }
        .dir-name-input{
          --paper-input-container-input:{font-size: 13px}; 
        }
      </style>

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>

      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
      </app-route>

      <app-drawer-layout fullbleed="" narrow="{{narrow}}">
        <!-- Drawer content -->
        <app-drawer id="drawer" align="end" opened="{{drawerOpened}}" style="text-align: left;" slot="drawer" swipe-open="[[narrow]]">
          <app-toolbar style="background-color: var(--paper-amber-400);">
          
          <div main-title>Settings</div>
          <!--<paper-icon-button icon="close" drawer-toggle></paper-icon-button>-->
          
          
          </app-toolbar>
          <!--<iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">-->



          <div style="display: flex; align-items: center; padding: 0px 8px;">
        
          <paper-input class="dir-name-input" on-input="setDirectoryPathInput" style="flex-grow: 1;" label="Generator Directory" always-float-label value="{{directoryPath}}"></paper-input>

          <div style="width: 40px; max-width: 40px; height: 40px; max-height: 40px; overflow: hidden; position: relative;">
          <paper-icon-button style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;" icon="icons:create-new-folder"></paper-icon-button>
          <input class="dir-input" type="file" on-change="checkDirectoryNew" webkitdirectory directory multiple style="opacity: 0; cursor: pointer; min-height: 40px; min-width: 40px;background-color: red; width: 40px; max-width: 40px; height: 40px; max-height: 40px; position: absolute; top: 0; left: 0; right: 0; bottom: 0;"/>


          </div>

        </div>
 

          <div style="padding: 8px; font-size: 12px; font-weight: 600;">Python command/location</div>
          <div style="padding: 8px; font-size: 13px; color: var(--paper-grey-600);">If your process gets stale (progress circle keeps going on more than 30 seconds and nothing happens), <span on-click="reload" style="text-decoration: underline; color: var(--paper-blue-500); cursor:pointer;">restart the app</span> and select a different command or location.</div>
          <paper-radio-group attr-for-selected="name" selected="{{selectedPython}}">
          <paper-radio-button on-click="setPython" name="python3">python3</paper-radio-button>
          <paper-radio-button on-click="setPython" name="py -3">py -3</paper-radio-button>
          <paper-radio-button on-click="setPython" name="C:\\Python39\\python.exe">C:\\Python39\\python.exe</paper-radio-button>
          <paper-radio-button on-click="setPythonInput" name="other">Other</paper-radio-button>
          </paper-radio-group>
          

          <template is="dom-if" if="[[isString(selectedPython,'other')]]">
          <paper-input on-input="setPythonInput" placeholder="Example C:\\Python39\\python.exe" always-float-label style="margin: 8px;" label="Other command/location" value="{{otherPython}}"></paper-input>
          </template>


        



<!--
            <a name="game-list" href="[[rootPath]]game-list">View One</a>
            <a name="view2" href="[[rootPath]]view2">View Two</a>
            <a name="view3" href="[[rootPath]]view3">View Three</a>
          </iron-selector>-->
        </app-drawer>

        <!-- Main content -->
        <app-header-layout has-scrolling-region="">

          <app-header slot="header" condenses="" reveals="" fixed effects="waterfall">
            <app-toolbar>
              <div main-title="">YANBF Generator</div>


         


              <upload-button accept=".nds,.dsi" on-file-selected="requestFiles" manual-upload multiple>
              <paper-icon-button icon="icons:folder-open"></paper-icon-button>
              </upload-button>


              <paper-icon-button icon="icons:settings" drawer-toggle=""></paper-icon-button>
            </app-toolbar>
          </app-header>

          <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
            <game-list card-list="[[cardList]]" class="game-list" name="game-list"></game-list>
            <my-view2 name="view2"></my-view2>
            <my-view3 name="view3"></my-view3>
            <my-view404 name="view404"></my-view404>
          </iron-pages>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }



  pushFiles(files){
    
    this.shadowRoot.querySelector(".game-list").pushFiles(files);
  }
  requestFiles(e){
    
    var files=e.detail.files;
    var file=e.detail.file;
    if(files){
      this.pushFiles(files);
    }
    else if(file){
      this.pushFiles([file]);
    }
    //var { ipcRenderer }=require("electron");
    //ipcRenderer.send("requestFiles");
  }

  _getCurrentPath(){
    const { remote } = require ('electron');
var camino=remote.process.env.PORTABLE_EXECUTABLE_DIR;
if(!camino){
  camino=".";
}
return camino;


  }

  checkDirectoryNew(e){
    
    if(e.target.files && e.target.files[0]){
 
      var context=this;

      var fileSplit=e.target.files[0].path.split("\\");
      fileSplit.splice(fileSplit.length-1,1);
      var pathFinal=fileSplit.join("\\");
      console.log("File DIR",pathFinal);
      LocalStoreQuery.set("directoryPath",pathFinal);

      
      MiscUtils.Toast.show("Generator directory path updated");


//         this.set("_selectedUploadButtonFile",e.target.files[0]);

        

        context.shadowRoot.querySelector(".dir-input").value="";



      }
      else{
          MiscUtils.Toast.show("You didn't select a directory");
      }



  }
  constructor(){
    super();
    var context=this;


    
    LocalStoreQuery.addFieldCallback("directoryPath",function(path){
      if(path==null || path=="" || path=="null"){
        LocalStoreQuery.set("directoryPath",context._getCurrentPath());
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
        context.set("selectedPython","other");
        if(target.indexOf("---")>-1){
          context.set("otherPython",target.split("---")[1] || "");
        }
      }
      else{
        context.set("selectedPython",target);

      }
      
    });
  
    
  }
  setDirectoryPathInput(e){

    var context=this;
    console.log("Calling directory input");
    if(this.lastDirectoryDebounce){
      clearTimeout(this.lastDirectoryDebounce);
      this.set("lastDirectoryDebounce",null);
    }
    this.set("lastDirectoryDebounce",setTimeout(function(){

  
      LocalStoreQuery.set("directoryPath",context.directoryPath);
      MiscUtils.Toast.show("Generator directory path updated");

    },500));
  }
  setPythonInput(e){

    var context=this;
    console.log("Calling python input");
    if(this.lastInputDebounce){
      clearTimeout(this.lastInputDebounce);
      this.set("lastInputDebounce",null);
    }
    this.set("lastInputDebounce",setTimeout(function(){

      var command="other---"+((context.otherPython || "").trim());

      LocalStoreQuery.set("selectedPython",command);
      MiscUtils.Toast.show("Selected python command/location updated");

    },500));
  }
  setPython(){
    console.log("Calling python common");
    var context=this;
    setTimeout(function(){
      var selectedPython=context.selectedPython;

      LocalStoreQuery.set("selectedPython",selectedPython);
      MiscUtils.Toast.show("Selected python command/location updated");
  
    },250);
  }
  setSelectedTarget(){
    var context=this;
    setTimeout(function(){
      var selectedTarget=context.selectedTarget;
      LocalStoreQuery.set("selectedTarget",selectedTarget);
  
    },250);
  }
  _sortName(a,b){
    var aName=a.name ? a.name.toLowerCase().trim() : "zzzzzz";
    var bName=b.name ? b.name.toLowerCase().trim() : "zzzzzz";
    return aName.localeCompare(bName);
  }
  saveCheckboxOption(e){
    var checkbox=e.target.closest("paper-checkbox");
    var name=checkbox.getAttribute("name");
    console.log("Saving:"+name);

    var context=this;
    setTimeout(function(){
      
      LocalStoreQuery.set(name,context[name]==true ? "true" : "false");

    },250);
  }
  updateFolderForGames(){
    LocalStoreQuery.set("folderForGames",this.folderForGames);
    
    MiscUtils.Toast.show("Folder updated");
  }
  isString(string1,string2){
    return string1==string2;
  }
  reload(){
    const app= require ('electron').remote.app;
    app.relaunch()
app.exit()
//    window.location.reload();
  }
  static get properties() {
    return {
      selectedPython:{
        type:String,
        notify:true,
        value:"python3"
      },
      gamesFolder:{
        type:String,
        notify:true,
        value: "Games"
      },
      selectedTarget:{
        type:String,
        notify:true,
        value: null
      },
      ndsFiles:{
        type:Array,
        notify:true
      },
      cardList:{
        type:Array,
        notify:true
      },
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      routeData: Object,
      subroute: Object
    };
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.page)'
    ];
  }

  _routePageChanged(page) {
     // Show the corresponding page according to the route.
     //
     // If no page was found in the route data, page will be an empty string.
     // Show 'game-list' in that case. And if the page doesn't exist, show 'view404'.
    if (!page) {
      this.page = 'game-list';
    } else if (['game-list', 'view2', 'view3'].indexOf(page) !== -1) {
      this.page = page;
    } else {
      this.page = 'game-list';
    }

    // Close a non-persistent drawer when the page & route are changed.
    if (!this.$.drawer.persistent) {
      this.$.drawer.close();
    }
  }

  _pageChanged(page) {
    // Import the page component on demand.
    //
    // Note: `polymer build` doesn't like string concatenation in the import
    // statement, so break it up.
    switch (page) {
      case 'game-list':
        import('./game-list.js');
        break;
      case 'view2':
        import('./my-view2.js');
        break;
      case 'view3':
        import('./my-view3.js');
        break;
      case 'view404':
        import('./my-view404.js');
        break;
    }
  }
}

window.customElements.define('my-app', MyApp);
