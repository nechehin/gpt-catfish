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
<script async='async' src="https://cdn.jsdelivr.net/gh/nechehin/gpt-catfish@latest/googletag-catfish.min.js"></script>
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

### Default mode
   
Set bottom mode as default
```js
catfish
    .addFullscreenModeSlot('/your_slot_name', [320, 480])
    .setDefaultModeBottom()
    .render();
```

Set fullscreen mode as default
```js
catfish
    .addBottomModeSlot('/your_slot_name', [320, 100])
    .setDefaultModeFullscreen()
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

### z-index

Set catfish z-index

```js
catfish
    .zIndex('999')
    .addFullscreenModeSlot('/your_slot_name', [320, 480])
    .render();
```

### Close button config

use next methods for close button configuration:

#### Position
- bottomModeCloseButtonPosition({Object} position)
- fullscreenModeCloseButtonPosition({Object} position)

#### Size
- bottomModeCloseButtonSize({String} size)
- fullscreenModeCloseButtonSize({String} size)

#### Defaults

```js
catfish.bottomModeCloseButtonPosition({ top: '-15px', left: '5px' });
catfish.bottomModeCloseButtonSize('25px');

catfish.fullscreenModeCloseButtonPosition({ top: '5px', left: '5px' });
catfish.fullscreenModeCloseButtonSize('25px');
```

#### Example
Show close button on right side for bottom mode:
```js
catfish
    .addBottomModeSlot('/your_slot_name', [320, 100])
    .bottomModeCloseButtonPosition({ top: '-15px', right: '5px' })
    .render();
```

### Events
Available events for listen:
- rendered (catfish.EVENTS.RENDERED) - fire after ads was rendered
- closed (catfish.EVENTS.CLOSED) - fire after ads was closed
- empty (catfish.EVENTS.EMPTY) - fire if ads empty

```js
catfish
    .addFullscreenModeSlot('/your_slot_name', [320, 480])
    .addEventListener(catfish.EVENTS.RENDERED, function(){ 
        console.log('event: ads rendered'); 
    })
    .render();
```

### Enable debug log

```js
catfish
    .debug(true)
    .addFullscreenModeSlot('/your_slot_name', [320, 480])
    .render();
```

also, you can enable debug by ?gpt-catfish-debug query param

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
             .zIndex('999')
             .addWidth(0, 480, function(){
                 this.addFullscreenModeSlot('/your_slot_name', [320, 480]);
                 this.addBottomModeSlot('/your_slot_name', [320, 100]);
                 this.setDefaultModeBottom();
                 this.bottomModeCloseButtonPosition({ top: '-15px', right: '5px' });
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
<script async='async' src="https://cdn.jsdelivr.net/gh/nechehin/gpt-catfish@latest/googletag-catfish.min.js"></script>
```  
