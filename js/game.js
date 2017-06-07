  !function(root) {

    // PLAYER _________________________________________________________________________________________


    // - public properties
    // -- name (string): "x" or "o"


    // - private properties
    // -- _.binary (int): binary number for each player to link to the players collections (0 or 1)
    // -- _.id (int): number rendered in html (not sure why the treehouse html does not align with binary?)
    // -- _.element (string): player html element that shows wich player is in turn
    // -- _.active (string): classname to select a box on the game board
    // -- _.win (string): classname to show wining player on the end screen


    // - public methods
    // -- get(name) : returns a string or int of a private property.  
    // -- arguments:
    // -- -- name: argument is the key value to get the private property 


    function Player(name) {

      this.name = name;

      var _ = {}
      _.binary = parseInt(this.name.charCodeAt(0).toString(2)[2]);
      _.id = _.binary + 1;
      _.element = '#player'+ _.id;
      _.active = 'box-filled-' + _.id;
      _.hover = 'box-hover-' + _.id;
      _.win = 'screen-win-';

      if(_.id === 1) {
        _.win = _.win+'one'
      }

      if(_.id === 2) {
        _.win = _.win+'two'
      }

      this.get = function(name) {
        return  _[name];
      }

    }


    // RULE _________________________________________________________________________________________


    // - public properties
    // -- type (string): the name of the rule ("row", "column", "diagonal-right", or "diagonal-left")


    // - private properties
    // -- _.space (int): number of spaces to count in the loop when validation the rule 
    // -- _.length (int): length of boxes required to loop to validate the rule
    // -- _.total (int): required to validate the count to ensure items fall in a pattern of three in a row, column or diagonal
    // -- _.start (int): box number to start the loop. Most start at zero except diagonal-left needs to start at the last item on the first row
    // -- _.increment (int): number of boxes to increment in the loop when validation the rule 
    // -- _.score (int): keeps score when looping through boxes.  Resets when pattern of three in a row, column or diagonal has been broken
    // -- _.count (int): keeps track of the overall items looped to pull the apropriate box from the boxes collection.


    // - private methods
    // -- _.merge(options) : this enables the passing of private properties on init so each rule can have customer values to ensure the rule object
    //    is flexible enough to validate all 4 main rules ("row", "column", "diagonal-right", or "diagonal-left")
    // -- arguments:
    // -- -- options: an object with matching properties to the current properties defiend in the private "_" object


    // - public methods
    // -- get(name) : returns a string or int of a private property.  
    // -- arguments:
    // -- -- name: argument is the key value to get the private property 

    // -- validate(boxes , current) : validates the rule and returns true or false. True means the rule has been validated and there is a winner.
    // -- arguments:
    // -- -- boxes: jquery collection of boxes from the game board
    // -- -- current: current player object


    function Rule(type, options) {
      
      this.type = type;

      var _ = {}

      _.space = 0;
      _.length = 0;
      _.total = 0;
      _.start = 0;
      _.increment = 1;

      _.score = 0;
      _.count = 0;


      _.merge = function (options){
        for (var attrname in options) { 
          this[attrname] = options[attrname];
        }
      }
      _.merge(options);

      this.get = function(name) {
        return  _[name];
      }

      this.validate = function(boxes , current) {

        for(var i=_.start, len=_.length; i <= len; i = i + _.increment){
          for(var j = 0; j < 3 ; j++) {
            console.groupCollapsed(j);
            console.log(boxes[(i + _.count)]);

            if($(boxes[(i + _.count)]).hasClass( 'box-filled-'+current.get('id') )) {
              _.score = _.score + 1;
              console.log('_.score: '+_.score);
              console.log('_.count: '+_.count);
              console.log('_.count: '+_.total);
            }

            if( _.score === 3 &&  _.count === _.total) {
              _.score = 0;
              _.count = 0;
              console.log('WIN!');
              console.groupEnd();
              return true;
            }

            _.count = _.count + _.space;
            console.groupEnd();

          }
          _.score = 0;
          _.count = 0;
        }

        _.count = 0;
        _.score = 0;

         return false
      }


    }


    // BOARD _________________________________________________________________________________________

    // - public properties
    // -- boxes (jquery collection): collection of boxes from the game board
    // -- fade (string | int): sets the jquery fade timing for the UI


    // - private properties
    // -- _.players (collection): collection of player objects that are passed in on init 
    // -- _.rules (collection): collection of rules. Use the addRule() method to add rules after init
    // -- _.current (obj): envelope pattern holding the current player binary value and current player object
    // -- _.start (int): box number to start the loop. Most start at zero except diagonal-left needs to start at the last item on the first row
    // -- _.increment (int): number of boxes to increment in the loop when validation the rule 
    // -- _.score (int): keeps score when looping through boxes.  Resets when pattern of three in a row, column or diagonal has been broken
    // -- _.count (int): keeps track of the overall items looped to pull the apropriate box from the boxes collection.


    // - private methods
    // -- _.initPlayer() : new game is loaded. randomly flip a coin to assign a current player to the "_.current" private porperty
    // -- _.changePlayer() : changes player in the "_.current" private porperty after a box has been selected 
    // -- _.isDraw() : check the baord fro a draw / tie
    // -- _.clearBoard() : clears the board after a game has been won 

    // -- _.winner(isDraw) : handles the winner UI screen
    // -- arguments:
    // -- -- isDraw: if true is passed the UI will render a tie screen.

    // -- _.winner(isDraw) : handles the winner UI screen
    // -- arguments:
    // -- -- isDraw: if true is passed the UI will render a tie screen.


    // - public methods
    // -- get(name) : returns a string or int of a private property.  
    // -- arguments:
    // -- -- name: argument is the key value to get the private property 

    // -- addRule(rule) : pushes new rule object to the private _.rules collection
    // -- arguments:
    // -- -- rule: a rule object

    // -- validateboard() : validates the game board by looping each rule and running the rule.validate() method


    // - event handlers
    // $('.box').click : handle click event on the game board boxs 
    // $('#btnStart').click : handle button on splash screen 
    // $('#btnNew').click : handle restart button on winning screen 


    function Board(players) {
      var self = this;

      this.boxes = $('.boxes > .box');
      this.fade = 400;

      var _ = {}
      _.players = [];
      _.players = players;
      _.rules = new Array();
      _.current = {}; 

      _.initPlayer = function() {
        _.current.binary = Math.floor((Math.random() * 2));;
        _.current.player = _.players[_.current.binary ];
        $( _.current.player.get('element') ).toggleClass('active');
      }
      _.initPlayer();

      _.changePlayer = function() {
        $( _.current.player.get('element') ).toggleClass('active');

        _.current.binary ^= 1;
        _.current.player = _.players[_.current.binary];
        $( _.current.player.get('element') ).toggleClass('active');

      }

      _.isDraw = function() {
        var count = 0;

        for (var i = 0, len = self.boxes.length; i < len; i++) {
          if( $(self.boxes[i]).hasClass('box-filled-1') || $(self.boxes[i]).hasClass('box-filled-2') ) {
            count ++;
          }
        }

        if(count === 9) {
          return true;
        }

        return false;
      }

      _.clearBoard = function() {
        for (var i = 0, len = self.boxes.length; i < len; i++) {
          $(self.boxes[i]).removeClass('box-filled-1 box-filled-2');
        }
      }

      _.winner = function(isDraw) {

        isDraw = typeof isDraw !== 'undefined' ? isDraw : false;

        if(isDraw === true) {
          $("#finish").addClass('screen-win-tie');
          $('.message').text('Tie!');
        } else {
          $("#finish").addClass(_.current.player.get('win') )
          $('.message').text('Winner!');
        }
        
        $('#board').fadeOut(this.fade, function(){
          $("#finish").fadeIn(this.fade);
          $( _.current.player.get('element') ).toggleClass('active');
           _.clearBoard();
        });

        
 
      }

      this.get = function(name) {
        return _[name];
      }

      this.addRule = function(rule) {
        _.rules.push(rule);
      }

      this.validateboard = function() {
        var valid = false;
        var draw = _.isDraw();

        if(draw === true) { test = true; }

        for(var rule of _.rules) {

          console.groupCollapsed(rule.type);

          valid = rule.validate( self.boxes, _.current.player );

          if(valid === true) {
            console.groupEnd();
            break;
          }

          console.groupEnd();
        }

        if(valid === true) {
          return true
        }

        return false;

      }

      $('.box').click(function(e) {

        $(this).removeClass( _.current.player.get('hover') );

        if( $(this).hasClass('box-filled-1') === false && $(this).hasClass('box-filled-2') === false) {
          
          var valid = false;
          var isDraw = false;
  
          $(this).addClass( _.current.player.get('active') );
  
          isDraw = _.isDraw();
  
          if(isDraw === true) {
            _.winner(true);
            return;
          }
  
          console.groupCollapsed( _.current.player.name );
          valid = self.validateboard();
          console.groupEnd();
  
          if(valid === true) {
            _.winner();
            return;
          }

          _.changePlayer();

        }
        

      });


      $('.box').hover(
        function() {
          if( $(this).hasClass('box-filled-1') === false && $(this).hasClass('box-filled-2') === false) {
            $(this).addClass( _.current.player.get('hover') )
          }
        }, 
        function() {
          $(this).removeClass( _.current.player.get('hover') );
        }
      );


      $('#btnStart').click(function() {
        $('#start').fadeOut(this.fade, function(){
          $("#board").fadeIn(this.fade);
          $( _.current.player.get('element') ).addClass('active');
        });
      });

      $('#btnNew').click(function() {
        _.initPlayer();
        $('#finish').fadeOut(this.fade, function(){
          $("#board").fadeIn(this.fade);
          $( _.current.player.get('element') ).addClass('active');
        });
         $("#finish").removeClass('screen-win-tie screen-win-one screen-win-two');
      });
      
      

    }


    // INIT GAME BOARD _________________________________________________________________________________________

    var board = new Board([ new Player('o'), new Player('x') ]);
    board.addRule( new Rule('row', { space : 1, count : 0, length : 6, increment : 3, total: 2 }) );
    board.addRule( new Rule('column', { space : 3, count : 0, length : 2, increment : 1, total: 6}) );
    board.addRule( new Rule('diagonal-right', { space : 4, count : 0, length : 2, increment : 1, total: 8 }) );
    board.addRule( new Rule('diagonal-left', { space : 2, count : 2, length : 2, increment : 1, start: 2, total: 4 }) );


  }(this);
