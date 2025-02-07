/*CURENT ISSUES/TASKS
the popularity score <h2> disappears when putting a photo in favorites.
should re do the functions so they create the HTML element if you give it the
-img url
-popularity count
-favorite status and favorite ID num
-comment list
possibly as an object with keys that are the favorite ID num, and then the value of those keys are objects with the other properties as their keys.
This will allow event listeners to be created in these functions so i don't have to re create the event listeners in the favorites section
this will mean i have to change how i'm storing data, but it will be in a cleaner way
currently i'm storing full HTML code, but if i just store the bullet points above, i can pass those into the builder functions to recreate them.
this will allow me to build the favorite image containers one at a time based on the favorite ID num.
I want to make the favorites section (and possible the main new photos section) a horizontal scroll instead of vertical
the favorites section could just be a populated list in a container with horizontal scroll & overflow.
but the main section could have left and right buttons, the right button would generate a new photo and the left button would go back
probably only store one back photo at a time for starters.
because i will only have 3 elemets at once (center, previous, next), i can make smooth sliding transitions from left to right for each photo.
*/








// Your code here

// const getUrl2 = () => {
//     return fetch("https://api.thecatapi.com/v1/images/search")
//         .then(res => res.json())
//         .then(data => {
//             return data[0].url;
//         });
// }    //alternative way using then

const  getUrl = async () => {
    try {
        let response = await fetch("https://api.thecatapi.com/v1/images/search");
        let responseParsed = await response.json(); //the cat API returns an array of JSON objects, one for each img result
        let imgUrl = responseParsed[0].url          //take the first object, access its URL property
        return imgUrl;
    }
    catch(error) {
        console.error("Error fetching image URL:", error);
    }

}


const createPicture = async (num = 1) => {
    imagesContainer.innerHTML = '';
    for (let i = 0; i < num; i++) {
        let imgUrl = await getUrl()
        let imgContainer = document.createElement('div');
        imgContainer.classList.add('imgContainer');
        imgContainer.innerHTML = `
        <img src="${imgUrl}" class="catImg"></img>
        <div class="favoriteBtnContainer">
            <button type="button" class="addFaveBtn"><i class="fa-regular fa-heart"></i></button>
            <span class="hoverText">Add to favorites</span>
            <span>Remove favorite</span>
        </div>`;
        imgContainer.appendChild(createVoteContainer());
        imgContainer.appendChild(createCommentBox())
        imagesContainer.appendChild(imgContainer);

        let faveButton = imgContainer.children[1].children[0];
        faveButton.addEventListener('click', addOrRemoveFavorite);

    }


}

const createVoteContainer = () => {
    voteContainer = document.createElement('section');
    voteContainer.classList.add("voteContainer");
    voteContainer.setAttribute("data-upvotes", 0);
    voteContainer.setAttribute("data-downvotes", 0);
    voteContainer.innerHTML = `
    <h2 class="popularity">Popularity score: <span class='scoreCount'>0</span></h2>
    <div class="btnContainer">
        <button type="button" id="upvote">Upvote</button>
        <button type="button" id="downvote">Downvote</button>
    </div>
    `;
    voteContainer.addEventListener('click', upvoteOrDownvote);
    return voteContainer;
}

const createCommentBox = () => {
    let commentBox = document.createElement('section');
    commentBox.classList.add('commentBox');
    commentBox.innerHTML = `
    <div class="commentInputContainer">
        <label>Comment</label>
        <input type="text" value="Add a comment..." class="inputText" name="comment">
        <button type="button" class="submitComment">Submit</button>
    </div>
    <ul class="commentList"></ul>`


    let textBox = commentBox.querySelector('.inputText')
    textBox.addEventListener('click', hideDefaultText);
    textBox.addEventListener('blur', addDefaultText);

    let submitBtn = commentBox.querySelector('.submitComment')
    submitBtn.addEventListener('click', createComment);
    return commentBox;
}

const hideDefaultText = (event) => {
    let textBox = event.target;
    if (textBox.value === 'Add a comment...') {
        textBox.value='';
    }
}

const addDefaultText = (event) => {
    let textBox = event.target;
    if (textBox.value === '') {
        textBox.value='Add a comment...';
    }
}

const createComment = (event) => {
    let commentBox = event.target.parentElement.parentElement;
    let commentText = commentBox.children[0].children[1].value;
    let commentList = commentBox.children[1];
    let iconNum;
    if (commentText != "Add a comment...") {
        if (commentList.children.length % 2 === 0) {
            iconNum = 1;
        }
        else {
            iconNum = 2;
        }
        let newComment = document.createElement('li');
        newComment.classList.add('commentDiv');
        newComment.innerHTML =
        `<div class="iconAndCommentContainer">
            <div class="commentIcon${iconNum}"></div>
            <div class="comment">${commentText}</div>
        </div>
        <div class="removeCommentContainer">
            <button type="button" class="removeCommentBtn">X</button>
        </div>`
        commentList.appendChild(newComment);

        commentBox.children[0].children[1].value = 'Add a comment...';

        let removeBtn = newComment.querySelector('.removeCommentBtn');
        removeBtn.addEventListener('click', removeComment);
    }

}

const removeComment = (event) => {
    let commentBox = event.target.parentElement.parentElement;
    commentBox.remove();
}


const createNewSetContainer = () => {
    let newSetContainer = document.createElement('section');
    newSetContainer.id = "newSetContainer";
    newSetContainer.innerHTML =
    `<div class="btnContainer">
        <label>Results per page</label>
        <select id="generateNumber">
            <option value="1" selected="">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>
        <button type="button" id="newSetBtn">Get more photos</button>
    </div>`
    document.body.appendChild(newSetContainer);
}

const getNewSet = (event) => {
    let numToGenerate = document.getElementById('generateNumber').value;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    createPicture(numToGenerate);

}

const upvoteOrDownvote = (event) => {
    let voteContainer = event.currentTarget;
    let upvotes = voteContainer.dataset['upvotes'];
    let downvotes = voteContainer.dataset['downvotes'];
    let scoreText= voteContainer.children[0].children[0];
    if (event.target.id === 'upvote'){
        voteContainer.dataset['upvotes']++;
        upvotes++;
    }

    if (event.target.id === 'downvote'){
        voteContainer.dataset['downvotes']++;
        downvotes++;
    }
    let res = upvotes - downvotes;
    if (res < 0) {
        scoreText.innerText = "People don't like this :(";
    }
    else {
        scoreText.innerText = `${res}`;
    }

}

const addOrRemoveFavorite = (event) => {
// localStorage.clear();
    if (event.currentTarget.classList.contains('addFaveBtn')) {
        let iconElement = event.currentTarget.children[0];
        let favoriteBtnContainer = event.currentTarget.parentElement;
        let addSpan = favoriteBtnContainer.children[1];
        let removeSpan = favoriteBtnContainer.children[2];
        let imgContainer = event.currentTarget.parentElement.parentElement;
        let favoritesArrUnparsed = localStorage.getItem('favoritesArr');
        let favoritesArr;
        let favoritesContainer = document.querySelector('#favoritesContainer');

        if (!favoritesArrUnparsed) {
            favoritesArr = [];
        }
        else {
            favoritesArr = JSON.parse(favoritesArrUnparsed);
        }

        if (event.currentTarget.classList.contains('favorited')) {
            event.currentTarget.classList.remove('favorited');
            iconElement.classList.add('fa-regular');
            iconElement.classList.remove('fa-solid');
            removeSpan.classList.remove('hoverText');
            addSpan.classList.add('hoverText');

            let faveId = imgContainer.dataset.favoriteid;
            let favePhoto = document.querySelector(`#favoritesContainer [data-favoriteid="${faveId}"`);
            favePhoto.remove();
            for (let i = 0; i < favoritesArr.length; i++) {
                if (favoritesArr[i].includes(`data-favoriteid="${faveId}"`)){

                    console.log([...favoritesArr]);
                    favoritesArr.splice(i, 1);
                    console.log([...favoritesArr]);
                    break;
                }
            }
            localStorage.setItem('favoritesArr', JSON.stringify(favoritesArr));


            if (favoritesContainer.children.length === 0) {     // this currently doesn't work. for some reason, the element.remove step above
                let noFaves = document.createElement('h2');     // leaves me with a broken array (says [ on logging it sometimes. other times [])
                noFaves.innerText = "You have no favorites saved";
                favoritesContainer.appendChild(noFaves);
            }
        }
        else {
            event.currentTarget.classList.add('favorited');
            iconElement.classList.remove('fa-regular');
            iconElement.classList.add('fa-solid');
            addSpan.classList.remove('hoverText');
            removeSpan.classList.add('hoverText');


            imgContainer.setAttribute('data-favoriteid', getNewFavoriteId(favoritesArr));
            favoritesContainer.innerHTML += imgContainer.outerHTML;
            favoritesArr.push(imgContainer.outerHTML);
            localStorage.setItem('favoritesArr', JSON.stringify(favoritesArr));
            // favoritesArr.push({          //using an object could make searching for a specific favotie faster
            //     favoriteId: imgContainer.getAttribute('favoriteId'),     //but it doesn't help when we have to delete it from the HTML
            //     outerHTML: imgContainer.outerHTML  // Store the HTML of the element
            // })


            //remove the h2 saying you have no favorites
            let noFavesEl = favoritesContainer.querySelector('h2');
            if (noFavesEl) {
                noFavesEl.remove();
            }
        }


    }

}

const getNewFavoriteId = (favoritesArr) => {
    let lastEl = favoritesArr[favoritesArr.length - 1];
    if(!lastEl) {
        return 1;
    }

    let tempDiv = document.createElement('div');        //you have to insert the stored string HTML back into a DOM element to read its data attributes
    tempDiv.innerHTML = lastEl;
    let faveNum = tempDiv.children[0].dataset.favoriteid;
    return Number(faveNum) + 1;
}

const showHideFaves = (event) => {
    let showSpan = event.currentTarget.children[0];
    let hideSpan = event.currentTarget.children[1];

    let container = document.querySelector('#favoritesContainer');
    if (container.classList.contains('hidden')) {
        container.classList.remove('hidden');
        showSpan.classList.add('hidden');
        hideSpan.classList.remove('hidden');

        if (container.children.length === 0) {
            let noFaves = document.createElement('h2');
            noFaves.innerText = "You have no favorites saved";
            container.appendChild(noFaves);
         }
    }
    else {
        container.classList.add('hidden');
        showSpan.classList.remove('hidden');
        hideSpan.classList.add('hidden');
    }


}

const favoritesSectionInitializer = () => {

    let favoritesSection = document.createElement('section');
    favoritesSection.id = "favoritesSection";
    favoritesSection.innerHTML =
    `
    <div id="showHideFavesBtnContainer">
        <button type="button" id="showHideFavesBtn">
            <span id="showFaves">Show favorites</span>
            <span id="hideFaves" class="hidden">Hide favorites</span>
        </button>
    </div>
`


    let favoritesContainer = document.createElement('div');
    favoritesContainer.id = 'favoritesContainer';
    favoritesContainer.classList.add('hidden');
    let favoritesArr = localStorage.getItem('favoritesArr')
    if (favoritesArr) {
        let parsedFavorites = JSON.parse(favoritesArr);
        parsedFavorites.forEach(element => {
            let imgContainer = document.createElement('div');
            imgContainer.innerHTML = element;
            favoritesContainer.appendChild(imgContainer);

            const voteContainer = imgContainer.querySelector('.voteContainer');
            if (voteContainer) {
                voteContainer.addEventListener('click', upvoteOrDownvote);
            }

            const faveButton = imgContainer.querySelector('.addFaveBtn');
            if (faveButton) {
                faveButton.addEventListener('click', addOrRemoveFavorite);
            }

            const commentSubmitBtn = imgContainer.querySelector('.submitComment');
            if (commentSubmitBtn) {
                commentSubmitBtn.addEventListener('click', createComment);
            }

            const textBox = imgContainer.querySelector('.inputText');
            if (textBox) {
                textBox.addEventListener('click', hideDefaultText);
                textBox.addEventListener('blur', addDefaultText);
            }

            const commentDeleteBtn = imgContainer.querySelectorAll('.removeCommentBtn');
            if (commentDeleteBtn) {
                for (let i = 0; i < commentDeleteBtn.length; i++) {
                    commentDeleteBtn[i].addEventListener('click', removeComment);
                }

            }
        });

    }

    favoritesSection.appendChild(favoritesContainer);
    document.body.appendChild(favoritesSection);





}



window.addEventListener("DOMContentLoaded", event =>  {
    // localStorage.clear();
    let h1 = document.createElement('h1');
    h1.innerText = 'Catstagram';
    document.body.appendChild(h1);
    let imagesContainer = document.createElement('section');
    imagesContainer.id = "imagesContainer"
    document.body.appendChild(imagesContainer);

    favoritesSectionInitializer();
    createPicture();
    createNewSetContainer();

    let newSetBtn = document.getElementById('newSetBtn');
    newSetBtn.addEventListener('click', getNewSet);

    let showHideFavesBtn = document.querySelector('#showHideFavesBtn');
    showHideFavesBtn.addEventListener('click', showHideFaves);


})



const storeFavoritesSection = () => {
    if(JSON.parse(localStorage.getItem('favoritesArr')).length > 0) {
        let favoritesContainer = document.querySelector('#favoritesContainer')
        let newFavoritesArr = [];
        let imgContainers = favoritesContainer.children;
        console.log(imgContainers[0]);
        for (let i = 0; i < imgContainers.length; i++) {
            newFavoritesArr.push(imgContainers[i].outerHTML);
        }
        localStorage.setItem('favoritesArr', JSON.stringify(newFavoritesArr));
        console.log(JSON.parse(localStorage.getItem('favoritesArr')));
    }

}

window.addEventListener('beforeunload', storeFavoritesSection)
//the storeFavoritesSection function is needed due to how i implemented the favorites section.
//when a photo is favorited, it is copied and placed into the favorites section.
//but if someone interacts with the favorited photo in the favorited section, that needs to be saved with this function
//a better implementation would be to store individual components as they occur in the event listener function
//and build the favorites section not by copying the html, but using dynamic functions that use these individual components.





// document.querySelector('[data-attribute="value"]');
