/*

    Crawy 1.0.2 by Leonardo Ciaccio
    
    License MIT + Ask me your request !

    ( Email )[ leonardo.ciaccio@gmail.com ]
    ( Facebook )[ m.me/leonardo.ciaccio ]

*/


( function( $, tools ){
    
    "use strict";
    
    var version = "1.0.2";
    
    var CrawyState = {
        
        enjoy    : "(̶◉͛‿◉̶)",
        happy    : "(◔◡◔)",
        nothappy : "(˘︹˘)",
        what     : "(⊙.⊙(☉̃ₒ☉)⊙.⊙)",
        yesss    : "(>‿◠)",
        ehmm     : "(ㆆ_ㆆ)"
        
    };
    
// --> Test browser feature
    
    var passed = false;
    
    try{
        
        if( 
            typeof document.querySelectorAll !== "undefined" && 
            String.prototype.trim                            &&
            Array.prototype.indexOf                          &&
            tools.GetXHR() !== null                          &&
            window.File && window.FileReader && window.FileList && window.Blob
          )
            passed = true;
                
        
    }catch( e ){
        
        // TODO
        
    }
    
    if( !passed ){
        
        alert( CrawyState.what + " This browser not support 'Crawy' feature !" );
        throw new Error( CrawyState.what + " This browser not support 'Crawy' feature !" );
        
    } 

// <-- Test browser feature, passed !
    

// --> Extend some objects
    
    Array.prototype.Unique = function( value ){
                
        if( this.indexOf( value ) < 0 )this.push( value );
        
        return this;
        
    };
    
    Array.prototype.OnlyUnique = function(){
                
        var newthis = [];
            
        for( var i = 0; i < this.length; i++ ){
            
            newthis.Unique( this[ i ] );
            

        }

        return newthis;
        
    };
    
    Array.prototype.MergeUnique = function( arr, arrcompare ){
        
        arrcompare = arrcompare || [];
                    
        for( var i = 0; i < arr.length; i++ ){
            
            if( arrcompare.indexOf( arr[ i ] ) < 0 )this.Unique( arr[ i ] );

        }

        return this;
        
    };
    
// --> Globals
    
    var stopped   = false,
        autoscore = false;
    
    var allinks       = [],
        workerlinks   = [],   
        checkinglinks = [],   
        checkedlinks  = [],
        timeoutlinks  = [],
        errorlinks    = [],
        sources       = [];

// --> Update Info
    
    var UpdateInfo = function(){
        
        console.log( "All links : " + allinks.length );
        console.log( "Worker links : " + workerlinks.length );                            
        console.log( "Checking links : " + checkinglinks.length );                           
        console.log( "Checked links : " + checkedlinks.length );
        console.log( "Timeouts : " + timeoutlinks.length );
        console.log( "Errors : " + errorlinks.length );
        console.log( "Sources : " + sources.length );
        
    };
        
// --> Grab All Links from ajax url
    
    var GetAllLinksFromUrl = function( link, nowscan, onSuccess, onEnd, onTimeOut, onError ){

        onSuccess = onSuccess || function(){};
        onEnd = onEnd || function(){};
        onTimeOut = onTimeOut || function(){};
        onError   = onError || function(){};

        var grabed = [],
            xhr    = tools.GetXHR();
        
        xhr.responseType = "document";

        xhr.overrideMimeType( "text/html" );
        
        xhr.open( "GET", link, true);

        xhr.onload = function(){
            
                if( xhr.readyState === xhr.DONE ){
                    
                    checkedlinks.Unique( link );
                    if( xhr.status === 200 )onSuccess( xhr.responseXML, nowscan, link );   
                    onEnd();
                    
                }
                    
        };
        
        xhr.ontimeout = function( e ){
            
            checkedlinks.Unique( link );
            timeoutlinks.Unique( link );
            onTimeOut();   
            onEnd();
        
        }
        
        xhr.onerror = function( e ){
            
            checkedlinks.Unique( link );
            errorlinks.Unique( link );
            onError();   
            onEnd();
        
        }

        xhr.send( null );                

    };

// <-- Globals    
    
// --> Define class feature
    
    var CrawyCLS = function( options ){
        
    // --> Reset global vars
        
        stopped = false;
        
        allinks       = [];
        workerlinks   = [];
        checkinglinks = [];
        checkedlinks  = [];
        timeoutlinks  = [];
        errorlinks    = [];
        sources       = [];
        
    // --> Define options CrawyCLS
        
        options = options || {};
        options.pause = options.pause || 500;
        options.autoscore = options.autoscore || false;
        options.pagesallowed = options.pagesallowed || [];
        options.pagesnotallowed = options.pagesnotallowed || [];
        options.sourcecontext = options.sourcecontext || function(){};
         
        autoscore = options.autoscore;
        
    // --> Start Crawler
        
        console.info( CrawyState.happy + " Crawling ..." );
        document.title = "Crawling ...";
        
    // --> All link on start page
        
        checkedlinks.Unique( location.href );
        checkinglinks.Unique( location.href );
        allinks.Unique( location.href );
        allinks.MergeUnique( tools.FilterInternalLinks( $( "a" ) ).OnlyUnique(), checkedlinks );
        workerlinks.MergeUnique( allinks, checkedlinks );
        
    // --> Iterator
        
        var worker = function(){
                   
        // --> next step
            
            if( workerlinks.length < 1 || stopped )return false;
            
            var ti = setTimeout( function(){
             
            // --> get links ?
                
                var next = workerlinks[0];
                workerlinks.splice( 0, 1 );
                
                var nowscan = ( options.pagesallowed.length < 1 );
                    
            // --> Pages allowed ?
                
                for( var x = 0; x < options.pagesallowed.length; x++ ){

                    var reallowedpage = new RegExp( "^" + options.pagesallowed[ x ], "gi" );

                    if( next.match( reallowedpage ) ){

                        nowscan = true;
                        break;

                    }

                }

            // --> Pages not allowed ?

                for( var y = 0; nowscan && y < options.pagesnotallowed.length; y++ ){

                    var renotallowedpage = new RegExp( "^" + options.pagesnotallowed[ y ], "gi" );

                    if( next.match( renotallowedpage ) ){

                        nowscan = false;
                        break;

                    }

                }
                                
                if( checkedlinks.indexOf( next ) < 0 ){
                    
                    checkinglinks.Unique( next );
                    
                    GetAllLinksFromUrl( next, nowscan, function( loadedDOM, xnowscan, url ){ // --> onSuccess

                        if( loadedDOM instanceof HTMLDocument ){
                            
                        // --> Grab all new links    
                            
                            var allmylinks = tools.FilterInternalLinks( loadedDOM.querySelectorAll( "a" ) ).OnlyUnique();

                            if( allmylinks && allmylinks.length > 0 ){

                                allinks.MergeUnique( allmylinks ); 
                                workerlinks.MergeUnique( allmylinks, checkedlinks );

                            }
                            
                        // --> Source exposed ?
                            
                            if( xnowscan ){
                                
                                var externaltest = options.sourcecontext( url, loadedDOM );
                            
                                if( externaltest )sources.Unique( externaltest );    
                                
                            }
                            
                        }

                    }, function(){ // --> onEnd

                    // --> Score
                
                        var percentage = ( checkedlinks.length / ( allinks.length / 100 ) );
                        percentage = percentage.toFixed( 0 );
                        percentage = ( percentage <= 100 ) ? percentage : 100;
                        document.title = percentage + "%";
                        
                        if( autoscore )UpdateInfo();
                        
                        if( stopped ){
                
                            UpdateInfo(); 
                            
                            if( checkedlinks.length != checkinglinks.length ){
                                
                                console.info( CrawyState.ehmm + " Stopping ..." );
                                document.title = "Stopping ...";

                            }else{
                                
                                console.info( CrawyState.ehmm + " Stopped !" );
                                document.title = "Stopped !";
                                
                            }

                        }else if( workerlinks.length < 1 && checkedlinks.length == checkinglinks.length ){
                
                            UpdateInfo();                       
                            console.info( CrawyState.yesss + " Crawled !" ); 
                            document.title = "Crawled !";

                        }

                    } );    
                    
                } // <-- if

            // --> next ...    

                worker();
                
            // --> memory clean
                
                clearTimeout( ti );

            }, options.pause );           
            
        }; // <-- worker
        
        if( allinks.length > 0 ){
            
            worker();
        
        }else{
            
            console.warn( CrawyState.ehmm + " Ehmm, not links internal found in this page !" );
            
        }
            
    };
    
// --> Stop Crawler    
    
    CrawyCLS.Stop = function(){
        
        stopped = true;
        
    };
 
// --> Export All links grabbed    
    
    CrawyCLS.ExportAllLinks = function(){
        
        if( allinks.length < 1 ){
            
            console.warn( CrawyState.ehmm + " No links ..." );
            alert( CrawyState.ehmm + " No links ..." );
            
        }else{
            
            tools.SaveToJSON( "CrawyAllLinks." + location.host, allinks );
            
        }    
        
    };
 
// --> Export All sources grabbed    
    
    CrawyCLS.ExportAllSources = function(){
        
        if( sources.length < 1 ){
            
            console.warn( CrawyState.ehmm + " No sources ..." );
            alert( CrawyState.ehmm + " No sources ..." );
            
        }else{
            
            tools.SaveToJSON( "CrawyAllSources." + location.host, sources );
            
        }    
        
    };
 
// --> Toggle autoscore   
    
    CrawyCLS.ToggleAutoscore = function(){
        
        autoscore = !autoscore;   
        
    };
 
// --> Show info  
    
    CrawyCLS.Score = function(){
        
        UpdateInfo();   
        
    };
    
// <-- Define class feature
    
    window.Crawy = CrawyCLS;

    console.info( CrawyState.enjoy + " Hi, i am Crawy " + version + ", ready to work ..." );
    document.title = "Crawy loaded !";
    
} )(
    
    // --> Pass querySelectorAll reference
    
        function( selector ){

            return document.querySelectorAll( selector );

        }
    
    ,
    
    { // --> tools
        
        // --> Check if link is external
        
            isExternalLink : function( a ){
                
                var protolink     = a.protocol + a.hostname,
                    protolocation = location.protocol + location.hostname; 
                
                return ( protolink !== protolocation );
            
            }
        
            ,
        
        // --> Escape RegExp
        
            RegExpEscape : function( str ){
                
                return ( str + "" ).replace( /[.?*+^$[\]\\(){}|-]/g, "\\$&" );
            
            }
        
            ,
        
        // --> Filter Internal links
        
            FilterInternalLinks : function( links, mask ){
            
                mask = mask || "";
                mask = mask.trim();

                var internal = [];

                for( var i = 0; i < links.length; i++ ){

                    var href = links[ i ].getAttribute( "href" );

                    if( !href || href == "" )continue;

                // --> RegExp expression rule if set

                    if( mask !== "" ){

                        var re = new RegExp( this.RegExpEscape( mask ), "gi" );

                        // console.info( "Mask match for href : " + href );

                        if( !href.match( re ) )continue;

                    }

                    if( 
                        !this.isExternalLink( links[ i ] ) && 
                        href.indexOf( "#" ) < 0
                      )
                        internal.push( links[ i ].href );

                }

                return internal;

            }  
        
            ,
        
        // --> XHR cross browser
        
            GetXHR : function(){
                
                try {
                    
                    return new XMLHttpRequest();
                
                }catch( e ){}
                
                try {
                
                    return new ActiveXObject( "Msxml3.XMLHTTP" );
                
                }catch( e ){}
                
                try {
                    
                    return new ActiveXObject( "Msxml2.XMLHTTP.6.0" );
                
                }catch( e ){}
                
                try {
                    
                    return new ActiveXObject( "Msxml2.XMLHTTP.3.0" );
                
                }catch( e ){}
                
                try {
                    
                    return new ActiveXObject( "Msxml2.XMLHTTP" );
                
                }catch( e ){}
                
                try {
                    
                    return new ActiveXObject( "Microsoft.XMLHTTP" );
                
                }catch( e ){}
                
                return null;
            
            }
        
            ,
        
        // --> Save to JSON
        
            SaveToJSON : function( name, content ){
                
                name       = name || "Crawy";
                jsonsource = encodeURIComponent( JSON.stringify( content ) );
    
                var a = document.body.appendChild( document.createElement( "a" ) );

                a.innerHTML = "Download " + name + ".json";
                a.setAttribute( "download", name + ".json" );
                a.setAttribute( "href", "data:text/json;charset=utf-8," + jsonsource );

                a.click(); 
                
            }
                
                
    } // <-- tools

);