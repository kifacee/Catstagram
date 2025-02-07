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
            <button type="button" class="addFaveBtn"><i class="fa-solid fa-heart"></i></button>
            <span class="hoverText">Add to favorites</span>
        </div>`;
        imgContainer.appendChild(createVoteContainer());
        imgContainer.appendChild(createCommentBox())
        imagesContainer.appendChild(imgContainer);

        let voteButton = imgContainer.children[1].children[0];
        voteButton.addEventListener('click', addOrRemoveFavorite);

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
        let imgContainer = event.currentTarget.parentElement.parentElement;
        let favoritesArrUnparsed = localStorage.getItem('favoritesArr');
        let favoritesArr;
        if (!favoritesArrUnparsed) {
            favoritesArr = [];
        }
        else {
            favoritesArr = JSON.parse(favoritesArrUnparsed);
        }

        if (event.currentTarget.classList.contains('favorited')) {
            event.currentTarget.classList.remove('favorited');
            let faveId = imgContainer.dataset.favoriteid;
            let favePhoto = document.querySelector(`#favoritesContainer [data-favoriteid="${faveId}"`);
            favePhoto.remove();
            for (let i = 0; i < favoritesArr.length; i++) {
                if (favoritesArr[i].includes(`data-favoriteid="${faveId}"`)){
                    favoritesArr.splice(i, 1);

                    break;
                }
            }
            localStorage.setItem('favoritesArr', JSON.stringify(favoritesArr));

        }
        else {
            event.currentTarget.classList.add('favorited');
            let favoritesContainer = document.querySelector('#favoritesContainer');

            imgContainer.setAttribute('data-favoriteid', getNewFavoriteId(favoritesArr));
            favoritesContainer.innerHTML += imgContainer.outerHTML;
            favoritesArr.push(imgContainer.outerHTML);
            localStorage.setItem('favoritesArr', JSON.stringify(favoritesArr));
            // favoritesArr.push({          //using an object could make searching for a specific favotie faster
            //     favoriteId: imgContainer.getAttribute('favoriteId'),     //but it doesn't help when we have to delete it from the HTML
            //     outerHTML: imgContainer.outerHTML  // Store the HTML of the element
            // })

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

const favoritesSectionInitializer = () => {

    let favoritesSection = document.createElement('section');
    favoritesSection.id = "favoritesSection";
    favoritesSection.innerHTML =
    `
    <div id="showHideFavesBtnContainer">
        <button type="button" id="showHideFavesBtn">
            <span id="showFaves">Show favorites</span>
            <span id="hideFaves">Hide favorites</span>
        </button>
    </div>
    <div id="favoritesContainer">
    </div>
`
    document.body.appendChild(favoritesSection);

    let favoritesContainer = document.querySelector('#favoritesContainer');
    let favoritesArr = localStorage.getItem('favoritesArr')
    if (favoritesArr) {
        let parsedFavorites = JSON.parse(favoritesArr);
        parsedFavorites.forEach(element => {
            favoritesContainer.innerHTML += element;
        }); {

        }
    }
    //need to implement these event listeners for each favorite photo when they are created.
    // removeBtn.addEventListener('click', removeComment);
    // textBox.addEventListener('click', hideDefaultText);
    // textBox.addEventListener('blur', addDefaultText);
    // submitBtn.addEventListener('click', createComment);
    // voteButton.addEventListener('click', addOrRemoveFavorite);
    // voteContainer.addEventListener('click', upvoteOrDownvote);
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



})


// function storeGame() {
//     localStorage.setItem("turn", currentSymbol);
//     localStorage.setItem("movesLeft", moves);
//     localStorage.setItem("boardArr", JSON.stringify(boardArrVersion));
//     const boardHtml = document.getElementById("board");
//     let storedHtml = boardHtml.innerHTML;
//     localStorage.setItem("board", storedHtml);
//   };


// if (localStorage.getItem('board')) {
//     let savedBoardArr = JSON.parse(localStorage.getItem('boardArr'));
//     let savedHtml = localStorage.getItem('board');
//     let savedMoveCount = localStorage.getItem('movesLeft');
//     let savedTurnSymbol = localStorage.getItem('turn');
//     board.innerHTML = savedHtml;
//     moves = savedMoveCount;
//     boardArrVersion = savedBoardArr;
//     currentSymbol = savedTurnSymbol;
// }


// document.querySelector('[data-attribute="value"]');
