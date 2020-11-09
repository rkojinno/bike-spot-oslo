<template>
  <div id="home-page">
      <header id="page-header" class="">

          <div class="columns">
            <div class="column text-right">
                 <p>
                    Last Updated at: {{lastUpdate ? getHoursAndMinutes(lastUpdate) : 'Loading...'}}
                </p>
            </div>
          </div>

          <div class="columns">
            <div class="column">
               <img src="../../src/assets/images/logo.png">
                <p> Check out the status of Oslo's bike stations.</p>
            </div>
          </div>          
      </header>


      <section id="home-page-under-header" v-if="!loading" >

          <div class="columns reverse-col-mobile">

            <div id="home-page-under-header-left" class="column">
              
              <div class="columns reverse-col-mobile">
                  <div class="column">
                        <p> You can search the station by Name or Address below</p>
                        <input placeholder="search here"  class="text-input-1" v-model="searchTerm" />
                        <button class="button-clear" @click="clearSearch()">Clear Search</button>
                  </div>
                  <div class="column requiredFilters">
                      <button @click="changeRequiredState('bikes')" :class="bikesRequired ? 'button-filter-active' : 'button-filter-inactive'">Bike(s) Required</button>
                      <button @click="changeRequiredState('docks')" :class="docksRequired ? 'button-filter-active' : 'button-filter-inactive'" >Dock(s) Required</button>
                  </div>

              </div>
            

            </div>
            <div id="home-page-under-header-right" class="column is-one-fifth text-right">

              <button class="button-refresh" @click="callRefresh()">
                <span v-html="makeIcon('refresh')"></span>
              </button>

            </div>

          </div>
        
      </section>




    <section v-if="!loading" id="home-page-table">
      <div class="column">
        <vue-good-table
          :key="tableUpdateNumber"
          :columns="columns"
          :rows="filterStationData(stationsData)"
          :search-options="{
            enabled: true,
            externalQuery: searchTerm,
          }"
          :sort-options="{
            enabled: false,
          }"
          :pagination-options="{
            enabled: true,
            mode: 'records',
            perPage: perPage,
            position: 'top',
            perPageDropdown: [5, 10, 25],
            dropdownAllowAll: false,
            setCurrentPage: 1,
            nextLabel: 'next',
            prevLabel: 'prev',
            rowsPerPageLabel: 'Cards per page',
            ofLabel: 'of',
            pageLabel: 'page',
            allLabel: 'All',
          }"
        >
          <template slot="table-row" slot-scope="props">
      


            <div v-if="props.column.field == 'address'">
                 <label>{{props.column.label}}</label> 
              {{ props.formattedRow[props.column.field] }}
              <button class="button-view-map" @click="openMap(props.row.lat, props.row.lon,props.row.station_id)"> View Map  <span v-html="makeIcon('map')"></span> </button>


            </div>
   

            <div v-else-if="props.column.field == 'bikeDocks'">
              <label>{{props.column.label}}</label>
              <div  v-if="stationStatusObj[`s${props.row.station_id}`]">
              <span :class="getTagBackground(stationStatusObj[`s${props.row.station_id}`].num_bikes_available)">
                {{stationStatusObj[`s${props.row.station_id}`].num_bikes_available}}
                {{getTagTitle(stationStatusObj[`s${props.row.station_id}`].num_bikes_available,'Bike(s)')}}</span>  
              <span>
                <span :class="getTagBackground(stationStatusObj[`s${props.row.station_id}`].num_docks_available)">
                  {{stationStatusObj[`s${props.row.station_id}`].num_docks_available}}
                  {{getTagTitle(stationStatusObj[`s${props.row.station_id}`].num_docks_available,'Dock(s)')}}</span
                >
              </span>
             
              

               <span class="last-reported-tag" v-if="stationStatusObj[`s${props.row.station_id}`]" >
                Last Reported: {{ getHoursAndMinutes(stationStatusObj[`s${props.row.station_id}`].last_reported)}}
              </span>

              
              </div>
              <span v-else> Loading </span>

            </div>
            <div v-else>

              <label>{{props.column.label}}</label> 
              {{ props.formattedRow[props.column.field] }}

            </div>

          </template>

        </vue-good-table>
      </div>
    </section>

    <transition name="fade">
    <Loading-Component v-if="loading || !splashTimerDone"></Loading-Component>
    </transition>

    <transition name="fade">
      <div v-if="actionDoneText" :class="actionDoneClass">
          <p>
            {{actionDoneText}}
          </p>
      </div>
    </transition>

    <transition name="fade">
      <div id="map">
        <!-- <GmapMap
  :center="{lat:59.92883258499495, lng:	10.799770383800876}"
  :zoom="7"
  map-type-id="terrain"
  style="width: 500px; height: 300px"
>

<GmapMarker ref="myMarker"
    :position="google && new google.maps.LatLng(59.92883258499495, 10.799770383800876)" />

      <Map
</GmapMap>
      </div> -->

      <Map-Component v-if="mapCoordinations && mapOpen" @closeMap="closeMap()" :coordinations="mapCoordinations" :id="mapId" ></Map-Component>

      </div>
    </transition>

    



  </div>
</template>

<script>

// External and External Support
import axios from "axios";
import "../assets/css/vue-good-table.css";
import { VueGoodTable } from "../components/vue-good-table-custom";


// Internal Functions
import {getHoursAndMinutes} from '../utils/functions/timeFunctions';
import {getTagTitle,getTagBackground,sortByCapacity,makeIcon} from '../utils/functions/renderingFunctions'

//Components
import LoadingComponent from '@/components/general/LoadingComponent';
import MapComponent from '@/components/general/Maps'


export default {
  name: 'Home-View',
  created() {
    if(this.updateTimeout){
      clearInterval(this.updateTimeout);
    }

  },
  mounted() {
        this.getWindowSize();

        setTimeout(() => {
          this.splashTimerDone = true;
        }, 1700);
        // to ensure smooth rendering of the intro

        this.updateTimeout = setInterval(() => {
          this.updateStatus();

        },  360000);


  },
  beforeCreate() {},
  components: {
    VueGoodTable,
    LoadingComponent,
    MapComponent,
  },
  data: () => ({
    getHoursAndMinutes,
    getTagTitle,
    getTagBackground,
    sortByCapacity,
    makeIcon,
    //Imported Functions

    loading: true,
    loadingAction: false,
    splashTimerDone: false,
    actionDoneText: '',
    actionDoneClass: '',
    // Loading / Rendering Variables ...

    systemLanguage: "en",
    lastUpdate: "",
    ttl: "",
    // General Data from Endpoint

    stationsData: {},
    stationsDataLength: 0,
    stationStatusObj: {},
    // Stations Data from Endpoint

    searchTerm: "",
    columns: [
      {
          label: "Address",
          field: "address",
      },
      {
        label: "Name",
        field: "name",
      },
      {
        label: "Bikes and Docks Available",
        field: "bikeDocks",
      },


    ],
    currentPage: 7,
    perPage: null,
    tableUpdateNumber: 0,
    updateTimeout: false,

    bikesRequired:false,
    docksRequired:false, 
    // Table Parameters


    mapOpen: false,
    mapCoordinations: false,
    mapId: false,
  }),
  methods: {
 


    getWindowSize() {
      this.loadingAction = true;

      let windowWidth;
      windowWidth = window.innerWidth;
      let windowHeight;
      windowHeight = window.innerHeight;

      // if (windowWidth  > 1000) {
      //   let addressColumn = {
      //     label: "Address",
      //     field: "address",
      //   };
      //   this.columns.unshift(addressColumn);
      // }

      if(!this.perPage){
         if (windowHeight > 600) {
        this.perPage = 10;
        } else {
          this.perPage = 5;
        }
      }
     

      this.getStations();
    },

    callRefresh() {
      if(!this.loadingAction){

          this.searchTerm = "";
          this.getWindowSize();

      }
    },

    async getStations() {
      let vm = this;

      axios
        .get(
          `https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json`
        )
        .then((resp) => {
          let response = resp.data;

          
          this.ttl = response.ttl;
          this.stationsData = this.sortByCapacity(response.data.stations);
          this.stationsDataLength = this.stationsData.length;

          this.getStationStatus();
        })
        .catch((error) => {
          console.log(error);
          this.showConfirmationTag('Error Updating Stations',true)
        });
    },
    updateStatus(){
      if(!this.loadingAction){
        this.getStationStatus();
      }
    },
    
    

    async getStationStatus() {


      axios
        .get(
          `https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json`
        )
        .then((resp) => {
          let statusArray = resp.data.data.stations;

          statusArray.forEach((item) => {
            this.stationStatusObj[`s${item.station_id}`] = item;            
          });
         
          this.lastUpdate = resp.data.last_updated;
          this.forceTableUpdate();
          this.loading = false;
          this.showConfirmationTag('Data Updated',true)
        })
        .catch((error) => {
          console.log(error);
           this.showConfirmationTag('Error Updating Status',true)
          
        });
    },

    filterStationData(dataArray){

      let filteredArray = [...dataArray]

      if(this.bikesRequired){
        filteredArray = filteredArray.filter(  (stationObj)   => {  
          return (this.stationStatusObj[`s${stationObj.station_id}`].num_bikes_available  > 0 )
        });
      }
      if(this.docksRequired){
         filteredArray = filteredArray.filter(  (stationObj)   => {  
          return (this.stationStatusObj[`s${stationObj.station_id}`].num_docks_available  > 0 )
        });
      }
   

      return filteredArray;
    },

    changeRequiredState(requirement){
      this[`${requirement}Required`] = !this[`${requirement}Required`];
      this.forceTableUpdate();
    },

    forceTableUpdate(){
      console.log('updating')
          this.tableUpdateNumber = this.tableUpdateNumber + 1;
    },


    // Table Actions....

    clearSearch() {
      this.searchTerm = "";
    },

    // General Actions....
    setLoading(state) {
      this.loading = state;
    },
    // Style Functions...

    showConfirmationTag(text,confirmed){
        this.actionDoneText = text;
        if(confirmed){
          this.actionDoneClass = 'confirmation_tag';
        }else{
          this.actionDoneClass = 'failure_tag';
        }
       setTimeout(() => {
          this.loadingAction = false;
        }, 2000);
         setTimeout(() => {
          this.actionDoneText = '';
        }, 3000);
    },





    openMap(lat,lon,id){
        this.mapCoordinations = {
        lat: lat,
        lon: lon,
      };
      this.mapOpen = true;
      this.mapId = id;
    },


    closeMap(){
      this.mapOpen = false;
      this.mapCoordinations = false;
      this.mapId = '';
    }






  
  },
};
</script>


<style lang="scss">
    @import '@/assets/css/homePageView.scss';
</style>