<template>
  <div class="map-component columns">
    <div class="map-component-bg">

        <div class="map-component-inner">
      
            <div class="map-component-close-top">
                <button  @click="closeMap()">X</button>
            </div>
            <div class="map-component-loading" v-if="loadingMap"> Loading Map, please wait</div>
            <div :id="`map-root-${id}`" :ref="`map-root-${id}`" class="map-component-map"></div>
            <button  class="map-component-close" @click="closeMap()">  <span> Close Map  </span> <span> X </span> </button>
            
            

        </div>
    
  
    </div>
      
  </div>
</template>

<script>

  import View from '@/components/ol/View'
  import Map from '@/components/ol/Map'
  import TileLayer from '@/components/ol/layer/Tile'
  import OSM from '@/components/ol/source/OSM'

  import '@/components/ol/ol.css'


export default {
  
  name: 'MapContainer',
    components: {},
    props: {
      coordinations: Object,
      id: String,
    },
    created() {
      let mapId = `map-root-${this.id}`;
      let vm = this;
      setTimeout(() => {
          this.createMap(mapId);
        }, 900);
      
    },

     data: () => ({
      loadingMap: true,
     }),



    methods: {
      closeMap(){
        this.$emit('closeMap');
      },

      createMap(mapId){

        let mapCenter = [this.coordinations.lon,this.coordinations.lat ];
            new Map({
        // the map will be created using the 'map-root' ref
        target:  this.$refs[mapId],
        layers: [
          // adding a background tiled layer
          new TileLayer({
            source: new OSM() // tiles are served by OpenStreetMap
          }),
        ],

        // the map view will initially show the whole world
        view: new View({
          zoom: 17,
          projection: 'EPSG:4326',
          center:  mapCenter,
          constrainResolution: true,
        }),
      })


      this.loadingMap = false;


      }

    }





    
}
</script>

<style lang="scss">
    @import '../../assets/css/mapComponent.scss';
</style>

