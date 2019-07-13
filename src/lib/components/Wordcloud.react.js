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
        trialNumber: 1800, // number of placing attempts before moving on to the next word
        xWordPadding: .5, //spacing on left and right side of word (so that words don't touch)
        yWordPadding: .25, //spacing on top and bottom of word
    }
    // dimensions of wordcloud
    var width = style.width;
    var height = style.height;
    width = width.substring(0, width.length - 2);
    height = height.substring(0, height.length - 2);

    var words = getFreqs();
    var maxFreq = words[0].freq;
    console.log(words);
    var cloud = document.getElementById(id);
    cloud.style.position = "relative";
    cloud.style.fontFamily = font;

    var traceCanvas = document.createElement("canvas");
    traceCanvas.width = cloud.offsetWidth;
    traceCanvas.height = cloud.offsetHeight;
    var traceCanvasCtx = traceCanvas.getContext("2d");
    cloud.appendChild(traceCanvas);

    var startPoint = {
        x: cloud.offsetWidth / 2,
        y: cloud.offsetHeight / 2
    };

    var wordsDown = [];
    // var colorArray = options.colors;
    var n = colors.length;






    /* =======================   =======================  */
    (function placeWords() {
        for (var i = 0; i < words.length; i += 1) {
            var word = createWordObject(words[i].word, words[i].freq);
            for (var j = 0; j < config.trialNumber; j++) {
                var point = generatePointInShape(j);
                var x = point[0];
                var y = point[1];
                if (!intersect(word, startPoint.x + x, startPoint.y + y)) {
                  placeWord(word, startPoint.x + x, startPoint.y + y);
                  console.log(words[i].word);
                  break;
                }
            }
        }
    })();


    /* =======================  Functions  =======================  */
    // Returns an array of words and their frequencies, sorted in order of decreasing frequency
    function getFreqs() {
      var words = text.split(/\s/);
      var freqMap = [];
      // create hashmap associating a word (key) with a frequency (value)
      words.forEach(function(w) {
          if (!freqMap[w]) {
              freqMap[w] = 0;
          }
          freqMap[w] += 1;
      })

      // convert hashmap to array for easier sorting
      var array = [];
      for (var w in freqMap) {
        array.push({
          word: w,
          freq: freqMap[w]
        });
      }
      // sort by decreasing frequency
      array.sort((a, b) => (b.freq > a.freq) ? 1 : -1)
      return array;
    }

    function createWordObject(word, freq) {

        var wordContainer = document.createElement("div");
        wordContainer.style.position = "absolute";
        // wordContainer.style.fontSize = relFreq*width + "px";
        wordContainer.style.fontSize = (freq/maxFreq)*maxFontSize + minFontSize + "px";
        wordContainer.style.color = colors[i%n];
        wordContainer.style.lineHeight = 0.8;
        wordContainer.className = "tooltip";
    /*    wordContainer.style.transform = "translateX(-50%) translateY(-50%)";*/
        wordContainer.appendChild(document.createTextNode(word));
        var tooltip = document.createElement("span");
        tooltip.className = "tooltiptext";
        tooltip.style.fontSize = 12 + "px";
        tooltip.appendChild(document.createTextNode(freq));
        wordContainer.appendChild(tooltip);
        i += 1;
        return wordContainer;
    }

    function placeWord(word, x, y) {

        cloud.appendChild(word);
        word.style.left = x - word.offsetWidth/2 + "px";
        word.style.top = y - word.offsetHeight/2 + "px";

        wordsDown.push(word.getBoundingClientRect());
    }

    function trace(x, y) {
    //     traceCanvasCtx.lineTo(x, y);
    //     traceCanvasCtx.stroke();
        traceCanvasCtx.fillRect(x, y, 1, 1);
    }

    function generatePointInShape(i) {
        // var t = i/10;
        var x = 1.5*(i)*Math.cos(i) + Math.random()*50-38;
        var y = (i)*Math.sin(i) + Math.random()*76-38;
        // var x = Math.random() * width;
        // var y = Math.random() * height;
        return [x, y];
    }

    function intersect(word, x, y) {
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

    function outOfBounds(currentWord) {
        var canvas = cloud.getBoundingClientRect();
        if (currentWord.right + config.xWordPadding > canvas.right || currentWord.bottom + config.yWordPadding > canvas.bottom ||
            currentWord.left - config.xWordPadding < 0 || currentWord.top - config.yWordPadding < 0) {
          return true;
        }
        return false;
    }





  }
}

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

  className: PropTypes.string,

  minFontSize: PropTypes.number,

  maxFontSize: PropTypes.number,

  font: PropTypes.string,

  text: PropTypes.string,

  style: PropTypes.object,

  setProps: PropTypes.func,

  loading_state: PropTypes.shape({
    is_loading: PropTypes.bool,

    prop_name: PropTypes.string,

    component_name: PropTypes.string
  })
};
