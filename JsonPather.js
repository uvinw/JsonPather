/**
 * Created by uvinw
 */

JsonPather = window.JsonPather || {};

JsonPather = function() {

    var line, startingLine = 1, valueArr, keyArr, pathSelectorContainer, windowHeight = 600, selectionLimit = 1000, jsonSelectionCounter, oddLineColor = "", evenLineColor = "#feffff", keyColor = "#085fdd", valueColor = "#0e1604";

    resetEverything = function () {
        valueArr = [];
        keyArr = [];
        jsonSelectionCounter = 0;
        line = startingLine;
    };

    startJSONPather = function(jsonString, targetDivId) {
        resetEverything();
        pathSelectorContainer = document.createElement('div');
        pathSelectorContainer.style.cssText = "overflow-y: scroll; height:"+windowHeight+"px;";
        var obj;
        try {
            obj = JSON.parse(jsonString);
        } catch (e) {
            console.error("Error!: Invalid JSON string supplied.");
            return;
        }

        if (obj === null || obj === undefined) {
            console.error("Error!: JSON is null.");
            return;
        } else if (Object.prototype.toString.call(obj) === '[object Array]') {
            pathSelectorContainer.appendChild(generateLine("root", line, 0, "", "", "array_init"))
        } else {
            pathSelectorContainer.appendChild(generateLine("root", line, 0, "", "", "json_init"))
        }
        valueArr.push(obj);
        keyArr.push(null);
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var isFirstKeyArray;
                if (Object.prototype.toString.call(obj) === '[object Array]') {
                    //obj is an array
                    isFirstKeyArray = true;
                } else {
                    //obj is a JSON object
                    isFirstKeyArray = false;
                }
                parseJSONObj(key, obj[key], 2, "$", isFirstKeyArray);
            }
        }
        line++;
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            pathSelectorContainer.appendChild(generateLine("", line, 0, "", "", "array_end"))
        } else {
            pathSelectorContainer.appendChild(generateLine("", line, 0, "", "", "json_end"))
        }
        valueArr.push(null);
        keyArr.push(null);

        var targetDiv = document.getElementById(targetDivId);
        targetDiv.appendChild(pathSelectorContainer);
    };


    /*
     *   Function to escape HTML tags and return as string
     */
    escapeHTML = function(html) {
        var text = document.createTextNode(html);
        var div = document.createElement('div');
        div.appendChild(text);
        return div.innerHTML;
    };

    /*
     *  Recursive function to traverse the JSON object and call the relevant line generators
     */
    parseJSONObj = function(recKey, recValue, indent, path, isNextKeyArrayIndex) {
        line++;
        var lineColor = getLineBackColor(line);

        if (isNextKeyArrayIndex) {
            path += "[" + recKey + "]";
        } else {
            path += "['" + recKey + "']";
        }

        valueArr.push(recValue);
        keyArr.push(recKey);

        var isArray = false;
        if (typeof recValue == 'object') {
            if (recValue === null || recValue === undefined) {
                //value is null => do nothing
            } else if (Object.prototype.toString.call(recValue) === '[object Array]') {
                //value is an array
                isArray = true;
                isNextKeyArrayIndex = true;
                pathSelectorContainer.appendChild(generateLine(path, line, indent, recKey, recValue, "array_start"));
            } else {
                //value is a JSON object
                isNextKeyArrayIndex = false;
                pathSelectorContainer.appendChild(generateLine(path, line, indent, recKey, recValue, "json_start"));
            }
            for (var innerKey in recValue) {
                if (recValue.hasOwnProperty(innerKey)) {
                    parseJSONObj(innerKey, recValue[innerKey], indent + 2, path, isNextKeyArrayIndex);
                }
            }
            line++;
            valueArr.push(null);
            keyArr.push(null);

            if (isArray) {
                pathSelectorContainer.appendChild(generateLine("", line, indent, "", "", "array_end"));
            } else {
                pathSelectorContainer.appendChild(generateLine("", line, indent, "", "", "json_end"));
            }
        }
        else {
            // key is just a value
            pathSelectorContainer.appendChild(generateLine(path, line, indent, recKey, recValue, "value"));
        }
    };

    /*
     * Generate a line of the JSON path selector
     */
    generateLine = function(path, line, indent, innerKey, innerValue, innerType) {
        var lineColor = getLineBackColor(line);
        var lineDiv = document.createElement('div');
        lineDiv.className = "lineDivResp";
        lineDiv.setAttribute("style", "background-color: " + lineColor);
        lineDiv.setAttribute("id", line);

        var gutterDiv = document.createElement('div');
        gutterDiv.className = "gutterDivResp";
        gutterDiv.style.cssText = "display:table-cell; width: 50px; background-color:#E3E4E4; vertical-align: middle;";

        var lineNumberElement = document.createElement('div');
        lineNumberElement.className = "lineNumberElementResp";
        var removeSelectable = "-webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; -o-user-select: none; user-select: none; cursor: default;";
        lineNumberElement.style.cssText = removeSelectable + "float: center; width: 100%; vertical-align:middle; display:inline; font-family: 'Varela Round', sans-serif;";
        lineNumberElement.innerHTML = line;

        var checkboxDiv = document.createElement('div');
        checkboxDiv.className = "checkboxDivResp";
        checkboxDiv.style.cssText = "background-color:#E3E4E4;  display: inline; float: right;";

        var checkboxElement = document.createElement('input');
        checkboxElement.setAttribute("type", "checkbox");
        checkboxElement.setAttribute("data-path", path);
        checkboxElement.setAttribute("onclick", "JsonPather.handleClick(this);");
        checkboxElement.className += " jsonPathCheckBox";
        checkboxElement.style.cssText = "vertical-align:middle; margin: 0px 5px 0px 0px !important";

        var paraDiv = document.createElement('div');
        paraDiv.className = "paraDivResp";
        paraDiv.style.cssText = " display: table-cell;";

        var paraKeyElement = document.createElement('p');
        paraKeyElement.style.cssText = "margin-left:5px; padding-left: " + indent + "em; vertical-align:middle; font-family: 'Varela Round', sans-serif; color:"+keyColor+"; font-weight:bold; display:inline; ";
        //paraKeyElement.style.cssText = "margin-left:5px; padding-left: " + indent + "em; vertical-align:middle; font-family:courier; color:#085fdd; font-weight:bold; display:inline; ";
        var paraValueElement;
        if (innerType === "array_init") {
            paraKeyElement.innerHTML = escapeHTML(innerKey) + "[";
            checkboxElement.setAttribute("data-line", line);
        } else if (innerType === "array_start") {
            paraKeyElement.innerHTML = escapeHTML(innerKey) + " : [";
            checkboxElement.setAttribute("data-line", line);
        } else if (innerType === "array_end") {
            paraKeyElement.innerHTML = "]";
            checkboxElement.disabled = true;
        } else if (innerType === "json_init") {
            paraKeyElement.innerHTML = escapeHTML(innerKey) + "{";
            checkboxElement.setAttribute("data-line", line);
        }  else if (innerType === "json_start") {
            paraKeyElement.innerHTML = escapeHTML(innerKey) + " : {";
            checkboxElement.setAttribute("data-line", line);
        } else if (innerType === "json_end") {
            paraKeyElement.innerHTML = "}";
            checkboxElement.disabled = true;
        } else if (innerType === "value") {
            paraKeyElement.innerHTML = escapeHTML(innerKey) + " : ";
            checkboxElement.setAttribute("data-line", line);
            var paraValueElement = document.createElement('p');
            paraValueElement.style.cssText = "color:"+valueColor+"; font-weight:bold; display:inline; font-family:courier;";
            paraValueElement.innerHTML = escapeHTML(innerValue);
        }
        //adding the gutter
        gutterDiv.appendChild(lineNumberElement);
        checkboxDiv.appendChild(checkboxElement);
        gutterDiv.appendChild(checkboxDiv);
        lineDiv.appendChild(gutterDiv);
        paraDiv.appendChild(paraKeyElement);
        if (innerType === "value") {
            paraDiv.appendChild(paraValueElement);
        }
        lineDiv.appendChild(paraDiv);
        return lineDiv;
    };

    logPath = function (e) {
        var check = document.getElementsByClassName("jsonPathCheckBox");
        var selected = [];
        for (var c = 0; c < check.length; c++) {
            if (check[c].checked) {
                var selection = {
                    key: keyArr[(check[c].getAttribute('data-line')) - 1],
                    value: valueArr[(check[c].getAttribute('data-line')) - 1],
                    path: check[c].getAttribute('data-path')
                };
                selected.push(selection);
            }
        }
        return selected;
    };

    /*
     * Function to get alternating line background colors
     */
    getLineBackColor = function(line) {
        if (line % 2 === 0)
            return evenLineColor;
        else
            return oddLineColor;
    };

    /*
     *   Function to change the line background when a checkbox is selected
     */
    handleClick = function(item) {
        if (item.getAttribute('data-line') === null) {
            item.checked = false;
            return;
        }
        var line = item.getAttribute('data-line');
        if (item.checked && jsonSelectionCounter < parseInt(selectionLimit)) {
            //item will be checked
            jsonSelectionCounter++;
            document.getElementById(line).style.background="#d9e9fa";
        } else if (item.checked) {
            //item will not be checked
            item.checked = false;
        }
        else {
            //item will be unchecked
            jsonSelectionCounter--;
            if (line % 2 === 0)
                document.getElementById(line).style.background = "#feffff";
            else
                document.getElementById(line).style.background = "#fafafa";
        }
    };

    //methods exposed in the api
    setHeight = function(height) {
        windowHeight = height;
    };

    keys = function() {
        return keyArr;
    };
    values = function() {
        return valueArr;
    };
    selectionCount = function() {
        return jsonSelectionCounter;
    };
    setLimit = function(limit) {
        selectionLimit = limit;
    };
    setLineColors = function(odd, even) {
        oddLineColor = odd;
        evenLineColor = even;
    };
    setTextColors = function(key, value) {
        keyColor = key;
        valueColor = value;
    };
    setStartingLine = function(num) {
        startingLine = num;
    };

    return {
        "build" :  startJSONPather,
        "calculate" :  logPath,
        "handleClick" :  handleClick,
        "keys" :  keys,
        "values" :  values,
        "setHeight" : setHeight,
        "setLimit" : setLimit,
        "selectionCount" : selectionCount,
        "setLineColors" : setLineColors,
        "setTextColors" : setTextColors,
        "setStartingLine" : setStartingLine
    };

}();


