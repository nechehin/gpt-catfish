# Google Publisher Tag Ads Catfish implementation

Show catfish banner with close button

Supported modes:
- bottom (fixed to bottom)
- fullscreen

 ## How to use (simple example)
 
 Add anywhere to your page:
 
 ```html
 <script>
     // Async init code
     (function(w,c){
         w[c] = function(catfish){
             
             // Init catfish code
             catfish
                .addFullscreenModeSlot('/your_slot_name', [320, 480]);
                .render();
                
         }
     })(window, 'google-tag-catfish');
 </script>
  ```
  
Add to your page before close body tag
   
```html
<!-- Load GPT script, if not loaded yet-->
<script async='async' src='https://www.googletagservices.com/tag/js/gpt.js'></script>
<!-- Load gpt-catfish script from CDN -->
<script async='async' src="https://cdn.jsdelivr.net/gh/nechehin/gpt-catfish@0.0.2/googletag-catfish.min.js"></script>
```
   
## Advanced configuration
   
### Add slots
   
Add fullscreen mode slot
```js
catfish
    .addFullscreenModeSlot('/your_slot_name', [320, 480])
    .render();
```

Add fixed bottom mode slot
```js
catfish
    .addBottomModeSlot('/your_slot_name', [320, 100])
    .render();
```
   
Add multiple mode slots
```js
catfish
    .addFullscreenModeSlot('/your_slot_name', [320, 480])
    .addBottomModeSlot('/your_slot_name', [320, 100])
    .render();
```   

### Add slots only for small (or any sizes) screens

```js
catfish
    .addWidth(0, 480, function(){
        this.addFullscreenModeSlot('/your_slot_name', [320, 480]);
        this.addBottomModeSlot('/your_slot_name', [320, 100]);
    })
    // addWidth with other sizes
    .render();
```   

### Autoclose timeout

Banner will be closed after 5s

```js
catfish
    .autoCloseTimeout(5000)
    .addFullscreenModeSlot('/your_slot_name', [320, 480])
    .render();
```

### Background color

Set white background

```js
catfish
    .backgroundColor('#fff')
    .addFullscreenModeSlot('/your_slot_name', [320, 480])
    .render();
```

### Enable debug log

```js
catfish
    .debug(true)
    .addFullscreenModeSlot('/your_slot_name', [320, 480])
    .render();
```

### Full example

```html
<!-- In your head -->
<script>
    var googletag = googletag || {};
    googletag.cmd = googletag.cmd || [];
</script>
        
<!-- Anywhere in your page -->        
<script>
(function(w,c){
     w[c] = function(catfish){
         
         catfish
             .debug(true)
             .autoCloseTimeout(5000)
             .backgroundColor('#fff')
             .addWidth(0, 480, function(){
                 this.addFullscreenModeSlot('/your_slot_name', [320, 480]);
                 this.addBottomModeSlot('/your_slot_name', [320, 100]);
             })
             .addWidth(481, 640, function(){
                 this.addFullscreenModeSlot('/your_slot_name', [480, 480]);
                 this.addBottomModeSlot('/your_slot_name', [480, 100]);
             })
             .render();
            
     }
})(window, 'google-tag-catfish');
</script>   
<script async='async' src='https://www.googletagservices.com/tag/js/gpt.js'></script>
<script async='async' src="https://cdn.jsdelivr.net/gh/nechehin/gpt-catfish@0.0.2/googletag-catfish.min.js"></script>
```  