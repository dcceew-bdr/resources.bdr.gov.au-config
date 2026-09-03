<template>
  <NuxtLayout contentonly>
    <template #default>
      <div class="max-w-6xl leading-relaxed">
        <h1 class="text-4xl pb-6 mt-8 mb-6 flex items-center justify-between gap-2">
            BDR Profiles
            <span class="text-base"><NuxtLink to="/profiles">You can view the profiles here</NuxtLink></span>
        </h1>
        <p>
          <em>Profiles</em> are views of the data within this system.
        </p>
        <p>
          Users may wish to view BDR data according to different information models
          and/or in different formats. For example, a TERN Ontology-only view of 
          observations as opposed to complete ABIS information. Or perhaps a GeoJSON
          rendering of sites.
        </p>
        <p></p>
        <p>
          Identified and described "profiles" are used to enable these different views
          and requsts to this online BDR delivery system can support multiple profiles: 
          just as long as the profile can be defined in a particular way and that the BDR
          actually contains the data to support it.
        </p>
        <p></p>
        <p>
          Currently supported profiles <a href="/profiles">are defined here</a>, but new ones
          can be created if needed - contact the BDR team.
        </p>        
      </div>
    </template>
  </NuxtLayout>
</template>
