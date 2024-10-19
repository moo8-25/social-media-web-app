const Baseurl = "https://tarmeezacademy.com/api/v1/"
const url = "https://tarmeezacademy.com/api/v1/"
setupUI()
getTokenandUser()
PersonCardSetp()


function getTokenandUser() {
    // let token = localStorage.getItem("token")
    let userObj = JSON.parse(localStorage.getItem("user"))
    document.getElementById("loggedImg").src = `${userObj.profile_image}`
    document.getElementById("loggedUser").innerHTML = `${userObj.username}`
}

function PersonCardSetp() {
    let id = getCurrentUserId()
    if (id == null) {
        let img = document.getElementById("main-info-image")
        let email = document.getElementById("main-info-email")
        let name = document.getElementById("main-info-name")
        let UserName = document.getElementById("main-info-username")
        let postCount = document.getElementById("posts-count")
        let commentsCount = document.getElementById("comments-count")
        let UserNamePosts = document.getElementById("UserNamePosts")
        let user = JSON.parse(localStorage.getItem("user"))
        email.innerHTML = user.email
        name.innerHTML = user.name
        UserName.innerHTML = user.username
        img.src = user.profile_image
        postCount.innerHTML = user.posts_count
        commentsCount.innerHTML = user.comments_count
        UserNamePosts.innerHTML = user.username
        let CurrentUser = user.id
        getUserPosts(CurrentUser)
    }
    else {
        axios.get(`${url}users/${id}`)
            .then((response) => {
                let user = response.data.data

                let img = document.getElementById("main-info-image")
                let email = document.getElementById("main-info-email")
                let name = document.getElementById("main-info-name")
                let UserName = document.getElementById("main-info-username")
                let postCount = document.getElementById("posts-count")
                let commentsCount = document.getElementById("comments-count")
                let UserNamePosts = document.getElementById("UserNamePosts")
                email.innerHTML = user.email
                name.innerHTML = user.name
                UserName.innerHTML = user.username
                img.src = user.profile_image
                postCount.innerHTML = user.posts_count
                commentsCount.innerHTML = user.comments_count
                UserNamePosts.innerHTML = user.username
                getUserPosts(id)
            })
    }
}

function getUserPosts(Userid) {
    let user = JSON.parse(localStorage.getItem("user"))
    let CurrentUser = user.id
    axios.get(`${Baseurl}users/${Userid}/posts`)
        .then((response) => {
            const posts = response.data.data
            for (var post of posts) {
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
        <div onclick="ClickedPost('${encodeURIComponent(JSON.stringify(post))}')" style="padding: 17px; cursor:pointer;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen"
                viewBox="0 0 16 16">
                <path
                    d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
            </svg> (<span>${post.comments_count}</span>) comment
        </div>
    </div>  
    `
                document.getElementById("posts").innerHTML += content
            }
        }).finally(() => {
            toggleLoader(false)
        })
}

function addPostBtn() {
    let token = localStorage.getItem("token")
    let post_img = document.getElementById("add-pot-img").files[0]
    let post_body = document.getElementById("add-pot-body").value
    let post_title = document.getElementById("add-pot-title").value
    let formData = new FormData()
    formData.append("image", post_img)
    formData.append("body", post_body)
    formData.append("title", post_title)
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }
    axios.post(`${url}posts`, formData, {
        headers: headers
    })
        .then((response) => {
            const post = response.data
            const data = post.data

            let content = `
            <div class="card shadow" style="margin-bottom: 30px;">
                <div class="info d-flex justify-content-between"
                    style="border-bottom: 1px solid rgba(128, 128, 128, 0.274); padding-bottom: 7px;padding-top: 7px;">
                    <div id="info_div" onclick="info_divClicked()">
                        <img id="post-user-image" src="${data.author.profile_image}" class="rounded-circle" alt=""
                            width="40px" height="40px" style="margin-left: 15px; margin-top: 5px;">
                        <b id="post-user-name" style="display: inline-block;">${data.author.name}</b>
                    </div>
                    <span class="twoButtons" style="margin-right: 10px;">
                        <button onclick="saveEditedPost('${encodeURIComponent(JSON.stringify(post))}')" class="btn btn-secondary">Edit</button>
                        <button onclick="saveEditedPost('${encodeURIComponent(JSON.stringify(post))}')" class="btn btn-danger">Delete</button>
                    </span>
                </div>
                <div class="card-body"
                    style="border-bottom: 1px solid rgba(128, 128, 128, 0.274); padding-bottom: 5px;">
                    <img src="${data.image}" alt="" width="100%" style="margin-bottom: 10px;">
                    <span style="color:rgb(193, 193, 193)">${data.created_at}</span>
                    <h5 class="card-title" style="margin-top: 10px;">${data.title}</h5>
                    <p class="card-text" style="margin-bottom: 10px;margin-top: 10px;">${data.body}</p>
                </div>
                <div onclick="ClickedPost('${encodeURIComponent(JSON.stringify(post))}')" style="padding: 17px; cursor:pointer;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen"
                        viewBox="0 0 16 16">
                        <path
                            d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                    </svg> (<span>${data.comments_count}</span>) comment
                </div>
            </div>  
            `
            document.getElementById("posts").innerHTML += content
            EditingUserInfo(data.id)
            setupUI()
            const modal = document.getElementById("addPostBtn")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            Swal.fire({
                position: "center",
                icon: "success",
                title: "post created successfully",
                showConfirmButton: false,
                timer: 1500
            });
            window.location.reload();
        })
        .catch((error) => {
            Swal.fire({
                position: "center",
                icon: "warning",
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 1500
            });
        })
}

function setupUI() {
    let token = localStorage.getItem("token")
    let buttonsDiv = document.getElementById("buttons")
    let buttons2Div = document.getElementById("buttons2")
    let btn = document.getElementById("addPost")
    if (token == null) {
        buttonsDiv.style.display = "block"
        buttons2Div.style.display = "none"
        btn.style.display = "none"
    }
    else {
        buttonsDiv.style.display = "none"
        buttons2Div.style.display = "block"
        btn.style.display = "block"
    }

}

function register() {
    const userName = document.getElementById("userNAME").value
    const Name = document.getElementById("Name").value
    const img = document.getElementById("reg-img").files[0]
    const pass = document.getElementById("userPass").value

    let formData = new FormData();
    formData.append("username", userName);
    formData.append("password", pass);
    formData.append("name", Name);
    formData.append("image", img);

    const headers = {
        "Content-Type": "multipart/form-data",
    }
    axios.post(`${url}register`, formData, {
        headers: headers
    }).then((response) => {
        const data = response.data
        let token = data.token
        let user = data.user
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        const modal = document.getElementById("register-bt")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Regestring new user successfully",
            showConfirmButton: false,
            timer: 1500
        });
        getTokenandUser()
        setupUI()

    }).catch((error) => {
        Swal.fire({
            position: "center",
            icon: "warning",
            title: error.response.data.message,
            showConfirmButton: false,
            timer: 1500
        });
    })

}

function login() {
    let user = document.getElementById("username-input").value
    let pass = document.getElementById("password-input").value
    let params = {
        "username": user,
        "password": pass
    }
    axios.post(`${url}login`, params)
        .then((response) => {
            let data = response.data
            let token = data.token
            let userObj = data.user
            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify(userObj))
            const modal = document.getElementById("login")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Logging in successfully",
                showConfirmButton: false,
                timer: 1500
            });
            getTokenandUser()
            setupUI()
        })
        .catch((error) => {
            Swal.fire({
                position: "center",
                icon: "warning",
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 1500
            });
        })
}

function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    Swal.fire({
        position: "center",
        icon: "success",
        title: "Logged out successfully",
        showConfirmButton: false,
        timer: 1500
    });
    setupUI()
}

function getCurrentUserId() {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("postId")
    return id
}


function current_divClicked(userObj) {
    user = JSON.parse(decodeURIComponent(userObj))
    window.location = `profile.html?postId=${user.id}`
}

function saveEditedPost(obj) {
    let post = JSON.parse(decodeURIComponent(obj))
    let N_post = JSON.stringify(post)
    localStorage.setItem("EditedPost", N_post)
}

function deletePost() {
    let post = JSON.parse(localStorage.getItem("EditedPost"))
    let token = localStorage.getItem("token")
    localStorage.removeItem("EditedPost")

    let postId = post.id
    let userId = post.author.id
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }
    axios.delete(`${url}posts/${postId}`, {
        headers: headers
    }).then((response) => {
        const modal = document.getElementById("deleteBt")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Post Deleted successfully",
            showConfirmButton: false,
            timer: 1500
        });
        window.location.reload();
        EditingUserInfo(userId)
        PersonCardSetp()
        setupUI()
    })
        .catch((error) => {
            Swal.fire({
                position: "center",
                icon: "warning",
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 1500
            });
        })
}

function EditingUserInfo(id) {
    axios.get(`${Baseurl}users/${id}`)
        .then((response) => {
            let data = response.data.data
            console.log(data)
            let user = JSON.stringify(data)
            localStorage.setItem("user", user)
        })
        .catch((error) => {
            Swal.fire({
                position: "center",
                icon: "warning",
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 1500
            });
        })
}

function UpdatePost() {
    let post = JSON.parse(localStorage.getItem("EditedPost"))
    localStorage.removeItem("EditedPost")
    let NewTitle = document.getElementById("edit-post-title").value
    let NewBody = document.getElementById("edit-post-body").value
    let NewImg = document.getElementById("edit-post-img").files[0]

    let postId = post.id
    let token = localStorage.getItem("token")
    let param = {
        "title": NewTitle,
        "body": NewBody
    }

    const headers = {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
    }
    axios.put(`${url}posts/${postId}`, param, {
        headers: headers
    }).then((response) => {
        let data = response.data.data
        window.location.reload()
    })
}

function ClickedPost(obj) {
    user = JSON.parse(decodeURIComponent(obj))
    window.location = `comments.html?postId=${user.id}`
}

function toggleLoader(show = true) {
    if (show) {
        document.getElementById("loader").style.visibility = 'visible'
    } else {
        document.getElementById("loader").style.visibility = 'hidden'
    }
}