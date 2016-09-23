/*

    Start crawling with default settings, grab all links

*/

( function(  ){

// --> Crawy loaded ?
    
    if( typeof window.Crawy === "undefined" ){
        
        alert( "Please load 'Crawy' first then reload this plugin !" );
        
        return false;
        
    }

// --> Set commands
    
    Crawy();
    
} )();