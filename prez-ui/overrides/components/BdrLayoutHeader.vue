<template>
    <header class="dawe-header">
        <div class="container mx-auto">
            <div class="columns">
                <div class="column is-one-third">
                    <a href="https://www.dcceew.gov.au" target="_blank" rel="noopener noreferrer">
                        <img class="dcceew-logo-img" src="/dcceew-logo.svg" alt="DCCEEW logo">
                    </a>
                </div>
                <div class="column has-text-left">
                    <h1>Biodiversity Data Repository</h1>
                    <h2>&nbsp;</h2>
                </div>
                <div class="column is-one-fifth bdr-logo">
                    <a href="https://www.dcceew.gov.au/environment/science-research/aera" target="_blank" rel="noopener noreferrer">
                        <img src="/BDR-logo.png" alt="BDR logo">
                    </a>
                </div>
            </div>
        </div>
    </header>
</template>

<style scoped>
.dawe-header {
    background-color: #083a42;
    color: #fff;
    height: 180px;
    padding-left: 45px;
    padding-right: 45px;
    font-family: "Open Sans", sans-serif;
    display: flex;
    align-items: center;
}

.dawe-header h1 {
    font-size: 36px;
    font-weight: 400;
    line-height: 1.5;
    color: #fff;
    border-bottom: none;
}

.dcceew-logo-img {
    max-height: 5em;
}

.bdr-logo {
    padding-top: 0;
    padding-left: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.bdr-logo img {
    max-height: 8em;
}

.columns {
    display: flex;
    align-items: center;
    width: 100%;
}

.column {
    display: block;
    flex-basis: 0;
    flex-grow: 1;
    flex-shrink: 1;
    padding: .75rem;
}

.column.is-one-third {
    flex: none;
    width: 33.3333%;
}

.column.is-one-fifth {
    flex: none;
    width: 20%;
}

.column.has-text-left {
    text-align: left;
}
</style>
