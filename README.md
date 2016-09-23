Crawy
======

Crawler without installations or libs like jquery, only bookmarklets pure javascript.
Compatible with all modern browser, desktop and mobile.

1. Install Crawly, import bookmarklets with your browser ( Bundle folder )

2. Watch this [ video ](http://j.mp/2d5ZMG6) 

```javascript

Crawy( 
        
    // --> Options    
        
        { 
            
        // --> Pause for calls, default = 500
            
            pause         : 100,
            
        // --> Show all data score, default = false
            
            autoscore     : false,
            
        // --> Only Pages allowed to scan source, default []
            
            pagesallowed  : [], 
            
        // --> Pages not allowed to scan source, default []
            
            pagesnotallowed  : [], 
            
        // --> Script on DOM page loaded, custom script, default = function(){}
            
            sourcecontext : function( url, domLoaded ){
            
                // 'url' of candidate page crawled
                // 'domLoaded' DOM of candidate page crawled
                
                // Example domLoaded.querySelectorAll( "a" );
                //  find all 'a' element on page crawled then you can customize your candidate source
            
                // Return JSON elements or null
            
            }
            
        }
        
    // <-- Options 
        
    );




Crawy.Stop() // Stop crawling process

Crawy.Score() // Show current score crawling

Crawy.ToggleAutoscore()  // Enable/Disable current score crawling on every call

Crawy.ExportAllLinks() // Export to JSON current link crawled

Crawy.ExportAllSources() // Export to JSON current sources crawled

```

With this commands you can easly use browser console, or use bookmarklets shortchuts in bundle folder.


