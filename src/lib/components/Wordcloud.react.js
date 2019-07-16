import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * Wordcloud is a wordcloud component.
 * It takes in a text with words separated
 * by spaces and turns it into a cloud of
 * randomly placed words.
 *
 * Much of this code is taken from or inspired by: https://codepen.io/stevn/pen/JdwNgw
 */
export default class Wordcloud extends Component {

  /* =======================  HTML Container  =======================  */
  // Render the html that will contain the wordcloud
  render() {
      const {
        id,
        className,
        options,
        setProps,
        loading_state,
        text,
        style
      } = this.props;

      return (
          <div
            id={id}
            data-dash-is-loading={(loading_state && loading_state.is_loading) || undefined}
            className={className}
            style={style}>

          </div>
      );
  }

  /* =======================  JS Word Cloud  =======================  */
  // once the component has been rendered, add the wordcloud to it
  componentDidMount() {
    // Set up contants and variables
    const {
      id,
      className,
      minFontSize,
      maxFontSize,
      font,
      setProps,
      loading_state,
      text,
      style
    } = this.props;

    var i = 1;  // counts the words that have been placed. Used (mod number of colors) to assign colors of words
    var colors = ["#33638D", "#21908D", "#A0DA39", "#4CC26C", "#D2E21B", "#450559", "#46337F", "#3F4889"];  // Colors in the wordcloud. TODO: Make this a changeable prop
    var config = {
        trialNumber: 800, // number of placing attempts before moving on to the next word
        xWordPadding: .5, //spacing on left and right side of word (so that words don't touch)
        yWordPadding: .25, //spacing on top and bottom of word
    }
    var wordsDown = []; // list of words that have been placed
    var n = colors.length;

    // get dimensions of wordcloud
    var width = style.width;
    var height = style.height;
    width = width.substring(0, width.length - 2);
    height = height.substring(0, height.length - 2);

    // 2-d array, 1 = pixel filled, 0 = empty pixel
    var flags = new Array();
    for (var i = 0; i < height; ++i) {
      flags[i] = new Array();
      for (var j = 0; j < width; j++) {
        flags[i].push(0);
      }
    }
    // console.log(flags);

    // get word counts
    var words = getWordCounts(); // array of words, counts, and frequencies
    var maxCount = words[0].count; // number of occurances of most common word - used as comparison in determining font size later

    // locate cloud div, assign its position and font family
    var cloud = document.getElementById(id);
    cloud.style.position = "relative";
    cloud.style.fontFamily = font;

    // create canvas for word cloud and append it to the cloud div
    var traceCanvas = document.createElement("canvas");
    traceCanvas.width = cloud.offsetWidth;
    traceCanvas.height = cloud.offsetHeight;
    var traceCanvasCtx = traceCanvas.getContext("2d");
    cloud.appendChild(traceCanvas);

    // let the starting point of the spiral be in the center of the cloud div
    var startPoint = {
        x: cloud.offsetWidth / 2,
        y: cloud.offsetHeight / 2
    };


    // Place words on canvas
    (function placeWords() {
      /**
       * Place words on canvas.
       *
       * Create a word object out of each word, attempt to place
       * it at a point on the spiral (if it doesn't fit, try a
       * new location), if it fits, place it.
       */
        for (var i = 0; i < words.length; i += 1) {
            var word = createWordObject(words[i].word, words[i].count, words[i].freq);
            for (var j = 0; j < config.trialNumber; j++) {
                var point = generatePointInShape(j);
                var x = point[0];
                var y = point[1];
                if (!intersect2(word, startPoint.x + x, startPoint.y + y)) {
                  placeWord(word, startPoint.x + x, startPoint.y + y);
                  // console.log(word);
                  // console.log(flags);
                  // console.log(words[i].word);
                  break;
                }
            }
        }
        // console.log(flags);
    })();


  /* =======================  Functions  =======================  */

    function getWordCounts() {
      /**
       * Returns an array of words and their frequencies,
       * sorted in order of decreasing count
       */
      var words = text.split(/\s/);
      var countMap = [];
      var numWords = 0;

      // create hashmap associating a word (key) with a count (value)
      words.forEach(function(w) {
          if (!countMap[w]) {
              countMap[w] = 0;
          }
          countMap[w] += 1;
          numWords += 1;
      })

      // convert hashmap to array for easier sorting, add in freq
      var array = [];
      for (var w in countMap) {
        array.push({
          word: w,
          count: countMap[w],
          freq: Math.round(1000*(countMap[w]/numWords))/1000
        });
      }
      // sort by decreasing count
      array.sort((a, b) => (b.count > a.count) ? 1 : -1)
      return array;
    }

    function createWordObject(word, count, freq) {
      /**
       * Create a word object with fontsize based on count
       * relative to the count of the most common word
       *
       * :param word: text to be shown in the Wordcloud
       * :param count: count of the word in the text
       * :param freq: frequency of the word in the text
       */
        var wordContainer = document.createElement("div");
        wordContainer.style.position = "absolute";
        // assign font size on scale from minFontSize to maxFontSize
        wordContainer.style.fontSize = (count/maxCount)*maxFontSize + minFontSize + "px";
        // assign color from list (rotates through colors for variety)
        wordContainer.style.color = colors[i%n];
        wordContainer.style.lineHeight = 0.8;
        wordContainer.className = "tooltip";
        wordContainer.appendChild(document.createTextNode(word));
        var tooltip = document.createElement("span");
        tooltip.className = "tooltiptext";
        tooltip.style.fontSize = 12 + "px";
        tooltip.style.lineHeight = 1;
        tooltip.appendChild(document.createTextNode("Count: " + count + "\n Freq: " + freq));
        wordContainer.appendChild(tooltip);
        i += 1;
        return wordContainer;
    }

    function placeWord(word, x, y) {
      /**
       * Place the word on the canvas at location generated
       * on the spiral by generatePointInShape() about origin
       *
       * :param word: word object to be placed
       * :param x: x location (relative to origin)
       * :param y: y location (relative to origin)
       */
        cloud.appendChild(word);
        word.style.left = x - word.offsetWidth/2 + "px";
        word.style.top = y - word.offsetHeight/2 + "px";
        var rect = word.getBoundingClientRect();
        var left = Math.floor(rect.left);
        var right = Math.ceil(rect.right);
        var top = Math.floor(rect.top);
        var bottom = Math.ceil(rect.bottom);

        // add word to list of words that have been placed
        wordsDown.push(rect);
        for (var i=left; i<right; i++) {
          for (var j=top; j<bottom; j++) {
            flags[j][i] = 1;
            // console.log("i: " + i + " j: " + j + " flags[j][i]" + flags[j][i]);
          }
        }
    }

    function generatePointInShape(t) {
      /**
       * generates a point a small distance away from an
       * elliptic spiral
       *
       * The spiral is defined parametrically
       *
       * :param t: incrementally increased by the intersect() function
       */
        var x = 1.5*(t)*Math.cos(t) + Math.random()*50-38;
        var y = (t)*Math.sin(t) + Math.random()*76-38;
        return [x, y];
    }

    function intersect(word, x, y) {
      /**
       * Places word, records location, removes word.
       * If the word would not intersect with any other word
       * or any border, return false, otherwise return true.
       *
       * :param word: word object to be placed
       * :param x: x location of word
       * :param y: y location of word
       */
        cloud.appendChild(word);

        word.style.left = x - word.offsetWidth/2 + "px";
        word.style.top = y - word.offsetHeight/2 + "px";

        var currentWord = word.getBoundingClientRect();

        cloud.removeChild(word);

        for(var i = 0; i < wordsDown.length; i+=1){
            var comparisonWord = wordsDown[i];

            if(outOfBounds(currentWord) || !(currentWord.right + config.xWordPadding < comparisonWord.left - config.xWordPadding ||
               currentWord.left - config.xWordPadding > comparisonWord.right + config.xWordPadding ||
               currentWord.bottom < comparisonWord.top ||
               currentWord.top > comparisonWord.bottom )){

                return true;
            }
        }

        return false;
    }

    function intersect2(word, x, y) {
      cloud.appendChild(word);

      word.style.left = x - word.offsetWidth/2 + "px";
      word.style.top = y - word.offsetHeight/2 + "px";

      var currentWord = word.getBoundingClientRect();
      var left = Math.floor(currentWord.left);
      var right = Math.ceil(currentWord.right);
      var top = Math.floor(currentWord.top);
      var bottom = Math.ceil(currentWord.bottom);
      // console.log("bottom: " + bottom)
      cloud.removeChild(word);

      // if (outOfBounds(currentWord)) {
      //   return true;
      // }
      // else {
        for (var i = left; i < right; i++) {
          //top
          if (flags[top][i] == 1) {
            return true;
          }
          //bottom
          if (flags[bottom][i] == 1) {
            return true;
          }
        }

        for (var j = top; j < bottom; j++) {
          //left
          if (flags[j][left] == 1) {
            return true;
          }
          //right
          if (flags[j][right] == 1) {
            return true;
          }
        }


      return false;

    }

    function outOfBounds(currentWord) {
      /**
       * Checks to see if currentWord goes out of outOfBounds
       * Returns true if yes, otherwise false
       *
       * :param currentWord: word object to be placed
       */
        // var canvas = cloud.getBoundingClientRect();
        if (currentWord.right + config.xWordPadding >= width-2 || currentWord.bottom + config.yWordPadding >= height-2 ||
            currentWord.left - config.xWordPadding <= 0 || currentWord.top - config.yWordPadding <= 0) {
          return true;
        }
        return false;
    }


  }
}

/**
 * Default prop values for minFontSize, maxFontSize, font, and style
 */
Wordcloud.defaultProps = {
  minFontSize: 10,
  maxFontSize: 160,
  font: "sans-serif",
  style: {'width':'1100px', 'height':'800px'}
};

Wordcloud.propTypes = {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id: PropTypes.string,

  /**
   * The className used to identify the component
   */
  className: PropTypes.string,

  /**
   * The minimum font size for the word cloud.
   * Default: 10
   */
  minFontSize: PropTypes.number,

  /**
   * The maximum font size for the word cloud.
   * Default: 160
   */
  maxFontSize: PropTypes.number,

  /**
   * The font family for the word cloud.
   * Defualt: "sans-serif"
   */
  font: PropTypes.string,

  /**
   * The words to be put into the word cloud.
   * These should be in a string with no extra
   * symbols.
   *
   * Note: the word cloud IS case sensitive, so
   * make the text all lower-case if necessary
   */
  text: PropTypes.string,

  /**
   * CSS for the wordcloud. Width and height should be set
   * Default: {'width':'1100px', 'height':'800px'}
   */
  style: PropTypes.object,

  /**
   * Don't change this. It allows the props to load.
   */
  setProps: PropTypes.func,

  loading_state: PropTypes.shape({
    is_loading: PropTypes.bool,

    prop_name: PropTypes.string,

    component_name: PropTypes.string
  })
};
