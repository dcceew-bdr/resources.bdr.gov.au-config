<template>
  <NuxtLayout contentonly>
    <template #default>
      <div class="max-w-6xl leading-relaxed">
        <h1 class="text-4xl pb-6 mt-8 mb-6 flex items-center justify-between gap-2">
            BDR Catalogues
            <span class="text-base"><NuxtLink to="/catalogues">View the catalogues</NuxtLink></span></h1>
        <p>
          The catalogues listed here contain resources of particular types -
          vocabularies, datasets etc. - that are loaded into the BDR. Some of the
          items in these catalogues are developed for and so-far only found here, but
          others are managed elsewhere and reused here, such as TERN's vocabularies
          for scientific survey protocols.
        </p>

        <p>
          The catalogues themselves conform to the
          <a href="https://www.w3.org/TR/vocab-dcat-3/"
            >Data Catalog Vocabulary (DCAT)</a
          >
          and
          <a href="https://schema.org">schema.org</a> models.
        </p>

        <p>
          The catalogues of data listed here contain the main information of
          biodiversity observations stored within the BDR. The content in these
          catalogues conforms to the
          <a href="https://linked.data.gov.au/def/abis">ABIS</a> standard.
        </p>

        <p>
          The catalogues of vocabularies support the main biodiversity observations
          and contain environmental and biodiversity classifications, including soil
          and landscape survey methodologies, land use management classifications,
          ecological monitoring method lists, and many technical and management
          vocabularies used for data access and governance. These vocabularies
          conform to the well-known
          <a href="https://www.w3.org/2004/02/skos/"
            >Simple Knowledge Organization System (SKOS)</a
          >
          model, and specifically, the
          <a href="https://w3id.org/profile/vocpub/spec">VocPub</a> profile of it.
          This helps to ensure consistent data collection and interpretation across
          Australia's biodiversity monitoring and research efforts and allows for the
          validation of new vocabs and additions to existing ones.
        </p>
      </div>
    </template>
  </NuxtLayout>
</template>
