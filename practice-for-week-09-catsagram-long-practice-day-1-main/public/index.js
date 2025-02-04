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


const createPicture = async () => {
    let imgUrl = await getUrl()
    let imgContainer = document.createElement('div');
    imgContainer.classList.add('imgContainer');
    imgContainer.innerHTML = `<img src="${imgUrl}" class="catImg"></img>`
    imagesContainer.appendChild(imgContainer);

}


window.addEventListener("DOMContentLoaded", event =>  {
    let h1 = document.createElement('h1');
    h1.innerText = 'Kitten Pic';
    document.body.appendChild(h1);
    let imagesContainer = document.createElement('div');
    imagesContainer.id = "imagesContainer"
    document.body.appendChild(imagesContainer);
    createPicture();
})
