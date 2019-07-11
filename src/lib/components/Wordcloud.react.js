import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * ExampleComponent is an example component.
 * It takes a property, `label`, and
 * displays it.
 * It renders an input with the property `value`
 * which is editable by the user.
 */
export default class Wordcloud extends Component {
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
      // alert("rendering");
      return (
          <div
            id={id}
            data-dash-is-loading={(loading_state && loading_state.is_loading) || undefined}
            className={className}
            style={style}>

          </div>
      );
  }

  componentDidMount() {
    // alert("drawing");
    const {
      id,
      className,
      options,
      setProps,
      loading_state,
      text,
      style
    } = this.props;

    var i = 1;
    var wordCount=0;
    var colors = ["#33638D", "#21908D", "#A0DA39", "#4CC26C", "#D2E21B", "#450559", "#46337F", "#3F4889"];
    var config = {
        trace: true,
        shapeResolution: 1, //Lower = better resolution
        trialNumber: 360 * 5,
        lineHeight: 0.8,
        xWordPadding: .5,
        yWordPadding: .5,
        font: "sans-serif"
    }
    var width = style.width;
    var height = style.height;
    width = width.substring(0, width.length - 2);
    height = height.substring(0, height.length - 2);

    // alert(id);
    function getFreqs() {
      // var text = this.props.text;
      var words = text.split(/\s/);
      var freqMap = [];
      var wordCount=0;
      words.forEach(function(w) {
          if (!freqMap[w]) {
              freqMap[w] = 0;
          }
          freqMap[w] += 1;
          wordCount += 1;
      })

      var array = [];
      for (var w in freqMap) {
        array.push({
          word: w,
          freq: freqMap[w],
          relFreq: freqMap[w]/wordCount
        });
      }
      array.sort((a, b) => (b.freq > a.freq) ? 1 : -1)
      return array;
    }

    var words = getFreqs();
    console.log(words);
    var cloud = document.getElementById(id);
    cloud.style.position = "relative";
    cloud.style.fontFamily = config.font;

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

    function createWordObject(word, freq, relFreq) {

        var wordContainer = document.createElement("div");
        wordContainer.style.position = "absolute";
        wordContainer.style.fontSize = relFreq*width + "px";
        wordContainer.style.color = colors[i%n];
        wordContainer.style.lineHeight = config.lineHeight;
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

    function generatePointInShape() {

        var angle = Math.random() * height;
        var x = Math.random() * width;
        var y = Math.random() * height;
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
               currentWord.bottom + config.yWordPadding < comparisonWord.top - config.yWordPadding ||
               currentWord.top - config.yWordPadding > comparisonWord.bottom + config.yWordPadding )){

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
    /* =======================  END PLACEMENT FUNCTIONS =======================  */





    /* =======================  LETS GO! =======================  */
    (function placeWords() {
        for (var i = 0; i < words.length; i += 1) {
            var word = createWordObject(words[i].word, words[i].freq, words[i].relFreq);
            if (i==0) {
              placeWord(word, startPoint.x, startPoint.y);
            }
            else {
              for (var j = 0; j < config.trialNumber; j++) {
                  // alert(j);
                  //If the spiral function returns true, we've placed the word down and can break from the j loop
                  var point = generatePointInShape();
                  var x = point[0];
                  var y = point[1];
                  if (!intersect(word, x, y)) {
                    placeWord(word, x, y);
                    // return true;
                    break;
                  }
              }
            }
        }
    })();
  }
}

Wordcloud.defaultProps = {
options: [{hoverInfo: "", colors: ["#33638D", "#21908D", "#A0DA39", "#4CC26C", "#D2E21B", "#450559", "#46337F", "#3F4889"]}],
};

Wordcloud.propTypes = {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id: PropTypes.string,

  className: PropTypes.string,

  options: PropTypes.arrayOf(
    PropTypes.exact({
      hoverInfo: PropTypes.string,

      colors: PropTypes.arrayOf(PropTypes.string)
    })
  ),

  text: PropTypes.string,

  style: PropTypes.object,

  setProps: PropTypes.func,

  loading_state: PropTypes.shape({
    is_loading: PropTypes.bool,

    prop_name: PropTypes.string,

    component_name: PropTypes.string
  })
};
