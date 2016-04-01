"use strict";

//Receive id element that will be the base to insert the elements for the navigation
function init(divId) {
	getItemsNavigation(function(response) {
		// Call function to create html elements for the navigation
	    createNavigationHtml(response.items, document.getElementById(divId));

	    // add event listener click to the body element, parent of all elements in the page, 
	    // so every element clicked will call the function to hide subitems nav
	    document.body.addEventListener("click", hideSubitemsNav);

	    // on mobile hide navigation when clicked outside nav
	    var content = document.getElementsByClassName("content");
	    content[0].addEventListener("click", uncheckbox);

	    var toggle = document.getElementById("toggle");
	    toggle.addEventListener("change", slideContent);
	});
}

// Loads navigation items via AJAX request
function getItemsNavigation(callback) {
	var xmlhttp = new XMLHttpRequest();
	// API URL
	var url = "http://localhost:3000/api/nav.json";

	xmlhttp.onreadystatechange = function() {
		// When request is finished and response is ready with no errors
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			// Parse JSON response with the nav items
	        var response = JSON.parse(xmlhttp.responseText);
	        //Call the callback function
	        callback(response);
	    }
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

// Create html elements in the nav with the list items received.
function createNavigationHtml(listItems, htmlElement) {
	// Return if param is empty
	if (!listItems || listItems.length == 0) return;

	var ul = document.createElement("ul");

	// for each item create li html element with ancor html element inside
    for(var i = 0; i < listItems.length; i++) {
    	var li = document.createElement("li");
    	var a = document.createElement("a");
    	a.href = listItems[i].url;
    	var text = document.createTextNode(listItems[i].label); // Create a text node
		a.appendChild(text); 
    	li.appendChild(a);

    	// if item has subitems call the same function to create subitems navigation
    	if (listItems[i].items && listItems[i].items.length > 0) {
    		// add event listener click to show the subitems navigation
  	  		a.addEventListener("click", showSubitemsNav);

  	  		//create subitems navigation
    		createNavigationHtml(listItems[i].items, li);
    	}

    	ul.appendChild(li);
    }
    
    // Insert elements to the document.
    htmlElement.appendChild(ul);
}

//hide subitems navigation
function hideSubitemsNav() {
	// get all dom elements with 'selected' class (must find none or one)
	var elements = document.getElementsByClassName("selected");
	
	for (var i = 0; i < elements.length; i++) {
		// remove 'selected' class
	    elements[i].className = elements[i].className.replace("selected", "");
	}

	// get translucent mask element and add 'hidden' class to hide the element
	var mask = document.getElementById("translucent-mask");
	if (mask.className.indexOf("hidden") == -1) mask.className += " " + "hidden";
}

//show subitems navigation
function showSubitemsNav(event) {
	// prevent a link from opening the URL
	// and avoid parent handling of this event
	event.preventDefault();
	event.stopPropagation();

	hideSubitemsNav();
	
	// get translucent mask element and remove 'hidden' class to show the element
	var mask = document.getElementById("translucent-mask");
	mask.className = mask.className.replace("hidden", "");
	// add 'selected' class to this selected element so it will be displayed
	this.nextSibling.className += " " + "selected";
}

// uncheck toggle checkbox (hamburguer) to hide mobile nav
function uncheckbox() {
	var toggle = document.getElementById("toggle");
	toggle.click();
}

// slide content according to toggle checkbox (hamburguer)
function slideContent() {
	console.log('slideContent');
	var content = document.getElementsByClassName("content");
	if (content[0].className.indexOf("slide") == -1) {
		content[0].className += " " + "slide";
	} else {
		content[0].className = content[0].className.replace("slide", "");
	} 
}

