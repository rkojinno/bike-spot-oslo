<template>
  <div class="loading-component columns bg-main">
      <div class="column inner">
        
          <div class="loading-image-block" >
          
            <img class="loading-image-body" src="../../assets/images/BikeNoWheel.png">
            <img class="loading-image-wheel animate__animated animate__infinite infinite animate__rollOut" src="../../assets/images/BikeWheel.png">
          </div>
           <div class="loading-text-block center-margin-h">
              <p> Loading Data, It won't be long...</p>
          </div>
         
      </div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  created() {

  },
  data: () => ({

    }),
}
</script>

<style lang="scss">
    @import '../../assets/css/loadingComponent.scss';
</style>

