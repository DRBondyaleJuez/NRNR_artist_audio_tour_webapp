// Elements in the View
let navDotsContainer = document.querySelector('.nav-dots-container');
let carrouselContainer = document.querySelector('.carrousel');

let leftButton = document.querySelector('.left-button');
let rightButton = document.querySelector('.right-button');





//Images of Tour Data
let currentImageIndex = 0;
const imageInfo = {
    0:"Symbolic representation of the participatory universe as developed by physicist %% John Archibald Wheeler %% 1970 ",
    1:"Wanderer above the Sea of Fog %% Caspar David Friedrich %% 1818",
    2:"Adan Creation %% Michaelangelo %% 1511",
    3:"Kanagawa Oki Nami Ura (The Great Wave) %% Hokusai Katsushika %% 1831",
    4:"Race Horse %% Edward Muybridge %% 1878",
    5:"Cueva de la Manos (Cave of the Hands) %% Unkown %% 9,000 B.C.",
    6:"Scorn %% Tomoo Gokita %% 2011"
}

let imagePath = '../assets/tour_images/'
let imageList = buildImageList(imageInfo);

function buildImageList(imageInfo){
    let imageList = [];
    for(let i=0;i<Object.keys(imageInfo).length
    ;i++){
        imageList.push("Image"+i+".png");
    }
    return imageList;
}

//Build Carrousel

//Build Nav Dots
function buildAllNavDots(){
    let individualNavDotHtml = 
    `
    <button class="nav-dot"> </button>
    `;
    for(let i=0;i<imageList.length;i++){
        navDotsContainer.innerHTML += individualNavDotHtml;
    }
    let navDotList = navDotsContainer.querySelectorAll(".nav-dot");
    navDotList[0].classList.add('nav-dot--highlighted');
}

buildAllNavDots();



//Build Carrosel Slides
buildCurrentHtmlEntireCarrousel(imageInfo, imageList);
function buildCurrentHtmlEntireCarrousel(imageInfo, imageList){
    for(let i=0; i< imageList.length; i++){
        let carrouselSlideHtmlContent = buildCurrentHtmlCarrouselSlideContent(i);
        carrouselContainer.innerHTML += carrouselSlideHtmlContent;
    };

    let carrouselImageList = carrouselContainer.querySelectorAll('.carrousel__slide');

    positionCarrouselImagesProperly(carrouselImageList);

};

function buildCurrentHtmlCarrouselSlideContent(index){
    
    let currentImagePath = imagePath + imageList[index];
    let currentImageInfoList = imageInfo[index].split(' %% ');
    let currentImageTitle = currentImageInfoList[0];
    let currentImageAuthor = currentImageInfoList[1];
    let currentImageDate = currentImageInfoList[2];

    let htmlContent = 
    `
    <div class="carrousel__slide">
        <div class="carrousel__art-piece-image-container">
            <img class="carrousel__art-piece-image" src='${currentImagePath}'
                    alt="${imageList[index]}">

        </div>
        <div class="carrousel__art-piece-info">
            <p class="carrousel__art-piece-title">
                ${currentImageTitle + ' - ' + currentImageAuthor}
            </p>
            <p class = "carrousel__art-piece-year">
                ${currentImageDate}
            </p>
            
        </div>
    </div>
    `
    return htmlContent;
}

function positionCarrouselImagesProperly(imageList){
    let cummulativeReposition = 0;
    for(let i=0;i<imageList.length;i++){
        let currentImage = imageList[i];
        let currentImageHeight = currentImage.getBoundingClientRect().height;
        let currentImageWidth = currentImage.getBoundingClientRect().width;

        //Adjust Vertically
        let currentSlideContainerHeight = carrouselContainer.getBoundingClientRect().height;
        currentImage.style.top = currentSlideContainerHeight/2 - currentImageHeight/2 + 'px';
    

        //Adjust Horizontally

        currentImage.style.left = cummulativeReposition + 'px';

        //Recalculating next cummulative reposition
        if(i<imageList.length-1){
            let currentImageHalfWidth = currentImageWidth/2;
            let nextImageHalfWidth = imageList[i+1].getBoundingClientRect().width/2;
            cummulativeReposition += currentImageHalfWidth + nextImageHalfWidth;
        }
        
    }

}

//Events

//Swiping
let touchStartX = 0;
let touchEndX = 0;

let carrouselSection = document.querySelector('.carrousel-section');

carrouselSection.addEventListener("touchstart",(e)=> {
    touchStartX = e.changedTouches[0].screenX;
});

carrouselSection.addEventListener("touchend",(e)=> {
    touchEndX = e.changedTouches[0].screenX;
    checkSwipeDirection();
});

function checkSwipeDirection(){
    if(touchEndX<touchStartX){
        if(currentImageIndex < Object.keys(imageInfo).length-1){
            rightAction();
        }
    }
    if(touchEndX>touchStartX){
        if(currentImageIndex > 0){
            leftAction();
        }
    }
}

leftButton.addEventListener('click', ()=>{
    if(currentImageIndex > 0){
        leftAction();
    }
});

rightButton.addEventListener('click', ()=>{
    if(currentImageIndex < Object.keys(imageInfo).length-1){
        rightAction();
    }
});

function leftAction(){
    changeNavDot(currentImageIndex-1);
    changeImage(currentImageIndex-1);
    currentImageIndex--;
}

function rightAction(){
    changeNavDot(currentImageIndex+1);
    changeImage(currentImageIndex+1);
    currentImageIndex++;
}

function changeNavDot(newPosition){
    let navDotsList = navDotsContainer.querySelectorAll(".nav-dot");
    let currentNavDot = navDotsList[currentImageIndex];
    currentNavDot.classList.remove('nav-dot--highlighted');
    let newCurrentNavDot = navDotsList[newPosition];
    newCurrentNavDot.classList.add('nav-dot--highlighted');
}

function changeImage(newPosition){
    console.log(newPosition);
    let imageSlide = carrouselContainer.querySelectorAll('.carrousel__slide')[0];
    let imageSlideWidth = imageSlide.getBoundingClientRect().width;
    let movementScale = (- newPosition) * imageSlideWidth + 'px';
    carrouselContainer.style.transform = 'translate(' + movementScale +', 0)';
}




