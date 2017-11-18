let images = document.getElementById("images");
let imagesContainer = document.querySelector(".uploaded-images");
let centers = document.querySelectorAll("#form-row > .col-md-4 > ul > li");
console.log(centers);
console.log(centers);
let displayImages = function(e){
	let files = e.target.files;
	if(!files) return;
	let existingImages = document.querySelectorAll(".chosen-image");
	for(let i=0; i<existingImages.length; i++){
		let image = existingImages[i];
		image.parentNode.removeChild(image);
	}
	for(let i=0; i<4; i++){
		if(!files[i]) break;
		let file = files[i];
		let imgDiv = document.getElementById("img" + i);
		let img = document.createElement("img");
	    img.classList.add("img-responsive");
	    img.classList.add("chosen-image");
	    img.file = file;
	    imgDiv.appendChild(img);
	    let reader = new FileReader();
	    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
	    reader.readAsDataURL(file);
	}
}
let navTo = function(newLoc){
	window.location = newLoc;
}
let navToEventAdmin = function(){
	window.location = "./center_admin.html"
}
if(images) images.addEventListener("change", displayImages);
if(centers){
	for(let i=0; i<centers.length; i++){
		centers[i].addEventListener("click", navToEventAdmin)
	}
}