/*

    Export all sources crawled

*/

( function(  ){

// --> Crawy loaded ?
    
    if( typeof window.Crawy === "undefined" ){
        
        alert( "Please load 'Crawy' first then reload this command !" );
        
        return false;
        
    }

// --> Set commands
    
    Crawy.ExportAllSources();
        
} )();