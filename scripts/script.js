// Elements in the View
let navDotsContainer = document.querySelector('.nav-dots-container');
let carrouselContainer = document.querySelector('.carrousel');

let leftButton = document.querySelector('.left-button');
let rightButton = document.querySelector('.right-button');
let playButton = document.querySelector('.play-button');





//Images of Tour Data
let currentImageIndex = 0;
let playingState = false;
let imageInfo = {
    0: "Symbolic representation of the participatory universe as developed by physicist %% John Archibald Wheeler %% 1970 ",
    1: "Wanderer above the Sea of Fog %% Caspar David Friedrich %% 1818",
    2: "Adan Creation %% Michaelangelo %% 1511",
    3: "Kanagawa Oki Nami Ura (The Great Wave) %% Hokusai Katsushika %% 1831",
    4: "Race Horse %% Edward Muybridge %% 1878",
    5: "Cueva de la Manos (Cave of the Hands) %% Unkown %% 9,000 B.C.",
    6: "Scorn %% Tomoo Gokita %% 2011"
}

let imagePath = '../assets/tour_images/'
let imageList = buildImageList(imageInfo);

function buildImageList(imageInfo) {
    let imageList = [];
    for (let i = 0; i < Object.keys(imageInfo).length; i++) {
        imageList.push("Image" + i + ".png");
    }
    return imageList;
}

//Audio of Tour Data

let audioPath = '../assets/tour_audio/';
let audioList = buildAudioList(imageInfo);

function buildAudioList(imageInfo) {
    let audioList = [];
    for (let i = 0; i < Object.keys(imageInfo).length; i++) {
        audioList.push(audioPath + "audio" + i + ".mp3");
    }
    return audioList;
}

//  ------------------   Build Carrousel -------------------
//Build Nav Dots
function buildAllNavDots() {
    let individualNavDotHtml =
        `
    <button class="nav-dot"> </button>
    `;
    for (let i = 0; i < Object.keys(imageInfo).length; i++) {
        navDotsContainer.innerHTML += individualNavDotHtml;
    }
    let navDotList = navDotsContainer.querySelectorAll(".nav-dot");
    navDotList[0].classList.add('nav-dot--highlighted');
}

buildAllNavDots();


//Build Carrousel Slides
function buildCurrentHtmlEntireCarrousel(imageInfo, imageList) {
    for (let i = 0; i < Object.keys(imageInfo).length; i++) {
        let carrouselSlideHtmlContent = buildCurrentHtmlCarrouselSlideContent(imageInfo, i);
        carrouselContainer.innerHTML += carrouselSlideHtmlContent;
    };

    let carrouselImageList = carrouselContainer.querySelectorAll('.carrousel__slide');
    carrouselImageList[0].classList.add('carrousel__slide--visible')
    positionCarrouselImagesProperly(carrouselImageList);

};

function buildCurrentHtmlCarrouselSlideContent(imageInfo, index) {

    let currentImagePath = imagePath + imageList[index];
    let currentImageInfo = imageInfo[index];
    let currentImageInfoList = currentImageInfo.split(' %% ');
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

function positionCarrouselImagesProperly(imageList) {
    let cummulativeReposition = 0;
    for (let i = 0; i < Object.keys(imageInfo).length; i++) {
        let currentImage = imageList[i];
        let currentImageHeight = currentImage.getBoundingClientRect().height;
        let currentImageWidth = currentImage.getBoundingClientRect().width;

        //Adjust Vertically
        let currentSlideContainerHeight = carrouselContainer.getBoundingClientRect().height;
        currentImage.style.top = currentSlideContainerHeight / 2 - currentImageHeight / 2 + 'px';

        //Adjust Horizontally

        currentImage.style.left = cummulativeReposition + 'px';

        //Recalculating next cummulative reposition
        if (i < imageList.length - 1) {
            let currentImageHalfWidth = currentImageWidth / 2;
            let nextImageHalfWidth = imageList[i + 1].getBoundingClientRect().width / 2;
            cummulativeReposition += currentImageHalfWidth + nextImageHalfWidth;
        }
    }
}

buildCurrentHtmlEntireCarrousel(imageInfo, imageList);

// ---------------------- Build Audio ------------------
function setAudioHtml() {
    let audioSection = document.querySelector('.audio-section');
    for (let i = 0; i < Object.keys(imageInfo).length; i++) {
        let audioHtml =
            `
            <audio class = "image-audio">
            <source src="${audioList[i]}" type="audio/mp3">
            </audio>
            `
        audioSection.innerHTML += audioHtml;
    }
};
setAudioHtml();

//Events

//Player Actions Button
function playCurrentAudio() {
    playingState = true;
    let audioPlayerList = document.querySelectorAll('.image-audio');
    let playPauseImage = document.querySelector('.play-pause-image');
    audioPlayerList[currentImageIndex].play();
    playPauseImage.src = "assets/icons/pause_icon.png"
}

function pauseCurrentAudio() {
    playingState = false;
    let audioPlayerList = document.querySelectorAll('.image-audio');
    let playPauseImage = document.querySelector('.play-pause-image');
    audioPlayerList[currentImageIndex].pause();
    playPauseImage.src = "assets/icons/play_icon.png"
}

function setPlayButton() {
    playButton.addEventListener('click', () => {
        if (playingState == false) {
            playCurrentAudio();
        } else {
            pauseCurrentAudio();
        }
    });
}
setPlayButton();


//Swiping
let touchStartX = 0;
let touchEndX = 0;

let carrouselSection = document.querySelector('.carrousel-section');

carrouselSection.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

carrouselSection.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    checkSwipeDirection();
});

function checkSwipeDirection() {
    if (touchEndX < touchStartX) {
        if (currentImageIndex < Object.keys(imageInfo).length - 1) {
            rightAction();
        }
    }
    if (touchEndX > touchStartX) {
        if (currentImageIndex > 0) {
            leftAction();
        }
    }
}

leftButton.addEventListener('click', () => {
    if (currentImageIndex > 0) {
        leftAction();
    }
});

rightButton.addEventListener('click', () => {
    if (currentImageIndex < Object.keys(imageInfo).length - 1) {
        rightAction();
    }
});

function leftAction() {
    pauseCurrentAudio();
    changeNavDot(currentImageIndex - 1);
    changeImage(currentImageIndex - 1);
    currentImageIndex--;
}

function rightAction() {
    pauseCurrentAudio();
    changeNavDot(currentImageIndex + 1);
    changeImage(currentImageIndex + 1);
    currentImageIndex++;
}

function changeNavDot(newPosition) {
    let navDotsList = navDotsContainer.querySelectorAll(".nav-dot");
    let currentNavDot = navDotsList[currentImageIndex];
    currentNavDot.classList.remove('nav-dot--highlighted');
    let newCurrentNavDot = navDotsList[newPosition];
    newCurrentNavDot.classList.add('nav-dot--highlighted');
}

function changeImage(newPosition) {

    let imageSlideList = carrouselContainer.querySelectorAll('.carrousel__slide');

    let currentSlide = imageSlideList[currentImageIndex];
    let newSlide = imageSlideList[newPosition];
    currentSlide.classList.remove('carrousel__slide--visible');
    newSlide.classList.add('carrousel__slide--visible');

    let imageSlideWidth = currentSlide.getBoundingClientRect().width;
    let movementScale = (- newPosition) * imageSlideWidth + 'px';
    carrouselContainer.style.transform = 'translate(' + movementScale + ', 0)';
}




