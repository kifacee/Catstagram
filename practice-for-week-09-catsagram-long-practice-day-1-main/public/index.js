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
        imgContainer.innerHTML = `<img src="${imgUrl}" class="catImg"></img>`
        imgContainer.appendChild(createVoteContainer());
        imgContainer.appendChild(createCommentBox())
        imagesContainer.appendChild(imgContainer);

        // let upvoteBtn = document.getElementById('upvote');
        // console.log(upvoteBtn);
        // upvoteBtn.addEventListener('click', upvote);
        // let downvoteBtn = document.getElementById('downvote');
        // upvoteBtn.addEventListener('click', downvote);
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


window.addEventListener("DOMContentLoaded", event =>  {
    let h1 = document.createElement('h1');
    h1.innerText = 'Catstagram';
    document.body.appendChild(h1);
    let imagesContainer = document.createElement('section');
    imagesContainer.id = "imagesContainer"
    document.body.appendChild(imagesContainer);
    createPicture();
    createNewSetContainer();

    let newSetBtn = document.getElementById('newSetBtn');
    newSetBtn.addEventListener('click', getNewSet);



})
