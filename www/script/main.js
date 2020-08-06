// main.js

var main_app = new Tulipan({

  template: {
      url: "views/main.html",
      async: false
  },
  
  route: "/",

  data: {
  },

  ready: function(){
    this.$store.set("total", 100);
    this.$store.set("team1", "");
    this.$store.set("team2", "");
    this.$store.set("team1Scores", []);
    this.$store.set("team2Scores", []);
    this.$store.set("team1total", 0);
    this.$store.set("team2total", 0);
    this.$store.set("score", 0);
  },

  methods: {

    after: function(params, query){
      this.$store.set("total", 100);
      this.$store.set("team1", "");
      this.$store.set("team2", "");
      this.$store.set("team1Scores", []);
      this.$store.set("team2Scores", []);
      this.$store.set("team1total", 0);
      this.$store.set("team2total", 0);
      this.$store.set("score", 0);
    },

    startGame: function(){
      this.$router.navigate("/settings");
    }
  }
});

var settings_app = new Tulipan({

  template: {
      url: "views/settings.html",
      async: false
  },
  
  route: "/settings",

  data: {
      team1: "",
      team2: "",
      total: 100,
      showToast: false,
      toastMessage: ""
  },

  methods: {

    after: function(params, query){
      this.team1 = this.$store.get("team1");
      this.team2 = this.$store.get("team2");
      this.total = this.$store.get("total");
    },

    accept: function(){
      this.showToast = false;
    },

    validate: function(){
      if (this.team1 == ""){
        this.toastMessage = "Please enter team 1 name";
        this.showToast = true;
        return;
      }

      if (this.team2 == ""){
        this.toastMessage = "Please enter team 2 name";
        this.showToast = true;
        return;
      }

      this.$store.set("team1", this.team1);
      this.$store.set("team2", this.team2);
      this.$store.set("total", this.total);

      this.goGame();
    },

    goGame: function(){
      this.$router.navigate("/match");
    }
  }
});

var match_app = new Tulipan({

  template: {
      url: "views/match.html",
      async: false
  },
  
  route: "/match",

  data: {
      team1: "",
      team2: "",
      team1Scores: [],
      team2Scores: [],
      total: 0,

      showQuit: false
  },

  methods: {

    after: function(params, query){
      var score = this.$store.get("score");
      this.total = this.$store.get("total");

      this.team1 = this.$store.get("team1");
      this.team2 = this.$store.get("team2");

      this.team1Scores = this.$store.get("team1Scores");
      this.team2Scores = this.$store.get("team2Scores");
    },

    addPoints: function(){
      this.$router.navigate("/counter");
    },

    quit: function(){
      this.showQuit = true;
    },

    quitMatch: function(){
      this.showQuit = false;
      this.$router.navigate("/");
    },

    resumeMatch: function(){
      this.showQuit = false;
    }
  }
});

var counter_app = new Tulipan({

  template: {
      url: "views/counter.html",
      async: false
  },
  
  route: "/counter",

  data: {
    team1: "",
    team2: "",
    winner: "",
    score: 0
  },

  methods: {

    after: function(params, query){
      this.team1 = this.$store.get("team1");
      this.team2 = this.$store.get("team2");
      this.winner = "team1";
    },

    addScore: function(){
      var scores = [];
      this.score = parseInt(this.score);

      if (this.winner == "team1"){
        scores = this.$store.get("team1Scores");
      } else {
        scores = this.$store.get("team2Scores");
      }

      if (scores.length == 0){
        scores.push([0, this.score]);
      } else {
        var last = scores[scores.length - 1][1];
        scores.push([this.score, last + this.score]);
      }

      if (this.winner == "team1"){
        this.$store.set("team1Scores", scores);
      } else {
        this.$store.set("team2Scores", scores);
      }

      scores1 = this.$store.get("team1Scores");
      scores2 = this.$store.get("team2Scores");

      if (last + this.score >= this.$store.get("total")) {
        if (this.winner == "team1"){
          this.$store.set("winnerMessage", "The winner team: " + this.team1);
        } else {
          this.$store.set("winnerMessage", "The winner team: " + this.team2);
        }
        this.$router.navigate("/gameover");
      } else {
        this.score = 0;
        this.$router.navigate("/match");
      }

    }
  }
});

var gameover_app = new Tulipan({

  template: {
      url: "views/gameover.html",
      async: false
  },
  
  route: "/gameover",

  data: {
    message: ""
  },

  methods: {

    after: function(params, query){
      this.message = this.$store.get("winnerMessage");
    },

    restart: function(){
      this.$router.navigate("/");
    }

    
  }
});