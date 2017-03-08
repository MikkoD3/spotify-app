/*
My goal with this app is to be able to search artist and then display various information about them. Through the course of building this app i hit a few bumbs on the road but managed to get it into a working condition which i can be happy about. Most of my time i spent trying to get things working and eventually i succeeded, but it lead to the loss of some functionalities. I would have liked to implement a local storage function but i couldnt quite understand how to use it

This was my first bigger project in javascript so the code isn't the cleanest and there are some things that i could do differently, this project is just to show some of my skills in javascript.
*/


/* I first implement a few jquery tricks in order to hide elements until functions are run*/
$(document).ready(function() {
   $('#showalbums').hide(); 
});

$(document).ready(function() {
    $('#artistid').hide();
});

$(document).ready(function() {
    $('#artistdata').hide();
});

$(document).ready(function() {
    $('#container').hide();
});


/*Here i declare a function that will put out the search results into a datalist where the user can choose what artist he/she will search for. I'm not sure but i think that the datalist element is not supported in safari so this maybe considered as a bad feature but in my opinion it was the simplest way to get a "search suggestions" function into this app*/
$(document).ready(function() {
$('#executesearch').click(getArtist);
    });

function getArtist() {
    'use strict';
   
    $('#container').show();

    $("#artistdata").slideUp("slow");
    $("#albumdata").slideUp("slow");
    document.getElementById("linkto").innerHTML = "";
    $("#artistdata").hide();
    document.getElementById("albumdata").innerHTML = "";
    
    var Artist = document.getElementById("artistsearch").value;
    
     
    var url = "https://api.spotify.com/v1/search?q="+Artist+"&type=artist";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            console.log("ready")
        var data = JSON.parse(xmlhttp.responseText);
       // console.log(data);
        
            
            
            var datalist = "";
            for (var i = 0; i < data.artists.items.length; i++) {
               
                datalist += '<li data-value="' + data.artists.items[i].id + '" onclick="showArtistdata(this)" class="border"><img class="listing" src="' + data.artists.items[i].images[0].url + '" alt="No picture available"><a class="links">' + data.artists.items[i].name + '</a></li>';
                document.getElementById("linkto").innerHTML = datalist;
            }
        }  
    
        
        
    }
$("#container").slideUp(50);
    $("#container").slideDown(150);
    
}



/* Again jquery tricks to keep things from happening until i want them to happen */
$(document).ready(function() {
    $('#executesearch').click(function() {
        $("#attention").hide();
    });
});
   
   // function for outputting basic artist data into a <div>
function showArtistdata(artist) {

    document.getElementById("linkto").innerHTML = "";
  //var Artistlink = document.getElementById("artistsearch").value;
    var Artistlink = artist.getAttribute("data-value");
    var url = "https://api.spotify.com/v1/artists/" + Artistlink +"";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            console.log("ready")
        var data = JSON.parse(xmlhttp.responseText);
        console.log(data);
        
           
            var list = "<ul>";
             
            list+= '<li><p id="artistname">' + data.name + '</p></li>';
            list+= '<li id="artistimage"></li>';
            list+= '<br><br>';
            list+= '<li><div id="progress"><div id="bar" style="width: 0%"><div id="progresslabel">' + data.popularity + '</div></div></div></li>';
            list+= '<li>Popularity, 100 is the maximun an artist can have.</li>';
            list+= '<br><br><br>';
            list+= '<li id="followers">Followers:&nbsp;</li>';
            list+= '<br>';
            list+= '<li><a id="openartist" href="' + data.external_urls.spotify + '" target="_blank">Open spotify</a></li>';
            list+= '<br>';
            list+= '<br>';
            
            list+= "</ul>";
            
          
            
            
            /*In order to get the artistdata i decided to simply output it to ta paragraph element and then take its data-value later on when i need it. I discovered later that there are more practical ways to do this but decided to let this one stay here*/
            
            var HiddenID = '<p data-value="' + data.id + '" id="hiddenId">' + data.id + '</p>';
        
       document.getElementById("artistid").innerHTML = HiddenID;
        
        document.getElementById("artistdata").innerHTML = list;
     // i call functions here to get a jquery slidedown function and a image for my list      
    listpic(data);    
    
showlist(data);

 runfollowers(data);
            
    }
        
      
    }
    

    
$(document).ready(function() {
  //  $('#artistdata').show();
      $('#showalbums').show();
});

}


/*Here i call a function that will count the followers of the artist*/
function runfollowers(data) {
    var start = 0;
    var finish = data.followers.total;
    
    $({countNum: start}).animate({countNum: finish}, {
        duration: 6000,
        easing:'linear',
        step: function() {
            document.getElementById("followers").innerHTML = "Followers:&nbsp" + Math.floor(this.countNum) + "";
        }
    })
}
//this is for visual effects for the <ul> list
function showlist(data) {
    $(document).ready(function() {
  $("#artistdata").show(function(){
       $("#artistdata").slideDown("slow", function(){
          $("#bar").animate({width: "" + data.popularity + "%"}, {speed: "slow"}) 
       });
       
});
        });
}


/* The reason i implemented this was that during testing i found out that not all artist have a profile picture. If showArtistdata couldnt find the picture it stopped working. This is why i seperated the profile picture into a different function so that it would still output the rest of the data.*/
function listpic(data) {
    if (data.images.length > 0) {
    var artistPic = '<img id="artistpic" src="' + data.images[0].url + '" alt="No picture available">';
    
    document.getElementById("artistimage").innerHTML = artistPic;
        
    }
    else {
        document.getElementById("artistimage").innerHTML = "<p id='errormessage'>No image!</p>";     
    }
    
    
}

  


/*This function declares a table in which the artists albums are placed. For practical reasons i decided to only show albums which are available in Finland*/
function getAlbums() {
    
    
    var artistId = $('#hiddenId').attr('data-value'); 
    
        var url = "https://api.spotify.com/v1/artists/" + artistId + "/albums?market=FI";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            console.log("ready")
        var data = JSON.parse(xmlhttp.responseText);
        console.log(data);
        
            var out = "<table id='albumtable'>";
           
           for (var i=0; i < data.items.length; i++) {
                
               
              out += '<tr>';
              
              
              out += '<td><img id="albumimage1" src="'+ data.items[i].images[0].url +'" alt="No picture available"></td>';
		      out += '<td><p class="albumname" >' + data.items[i].name + '</p></td>';
              out += '<td><button value="' + data.items[i].id + '"  id="btn_'+[i]+'" class="Abuttons">Songlist</button></td>'; 
              out += '<td>' + data.items[i].album_type + '</td>'
              out += '</tr>';   
               
               

        
            document.getElementById("albumdata").innerHTML = out;
            
          
  
               
   
              
        }
}

}
    //jquery tricks again
    displaytable(artistId);
}


function displaytable() {
   $("#albumdata").show(function(){
       $("#albumtable").slideDown("slow")
         
       
});
}

/* for this function i decided to try using jquery for the ajax call and to pull the data,and in my opinion this is far less simple*/ 
$(document).on('click', 'button', function () {
   
    $.ajax({
       url: "https://api.spotify.com/v1/albums/" + this.value + "/tracks",
       success: function(result) {
           console.log(result);
           //var info = result.items[0].artists;
           //console.log(info);
           var table = "<table id=tracktable>";
           
           
           table += '<tr>';
                
                table += '<td id= "albumpicture"></td>';
                table += '<td id= "nameofalbum"></td>';
                table += '<td id= "release_date"></td>';
                table += '<td id= "release_date_precision"></td>';
                table += '<td id= "albumlabel"></td>'
                table += '</tr>';
            for (var i=0; i < result.items.length; i++) {
               var time = result.items[i].duration_ms;
                var seconds = Math.floor(time / 1000);
                    var minutes = Math.floor(seconds / 60);
                        var seconds2 = (seconds - minutes * 60);
                var number = seconds2;
                if (number < 10) {
                    var duration = '' +  minutes + ':0'+ number + '';
                }
                else {
                    var duration = '' +  minutes + ':'+ number + '';
                }
                    
                
                table += '<tr>';
                table += '<td>Disc :' + result.items[i].disc_number + '</td>'
                table += '<td>Track :' + result.items[i].track_number + '</td>';
                table += '<td>' + result.items[i].name + '</td>';
                table += '<td>Duration: ' + duration + '</td>'
                table += '<td><audio controls><source src="' + result.items[i].preview_url + '">Your browser does not support the audio element.</audio></td>';
                table += '</tr>';
                                
           }
                table += "</table>";
           
            
                document.getElementById("albumdata").innerHTML = "";
                document.getElementById("albumdata").innerHTML = table;
                
       }
   }) 
    
});
/*By this time the deadline was approaching fast and instead of trying to get this function inside the last one i used this to pull out the albumimage, which the last one couldnt do, because it was only for the albums tracks*/
$(document).on('click', 'button', function () {
   $.ajax({
       url: "https://api.spotify.com/v1/albums/" + this.value ,
       success: function(result) {
           console.log(result);
               var picture = '<img id="albumcover" src="' + result.images[0].url + '">';
               var name = '<h3>' + result.name + '</h3>';
               var release = '' + result.release_date + '';
               var precision = '' + result.release_date_precision + '';
               var label = '' + result.label + ''; 
           
           document.getElementById("albumpicture").innerHTML = picture;
           document.getElementById("nameofalbum").innerHTML = name;
           document.getElementById("release_date").innerHTML = release;
           document.getElementById("release_date_precision").innerHTML = precision;
           document.getElementById("albumlabel").innerHTML = label;
       }
   }) 
    
});




