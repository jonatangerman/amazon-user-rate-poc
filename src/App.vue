<template>
  <div id="app">
    <div id="loader" v-if="isLoading">
      <img src="/loader.gif" alt="loader" />
    </div>
    <div class="search-container">
      <img class="logo" src="/amazon-logo.png" alt="amazon-logo" />
      <h2 class="search-title">User Rate Searcher:</h2>
      <input
        type="text"
        id="amazon-search"
        v-model="asin"
        @keyup.enter="searchAmazon"
        placeholder="Insert a Product ASIN"
      />
      <div id="results-container" v-if="rate !== ''">
        <h2>{{ productTitle }}</h2>
        <div id="results">
          <div class="image-result">
            <img :src="resultImage" alt="result-image" />
          </div>
          <div class="text-result">
            <p class="star-count">
              <span class="star-icon" :key="i" v-for="i in rateNumber"
                ><img src="/star-icon.png" alt="star-icon"
              /></span>
            </p>
            <p>
              <b>{{ rate }}</b>
            </p>
            <p>
              <img src="/user-icon.png" alt="user-icon" class="user-icon" />
              <b>{{ users }}</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import cheerio from "cheerio";

export default {
  data() {
    return {
      asin: "",
      productTitle: "",
      rate: "",
      users: "",
      resultImage: "",
      isLoading: false,
    };
  },
  computed: {
    rateNumber() {
      if (!this.rate) return 0;
      return Math.floor(Number(this.rate.split(" ")[0]));
    },
  },
  methods: {
    searchAmazon() {
      this.reset();
      this.isLoading = true;
      axios
        .get(`/gp/product/${this.asin}`)
        .then((response) => {
          if (response.status === 200) {
            const $ = cheerio.load(response.data);

            this.productTitle = $("#productTitle").html();
            this.resultImage = $("#main-image-container li")
              .first()
              .find("img")
              .attr("src");
            this.rate = $("#averageCustomerReviews .a-icon-alt").html();
            this.users = `From ${$("#acrCustomerReviewText").html()} users.`;
          } else {
            console.error(`Error Fetching product: ${response.statusText}`);
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    reset() {
      this.productTitle = "";
      this.rate = "";
      this.users = "";
      this.resultImage = "";
    },
  },
};
</script>

<style>
html,
body {
  padding: 0px;
  margin: 0px;
  height: 100%;
  width: 100%;
}
#loader {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

#loader img {
  width: 100px;
}

#app {
  position: relative;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: beige;
  height: 100%;
  width: 100%;
}

.user-icon {
  margin-right: 10px;
}

.search-container {
  padding: 50px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.logo {
  width: 300px;
}

.text-result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.text-result p {
  display: flex;
  align-items: center;
  justify-content: center;
}

#results-container {
  margin-top: 30px;
  max-width: 50%;
}

#results-container h2 {
  margin-bottom: 0px;
}

#results {
  display: flex;
  border: 1px solid;
  background-color: darkslategray;
  color: white;
}

h2.search-title {
  margin-top: -30px;
}

.text-result img {
  width: 50px;
}

.image-result {
  line-height: 0px;
  max-width: 50%;
}

.star-count {
  margin: -10px;
}

input {
  height: 50px;
  background-color: rgba(255, 255, 255, 0.5);
  width: 50%;
  font-size: 30px;
  padding: 10px 15px;
}
</style>
