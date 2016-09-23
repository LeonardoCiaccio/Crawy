/*

    Grab all openloads links on http://www.altadefinizione01.co/

*/

( function(  ){

// --> This is my site ? 
    
    var site   = "http://www.altadefinizione01.co/",
        resite = new RegExp( "^" + site, "gi" );
    
    if( !location.href.match( resite ) ){
        
        alert( "Now open " + site + " then restart 'Crawy' !" );
        
        location.href = site;
        
        return false;
        
    }
    
// --> Crawy loaded ?
    
    if( typeof window.Crawy === "undefined" ){
        
        alert( "Please load 'Crawy' first then reload this plugin !" );
        
        return false;
        
    }
    
// --> Set commands
    
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
                            
            // --> Video title signature
                
                var title = domLoaded.querySelector( "#uwee h1" );
                
                title = ( title ) ? title.textContent : url ;
               
            // --> Check all openloads links
                
                var alllinks = domLoaded.querySelectorAll( "a[href^='https://openload.co/']" );

                var allopenloads = [];

                for( var i = 0; alllinks && i < alllinks.length; i++ ){

                   allopenloads.push( alllinks[ i ].href );

                }
            
            // --> Collect my source data, return null if not exist ... @important
                
                return ( allopenloads.length > 0 ) ? 
                    
                        { 
                    
                            url       : url,
                            title     : title, 
                            openloads : allopenloads 
                
                        } : null;

            }

        }
        
    // <-- Options 
        
    );
    
    alert( "(◔◡◔) Crawling ..." );
    
} )();