const Baseurl = "https://tarmeezacademy.com/api/v1/"
const url = "https://tarmeezacademy.com/api/v1/"
let userPost = document.getElementById("userPost")
let divPost = document.getElementById("post")

getComments()
setupUI()
getTokenandUser()


function getCurrentUserId() {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("postId")
    return id
}


function getComments() {
    let user = JSON.parse(localStorage.getItem("user"))
    let CurrentUser = user.id
    let postId = getCurrentUserId()
    axios.get(`${Baseurl}posts/${postId}`)
        .then((response) => {
            let post = response.data.data
            let content = `
    <div class="card shadow" style="margin-bottom: 30px;">
        <div class="info d-flex justify-content-between"
            style="border-bottom: 1px solid rgba(128, 128, 128, 0.274); padding-bottom: 7px;padding-top: 7px;">
            <div id="info_div" onclick="info_divClicked()">
                <img id="post-user-image" src="${post.author.profile_image}" class="rounded-circle" alt=""
                    width="40px" height="40px" style="margin-left: 15px; margin-top: 5px;">
                <b id="post-user-name" style="display: inline-block;">${post.author.name}</b>
            </div>
            ${CurrentUser == post.author.id ? `<span class="twoButtons" style="margin-right: 10px;">
                <button data-bs-toggle="modal" data-bs-target="#editBt" onclick="saveEditedPost('${encodeURIComponent(JSON.stringify(post))}')" class="btn btn-secondary">Edit</button>
                <button data-bs-toggle="modal" data-bs-target="#deleteBt" onclick="saveEditedPost('${encodeURIComponent(JSON.stringify(post))}')" class="btn btn-danger">Delete</button>
            </span>`: ``}
            
        </div>
        <div class="card-body"
            style="border-bottom: 1px solid rgba(128, 128, 128, 0.274); padding-bottom: 5px;">
            <img src="${post.image}" alt="" width="100%" style="margin-bottom: 10px;">
            <span style="color:rgb(193, 193, 193)">${post.created_at}</span>
            <h5 class="card-title" style="margin-top: 10px;">${post.title}</h5>
            <p class="card-text" style="margin-bottom: 10px;margin-top: 10px;">${post.body}</p>
        </div>
        <div  style="padding: 17px; cursor:pointer;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen"
                viewBox="0 0 16 16">
                <path
                    d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
            </svg> (<span>${post.comments_count}</span>) comment
        </div>
        <div id="comments">
        </div>
        <div class="createComment" style="display: flex; margin-bottom: 10px;margin-top: 10px;">
                    <input id="inputComment" type="text" class="form-control" placeholder="add your comment" aria-label="Username"
                        aria-describedby="addon-wrapping">
                    <button id="sendComment" onclick="addComment()" type="button" class="btn btn-primary">Send</button>
        </div>
    </div>  
    `
            userPost.innerHTML = `${post.author.username} post`
            document.getElementById("post").innerHTML += content

            for (const comment of post.comments) {
                let NewComment = `
                <div class="comment"
                        style="background-color:rgb(241, 246,255); width: 100%; display: flex; flex-direction: column; padding: 15px;">
                        <span id="commentInfo" style="margin-bottom: 10px;">
                            <img src="${comment.author.profile_image}" alt="" width="30px" height="30px"
                                class="rounded-circle" style="margin-left: 15px;">
                            <b>${comment.author.name}</b>
                        </span>
                        <p style="margin-left: 15px;">${comment.body}</p>
                    </div>
                `
                document.getElementById("comments").innerHTML += NewComment
            }
        })
}


function addComment() {
    let id = getCurrentUserId()
    let inputComment = document.getElementById("inputComment").value
    let token = localStorage.getItem("token")
    let param = {
        "body": inputComment
    }
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }
    axios.post(`${url}posts/${id}/comments`, param, {
        headers: headers
    })
        .then((response) => {
            let data = response.data.data
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Adding comment in successfully",
                showConfirmButton: false,
                timer: 1500
            });
            getTokenandUser()
            setupUI()
            window.location.reload()
        })
}

function setupUI() {
    let token = localStorage.getItem("token")
    let buttonsDiv = document.getElementById("buttons")
    let buttons2Div = document.getElementById("buttons2")
    //let btn = document.getElementById("addPost")
    if (token == null) {
        buttonsDiv.style.display = "block"
        buttons2Div.style.display = "none"
        //  btn.style.display = "none"
    }
    else {
        buttonsDiv.style.display = "none"
        buttons2Div.style.display = "block"
        //btn.style.display = "block"
    }

}

function getTokenandUser() {
    // let token = localStorage.getItem("token")
    let userObj = JSON.parse(localStorage.getItem("user"))
    document.getElementById("loggedImg").src = `${userObj.profile_image}`
    document.getElementById("loggedUser").innerHTML = `${userObj.username}`
}