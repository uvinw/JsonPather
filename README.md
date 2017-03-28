# JsonPather
Display and selectively calculate JSON paths

(Using vanilla JS - no dependencies)

![](https://zippy.gfycat.com/AstonishingJaggedHuemul.gif)

For a more precise example, check the HTML file in the repo.

### Usage:
```
- JsonPather.setHeight(300)
- JsonPather.setLimit(5)
- JsonPather.setLineColors("#d9e9fa")
- JsonPather.setTextColors(keyColor, valueColor)
- JsonPather.setStartingLine(0)
- JsonPather.build(sampleJsonString, "myDiv")
```


### Functions:
```
- JsonPather.calculate()  - returns path/keys/values
- JsonPather.keys() - returns selected keys     
- JsonPather.values() - returns selected values 
- JsonPather.selectionCount() - returns the selection count
```
