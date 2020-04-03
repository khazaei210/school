const $wrapper = document.querySelector('.news__container');
const $results = document.querySelector('.results');
const $btn__remove = document.querySelector('.remove');
const $btn__removeAboutUs = document.querySelector('.removeAboutUs');
const $btn__logout = document.querySelector('.logout');
const $add__form = document.querySelector('.addNews');
const $update__form = document.querySelector('.update');
const $search__input = document.querySelector('.input__search');
const $search__box = document.querySelector('.news .tool__box .search__box');
const $aboutUs__form = document.querySelector('.aboutUs');
const $aboutUs__btn = document.querySelector('.aboutUs-btn');
const $educationYear__form = document.querySelector('.content .education__year div .educationYear');
const $teamMembers__form = document.querySelector('.team');
const $teamMembers__container = document.querySelector('.teamMembers__container');
const $teamMembers__btn = document.querySelector('.team_member__section');
const $btn__removeTeamMembers = document.querySelector('.removeTeamMembers');
const $btn__removeEducationYear = document.querySelector('.removeEducationYear');
const $aboutUs__container = document.querySelector('.aboutUs__container');
const $educationYear__container = document.querySelector('.educationYear__container');
const $students__search__box = document.querySelector('.students .search__tools');
const $students__result__container = document.querySelector('.students .search__result__container');
const $profileContainer = document.querySelector('.showProfile__container');
const $admin__payment__form = document.querySelector('.paymentPart .payment__form');
const LIMIT = 3;
//------------------ show / hide sections --------------------------

const showHide = (blockClass, activeClass)=>{
    document.querySelector('.content .dashbord').style.display = 'none';
    document.querySelector('.content .students').style.display = 'none';
    document.querySelector('.content .news').style.display = 'none';
    document.querySelector('.content .teacher').style.display = 'none';
    document.querySelector('.content .course').style.display = 'none';
    document.querySelector('.content .team__members').style.display = 'none';   
    document.querySelector('.content .about__us').style.display = 'none';
    document.querySelector('.content .education__year').style.display = 'none';
    document.querySelector('.dashbord__section').classList.remove('active-menu');
    document.querySelector('.students__section').classList.remove('active-menu');
    document.querySelector('.news__section').classList.remove('active-menu');
    document.querySelector('.course__section').classList.remove('active-menu');
    document.querySelector('.teacher__section').classList.remove('active-menu');
    document.querySelector('.educationYear__section').classList.remove('active-menu');
    document.querySelector('.team_member__section').classList.remove('active-menu');
    document.querySelector('.aboutUs__section').classList.remove('active-menu');
    document.querySelector(`${blockClass}`).style.display = 'block';
    document.querySelector(`${activeClass}`).classList.add('active-menu');


}

//------------------------ change password listener ------------------------
document.querySelector('.password__section').addEventListener('click', async () => {
    //---------------------change password-----------------------------
        const { value: formValues } = await Swal.fire({
            title: 'تغییر رمز عبور',
            showCancelButton: true,
            confirmButtonText: 'تایید',
            cancelButtonText: 'انصراف',
            html:
            '<input id="swal-input1" class="swal2-input" placeholder="رمز عبور فعلی" type="password">'+
            '<input id="swal-input2" class="swal2-input" placeholder="رمز عبور جدید" type="password">' +
            '<input id="swal-input3" class="swal2-input" placeholder="تکرار رمز عبور جدید" type="password">',
            focusConfirm: false,
            showLoaderOnConfirm: true,
            preConfirm: () => {
            return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value,
                document.getElementById('swal-input3').value
            ]
            }
        })
        
        if (formValues) {
            if (formValues[1] !== formValues[2]) {
                Swal.fire({
                    icon: 'error',
                    title: 'خطا!',
                    text: ' رمز عبور جدید با تکرار آن یکسان نیست!!!',
                    confirmButtonText: 'تایید'
                })
            }
            else
            {
                const token = localStorage.getItem('token');
                show();
                axios({
                    method: 'post',
                    url: '/admin/changePassword',
                    data: {
                        formValues
                    },
                    headers: {"Authorization" : `Bearer ${token}`} 
                })
                .then(data => {
                    hide();
                    if(data.data.login){
                        const token = localStorage.getItem('token');
                        if (token) localStorage.removeItem('token');
                        return  window.location.replace("/admin/login");
                    }
                    if (data.data === 'changed'){
                        Swal.fire({
                            icon: 'success',
                            title: 'رمز شما با موفقیت تغییر کرد',
                            confirmButtonText: 'تایید'
                        })
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'خطا!',
                            text: ' رمز عبور  اشتباه است!!!',
                            confirmButtonText: 'تایید'
                        })
                    }
                })
                .catch(e=> console.log(e))
            } 
        }
})
//-------------------educationYear section function------------------------
document.querySelector('.educationYear__section').addEventListener('click', ()=>{
    showHide('.content .education__year','.educationYear__section')
})
//-------------------teacher section function------------------------
document.querySelector('.teacher__section').addEventListener('click', ()=>{
    showHide('.content .teacher','.teacher__section')
})
//-------------------course section function------------------------
document.querySelector('.course__section').addEventListener('click', ()=>{
    showHide('.content .course','.course__section')
})
//-------------------students section function------------------------
document.querySelector('.students__section').addEventListener('click', ()=>{
    showHide('.content .students','.students__section');
    getStudents();
})
//-------------------aboutUs section function------------------------
document.querySelector('.aboutUs__section').addEventListener('click', ()=>{
    showHide('.content .about__us','.aboutUs__section')
})
//-------------------news section function------------------------
document.querySelector('.news__section').addEventListener('click', ()=>{
    showHide('.content .news','.news__section');

})
//-------------------dashbord section function------------------------
document.querySelector('.dashbord__section').addEventListener('click', ()=>{
    showHide('.content .dashbord','.dashbord__section');
    setActive('.chart__box', '.chart__section');
    totalPayments();
    paymentStatus();
    getEducationYears();
})
//-------------------team member section function------------------------
$teamMembers__btn.addEventListener('click', ()=>{
    showHide('.content .team__members','.team_member__section');

})
//-------------------fileSize function------------------------
const fileSize = (el)=>{
    if (el.size<=2000000)
        return true
    else
        return false
}
//-------------------get educationYear function------------------------

const getEducationYear = ()=>{
    const tokenStr = localStorage.getItem('token');
    show();
    axios({
        method: 'get',
        url: '/admin/educationYear',
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    .then(data=>{
        hide();
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return  window.location.replace("/admin/login");
        }

        $educationYear__container.querySelector('table').innerHTML = '';
        let html = '<tr><th>ردیف</th><th>انتخاب</th><th>سال تحصیلی</th><th>مبلغ شهریه</th><th>وضعیت</th><th>ویرایش</th><th>حذف</th></tr>';

        data.data.forEach( (el, index) =>{
            html += `<tr>
            <td>${index + 1}</td>
            <td><input class="check" type="checkbox" value="${el._id}"></td>
            <td>${el.year}</td>
            <td>${setPriceFormatV2(el.tuition)} &nbsp; ریال</td>
            <td>${el.isActive ? 'فعال':'غیر فعال'}</td>
            <td><a href="#" class="btn__check submit-btn" onclick="updateEducationYear('${el._id}')"><i class="fas fa-edit fa-lg"></i></a></td>
            <td><a href="#" class="delete__btn" onclick="deleteEducationYear('${el._id}')"><i class="fas fa-trash-alt fa-lg"></i></a>
            </td>
            </tr>`;   
        })
        $educationYear__container.querySelector('table').insertAdjacentHTML('beforeend', html);
    })
        .catch(e=>console.log(e))
}
//------------------- updateEducationYear function ------------------------
const updateEducationYear = id => {
    const tokenStr = localStorage.getItem('token');
    $educationYear__form.querySelector('.educationYear__update__btn').style.display = 'inline-block';
    $educationYear__form.querySelector('.educationYear__reset__btn').style.display = 'inline-block';
    $educationYear__form.querySelector('.educationYear__btn').style.display = 'none';
    const url = `/admin/getEducationYear?id=${id}`;
    show();
    axios({
        method: 'get',
        url: url,
        headers: {"Authorization" : `Bearer ${tokenStr}`}
        
    })
    .then(data=>{
        hide();
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return  window.location.replace("/admin/login");
        }
        $educationYear__form.querySelector('input[name="year"]').value = data.data.year;
        $educationYear__form.querySelector('input[name="tuition"]').value = data.data.tuition;
        $educationYear__form.querySelector('input[name="isActive"]').checked = data.data.isActive;
        $educationYear__form.querySelector('.educationYear__update__btn').value = data.data._id;
        $educationYear__form.querySelector('.cost4').textContent = setPriceFormatV2(data.data.tuition);
        
    })
    .catch(e=>console.log(e))
}

//-------------------Reset EducationYear listener------------------------
$educationYear__form.querySelector('.educationYear__reset__btn').addEventListener('click', ()=>{
   $educationYear__form.querySelector('.educationYear__reset__btn').style.display = 'none';
   $educationYear__form.querySelector('.educationYear__update__btn').style.display = 'none';
   $educationYear__form.querySelector('.educationYear__btn').style.display = 'block';
   $educationYear__form.querySelector('.cost4').textContent = '';
   $educationYear__form.reset();
})

//------------------------ update educationYear listener ---------------------------
$educationYear__form.querySelector('.educationYear__update__btn').addEventListener('click', async (e)=>{
    
    e.preventDefault();
    const tokenStr = localStorage.getItem('token');
    const year = $educationYear__form.querySelector('input[name="year"]').value;
    const tuition = $educationYear__form.querySelector('input[name="tuition"]').value;
    const isActive = $educationYear__form.querySelector('input[name="isActive"]').checked;
    const id = $educationYear__form.querySelector('.educationYear__update__btn').value; 
    show();
    axios({
        method: 'patch',
        url: `/admin/updateEducationYear?id=${id}`,
        data: {
            year,
            tuition,
            isActive
        },
        headers: {
            'Authorization' : `Bearer ${tokenStr}`
        }
       })
        .then((data)=>{
            hide();
            if(data.data.login){
                const token = localStorage.getItem('token');
                if (token) localStorage.removeItem('token');
                return  window.location.replace("/admin/login");
            }
            if (data.data === 'exist')
                return Swal.fire({
                    icon: 'error',
                    title: 'در حال حاضر یک سال تحصیلی فعال وجود دارد',
                    confirmButtonText: 'تایید'
                })
            $educationYear__form.querySelector('.educationYear__reset__btn').style.display = 'none';
            $educationYear__form.querySelector('.educationYear__update__btn').style.display = 'none';
            $educationYear__form.querySelector('.educationYear__btn').style.display = 'block';
            $educationYear__form.querySelector('.cost4').textContent = '';
            $educationYear__form.reset();
            getEducationYear();
            Swal.fire({
                icon: 'success',
                title: 'تغییرات با موفقیت ثبت شد.',
                confirmButtonText: 'تایید'
            })
        })
    
})
//-------------------Add educationYear Listener------------------------

$educationYear__form.querySelector('.educationYear__btn').addEventListener('click', (e)=>{
   e.preventDefault();
    const tokenStr = localStorage.getItem('token');

    const year = $educationYear__form.querySelector('input[name="year"]').value;
    let tuition = $educationYear__form.querySelector('input[name="tuition"]').value;
    //tuition = digitToEnglish(tuition);
    const isActive = $educationYear__form.querySelector('input[name="isActive"]').checked;
    show();
    axios({
        method: 'post',
        url: '/admin/addNewYear',
        data: {
            year,
            tuition,
            isActive
        },
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    .then((data) => {
        hide();
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return  window.location.replace("/admin/login");
        }
        Swal.fire({
            icon: 'success',
            title: 'رکورد شما با موفقیت ثبت شد.',
            confirmButtonText: 'تایید'
        })
        $educationYear__form.reset();
        getEducationYear();
    })
    .catch(e=>console.log(e))   

})
//------------------------------
$educationYear__form.querySelector('input[name="tuition"]').addEventListener('keypress', (e)=>{
    setPriceFormat('.cost4', e);
})
//-------------------Log out BTN Listener------------------------

$btn__logout.addEventListener('click', () => {
    const tokenStr = localStorage.getItem('token');
    show();
    axios({
        method: 'post',
        url: '/admin/logout',
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    }).then((data)=>{
        hide();
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return  window.location.replace("/admin/login");
        }
    }).catch(e => window.location.replace("/admin/login"))
})

//-------------------Get News Function------------------------

const getNews = ()=>{
    const tokenStr = localStorage.getItem('token');
    show();
    axios({
        method: 'get',
        url: '/admin/news',
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    .then(data=>{
        hide();
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return  window.location.replace("/admin/login");
        }
        $wrapper.querySelector('table').innerHTML = '';
        let html = `
        <tr>
            <th>ردیف</th>
            <th>انتخاب</th>
            <th>عنوان</th>
            <th>خلاصه خبر</th>
            <th>ویرایش</th>
            <th>حذف</th>
        </tr>`;

        data.data.forEach( (el, index) =>{
            html += `<tr>
            <td>${index + 1}</td>
            <td><input class="check" type="checkbox" value="${el._id}"></td>
            <td>${el.title.toString().substring(0,20) + '...'}</td>
            <td>${el.shortDescription.toString().substring(0,55) + '...'}</td>
            <td><a href="#" class="btn__check submit-btn" onclick="updateNews('${el._id}')"><i class="fas fa-edit fa-lg"></i></a></td>
            <td><a href="#" class="delete__btn" onclick="deleteNews('${el._id}')"><i class="fas fa-trash-alt fa-lg"></i></a>
            </tr>`;   
        })
        $wrapper.querySelector('table').insertAdjacentHTML('beforeend', html);

    })
    .catch(e=>console.log(e))
}
//-------------------delete News one Item function -------------
const deleteNews = (id)=>{
    const tokenStr = localStorage.getItem('token');
    const url = `/admin/deleteNews?id=${id}`;
      Swal.fire({
        title: 'اخطار',
        text: "آیا مطمئن هستید؟",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'خیر',
        confirmButtonText: 'بله'
      }).then((result) => {
        if (result.value) {
            show();
            axios({
                method: "post",
                url,
                headers: {"Authorization" : `Bearer ${tokenStr}`} 
            })
            .then(data => {
                hide();
                if(data.data.login){
                    const token = localStorage.getItem('token');
                    if (token) localStorage.removeItem('token');
                    return window.location.replace("/admin/login");
                }
                getNews()
                Swal.fire({
                    icon: 'success',
                    title: 'آیتم مورد نظر با موفقیت حذف شد.',
                    confirmButtonText: 'تایید'
                })
            })
            .catch(e => console.log(e));
        }
      })
        
}


//-------------------Windowd Load Listener------------------------

window.addEventListener('load', ()=>{
    
    getNews();
    getAboutUs();
    getTeamMembers();
    getEducationYear();
    getEducationYears();
    getPaymentNum();
})


//-------------------Add News Listener------------------------


$add__form.querySelector('.news__add__btn').addEventListener('click', (e)=>{
    e.preventDefault();
    const tokenStr = localStorage.getItem('token');
    let formData = new FormData();
    
    const title = $add__form.querySelector('input[name="title"]').value;
    const shortDescription = $add__form.querySelector('input[name="shortDescription"]').value;
    const image = $add__form.querySelector('input[name="image"]').files[0];
    const expireDate = $add__form.querySelector('input[name="expireDate"]').value;
    const publish = $add__form.querySelector('input[name="publish"]').checked;
    
    
    formData.append("title", title);
    formData.append("shortDescription", shortDescription);
    formData.append("fullDescription", editor.html.get());
    formData.append("expireDate", expireDate);
    formData.append("isPublish", publish);
    formData.append("image", image);
    show();
    axios.post('/admin/addNews', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization' : `Bearer ${tokenStr}`
        }
    })
    .then((data)=>{
        hide();
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        Swal.fire({
            icon: 'success',
            title: 'رکورد شما با موفقیت ثبت شد.',
            confirmButtonText: 'تایید'
        })
        $add__form.reset();
        editor.html.set('');
        getNews();
    })
    .catch(e=>console.log(e))  
})

//--------------------------Check news image size-----------------------------------

$add__form.querySelector('input[name="image"]').addEventListener('change', (e)=>{
    if(e.target.files.length > 0){
        if(!fileSize(e.target.files[0])){
            Swal.fire({
                icon: 'error',
                title: 'حجم فایل انتخابی باید کمتر از دو مگا بایت باشد',
                confirmButtonText: 'تایید'
            })
            $add__form.querySelector('input[name="image"]').value = '';
        }
        
    }
})

//-------------------Add AboutUs Listener------------------------

$aboutUs__form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const tokenStr = localStorage.getItem('token');
    
    let formData = new FormData();
    const title = $aboutUs__form.querySelector('input[name="title"]').value;
    const description = $aboutUs__form.querySelector('input[name="description"]').value;
    const image = $aboutUs__form.querySelector('input[name="image"]').files[0];
    
    formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);
    show();
    axios.post('/admin/aboutUs', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization' : `Bearer ${tokenStr}`
        }
    })
    .then((data) => {
        hide();
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        Swal.fire({
            icon: 'success',
            title: 'رکورد شما با موفقیت ثبت شد.',
            confirmButtonText: 'تایید'
        })
        $aboutUs__form.reset();
        getAboutUs();
    })
    .catch(e=>console.log(e))   
    
})
//--------------------------Check aboutUs image size-----------------------------------

$aboutUs__form.querySelector('input[name="image"]').addEventListener('change', (e)=>{
    if(e.target.files.length > 0){
        if(!fileSize(e.target.files[0])){
            Swal.fire({
                icon: 'error',
                title: 'حجم فایل انتخابی باید کمتر از دو مگا بایت باشد',
                confirmButtonText: 'تایید'
            })
            $aboutUs__form.querySelector('input[name="image"]').value = '';
        }
        else{
            $aboutUs__form.querySelector('#aboutucPicId').textContent = '';
        }
    }
})

//-------------------Add teamMembers Listener------------------------

$teamMembers__form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const tokenStr = localStorage.getItem('token');
    
    let formData = new FormData();
    const name = $teamMembers__form.querySelector('input[name="name"]').value;
    const resume = $teamMembers__form.querySelector('input[name="resume"]').value;
    const image = $teamMembers__form.querySelector('input[name="image"]').files[0];
    
    formData.append("image", image);
    formData.append("name", name);
    formData.append("resume", resume);
    show();
    axios.post('/admin/members', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization' : `Bearer ${tokenStr}`
        }
    })
    .then((data)=>{
        hide();
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        Swal.fire({
            icon: 'success',
            title: 'رکورد شما با موفقیت ثبت شد.',
            confirmButtonText: 'تایید'
        })
        getTeamMembers();
    })
    .catch(e=>console.log(e))   
    
})
//--------------------------Check team members image size-----------------------------------

$teamMembers__form.querySelector('input[name="image"]').addEventListener('change', (e)=>{
    if(e.target.files.length > 0){
        if(!fileSize(e.target.files[0])){
            Swal.fire({
                icon: 'error',
                title: 'حجم فایل انتخابی باید کمتر از دو مگا بایت باشد',
                confirmButtonText: 'تایید'
            })
            $teamMembers__form.querySelector('input[name="image"]').value = '';
        }
        else{
            $teamMembers__form.querySelector('#teamPicId').textContent = '';
        }
    }
})
//-------------------Update News Function------------------------

const updateNews = (id)=>{
    const tokenStr = localStorage.getItem('token');
    $add__form.querySelector('.news__update__btn').style.display = 'inline-block';
    $add__form.querySelector('.news__reset__btn').style.display = 'inline-block';
    $add__form.querySelector('.news__add__btn').style.display = 'none';
    const url = `/admin/getNews?id=${id}`;
    show();
    axios({
        method: 'get',
        url: url,
        headers: {"Authorization" : `Bearer ${tokenStr}`}
        
    })
    .then(data=>{
        hide();
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        $add__form.querySelector('input[name="title"]').value = data.data.title;
        $add__form.querySelector('input[name="shortDescription"]').value = data.data.shortDescription;
        editor.html.set(data.data.fullDescription);
        $add__form.querySelector('input[name="expireDate"]').value = data.data.expireDate;
        $add__form.querySelector('input[name="publish"]').checked = data.data.isPublish;
        $add__form.querySelector('.news__update__btn').value = data.data._id;
        
    })
    .catch(e=>console.log(e))
}

//-------------------Update News Listener------------------------

$add__form.querySelector('.news__update__btn').addEventListener('click', async (e)=>{
    const tokenStr = localStorage.getItem('token');
    let formData = new FormData();
    
    const title = $add__form.querySelector('input[name="title"]').value;
    const shortDescription = $add__form.querySelector('input[name="shortDescription"]').value;
    const image = $add__form.querySelector('input[name="image"]').files[0];
    const expireDate = $add__form.querySelector('input[name="expireDate"]').value;
    const publish = $add__form.querySelector('input[name="publish"]').checked;
    const id = $add__form.querySelector('.news__update__btn').value; 
    
    formData.append("title", title);
    formData.append("shortDescription", shortDescription);
    formData.append("fullDescription", editor.html.get());
    formData.append("expireDate", expireDate);
    formData.append("isPublish", publish);
    formData.append("image", image);
    formData.append("_id", id);
    show();
    axios.patch('/admin/updateNews', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization' : `Bearer ${tokenStr}`
        }
    })
    .then((data)=>{
        hide();
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }        $add__form.querySelector('.news__update__btn').style.display = 'none';
        $add__form.querySelector('.news__reset__btn').style.display = 'none';
        $add__form.querySelector('.news__add__btn').style.display = 'block';
        $add__form.reset();
        getNews();
        Swal.fire({
            icon: 'success',
            title: 'تغییرات با موفقیت ثبت شد.',
            confirmButtonText: 'تایید'
        })
    })
    
})
//-------------------Reset news listener------------------------
$add__form.querySelector('.news__reset__btn').addEventListener('click', ()=>{
    $add__form.querySelector('.news__update__btn').style.display = 'none';
    $add__form.querySelector('.news__reset__btn').style.display = 'none';
    $add__form.querySelector('.news__add__btn').style.display = 'block';
    $add__form.reset();
})
//-------------------Search News Listener------------------------

$search__box.querySelector('a').addEventListener('click', async (e)=>{
    const tokenStr = localStorage.getItem('token');
    
    const title =  $search__input.value;
    if (!title) return getNews();
    $wrapper.innerHTML = '';
    show();
    axios({
        method: 'post',
        url: '/admin/getNews',
        data: {
            title
        },
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    .then((data)=>{
        hide();
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }        data.data.forEach(el=>{
            const title = el.title.toString().substring(0,20) + '...';
            const description = el.shortDescription.toString().substring(0,55) + '...';
            const id = el._id;
            const html = Mustache.render( list__news__temp, {title, description, id, updateID: id});
            $wrapper.insertAdjacentHTML('beforeend', html);
            
        })
    });
});

//---------------------get about us ---------------------------
const getAboutUs = ()=>{
    const tokenStr = localStorage.getItem('token');
    show();
    axios({
        method: 'get',
        url: '/admin/aboutUs',
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    .then(data=>{
        hide();
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }        $aboutUs__container.querySelector('table').innerHTML = '';
        let html =`
        <tr>
            <th>ردیف</th>
            <th>انتخاب</th>
            <th>عنوان</th>
            <th>شرح</th>
            <th>ویرایش</th>
            <th>حذف</th>
        </tr>`;

        data.data.forEach((el, index)=>{
            html += `
            <tr>
                <td>${index + 1}</td>
                <td><input class="check" type="checkbox" value="${el._id}"></td>
                <td>${el.title}</td>
                <td>${el.description}</td>
                <td><a href="#" class="btn__check submit-btn" onclick="update('${el._id}')"><i class="fas fa-edit fa-lg"></i></a></td>
                <td><a href="#" class="delete__btn" onclick="deleteAboutUs('${el._id}')"><i class="fas fa-trash-alt fa-lg"></i></a></td>
            </tr>
            `
        })
        $aboutUs__container.querySelector('table').insertAdjacentHTML('beforeend', html);
  
    })
    .catch(e=>console.log(e))
}
//---------------------get team members ---------------------------
const getTeamMembers = ()=>{
    const tokenStr = localStorage.getItem('token');
    show();
    axios({
        method: 'get',
        url: '/admin/getTeamMembers',
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    .then(data=>{
        hide();
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        $teamMembers__container.querySelector('table').innerHTML = '';
        let html =`
        <tr>
            <th>ردیف</th>
            <th>انتخاب</th>
            <th>نام</th>
            <th>سابقه</th>
            <th>ویرایش</th>
            <th>حذف</th>
        </tr>`;

        data.data.forEach((el, index)=>{
            html += `
            <tr>
                <td>${index + 1}</td>
                <td><input class="check" type="checkbox" value="${el._id}"></td>
                <td>${el.name}</td>
                <td>${el.resume}</td>
                <td><a href="#" class="edit" onclick="updateTeamMembers('${el._id}')" ><i class="fas fa-edit fa-lg"></i></a></td>
                <td><a href="#" class="find" onclick="deleteTeamMembers('${el._id}')"><i class="fas fa-trash-alt fa-lg"></i></a></td>
            </tr>
            `
        })
        $teamMembers__container.querySelector('table').insertAdjacentHTML('beforeend', html);
  
    })
    .catch(e=>console.log(e))
}

//-------------------Remove BTN Listener------------------------
$btn__remove.addEventListener('click', () => {
    
    deleteItems($wrapper, '/admin/removeNews', getNews)   
});
//--------------------------remove aboutUs ---------------------------
$btn__removeAboutUs.addEventListener('click', () => {
    
    deleteItems($aboutUs__container, '/admin/removeAbouUs', getAboutUs )
});
//--------------------------remove team members ---------------------------
$btn__removeTeamMembers.addEventListener('click', () => {
    
    deleteItems($teamMembers__container, '/admin/removeTeamMembers', getTeamMembers )   
});
//--------------------- remove EducationYears ----------------
$btn__removeEducationYear.addEventListener('click', ()=>{
    deleteItems($educationYear__container, '/admin/removeEducationYear', getEducationYear )   

})
//------------------------ UPDATE ABOUT US ----------------------
const update = (id)=>{
    const tokenStr = localStorage.getItem('token');
    $aboutUs__form.querySelector('.aboutUs__update__btn').style.display = 'inline-block';
    $aboutUs__form.querySelector('.aboutUs__reset__btn').style.display = 'inline-block';
    $aboutUs__form.querySelector('.aboutUs-btn').style.display = 'none';
    const url = `/admin/getAboutUs?id=${id}`;
    show();
    axios({
        method: 'get',
        url: url,
        headers: {"Authorization" : `Bearer ${tokenStr}`}
    
    })
    .then(data=>{
        hide();
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        $aboutUs__form.querySelector('input[name="title"]').value = data.data.title;
        $aboutUs__form.querySelector('input[name="description"]').value = data.data.description;
        $aboutUs__form.querySelector('.aboutUs__update__btn').id = data.data._id;

    })
    .catch(e=>console.log(e))
}


//----------------- display about us ----------------------------
const displayAboutUs = () => {
    const tokenStr = localStorage.getItem('token');
    $aboutUs__container.textContent = '';
    show();
    axios({
        method: "post",
        url: "/admin/getAboutUsList",
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    .then(data=>{
        hide();
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
            data.data.forEach((el, index)=>{
            const background__color = index % 2 === 0 ? 'even':'odd';
            const title = el.title;
            const description = el.description;
            const id = el._id;
            
            const html = Mustache.render( aboutUs__template, {title, description, id, background__color});
            $aboutUs__container.insertAdjacentHTML('beforeend', html);
        })
    })
    .catch(e => console.log(e))
}

//---------------------------delete about us row --------------------
const deleteAboutUs = id => {
    const tokenStr = localStorage.getItem('token');
    const url = `/admin/deleteAboutUs?id=${id}`;
    Swal.fire({
        title: 'اخطار',
        text: "آیا مطمئن هستید؟",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'خیر',
        confirmButtonText: 'بله'
      }).then((result) => {
        if (result.value) {
            show();
            axios({
                method: "post",
                url,
                headers: {"Authorization" : `Bearer ${tokenStr}`} 
            })
            .then(data => {
                hide();
                if(data.data.login){
                    const token = localStorage.getItem('token');
                    if (token) localStorage.removeItem('token');
                    return window.location.replace("/admin/login");
                }
                getAboutUs()
                Swal.fire({
                    icon: 'success',
                    title: 'آیتم مورد نظر با موفقیت حذف شد.',
                    confirmButtonText: 'تایید'
                })
            })
            .catch(e => console.log(e));
        }
      })
    }

//------------------------ UPDATE Team members ----------------------
const updateTeamMembers = (id) => {
    
    const tokenStr = localStorage.getItem('token');
    $teamMembers__form.querySelector('.teamMember__update__btn').style.display = 'inline-block';
    $teamMembers__form.querySelector('.teamMember__reset__btn').style.display = 'inline-block';
    $teamMembers__form.querySelector('.submit-btn').style.display = 'none';
    const url = `/admin/getTeamMember?id=${id}`;
    show();
    axios({
        method: 'get',
        url: url,
        headers: {"Authorization" : `Bearer ${tokenStr}`}
    
    })
    .then(data=>{
        hide();
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        $teamMembers__form.querySelector('input[name="name"]').value = data.data.name;
        $teamMembers__form.querySelector('input[name="resume"]').value = data.data.resume;
        $teamMembers__form.querySelector('.teamMember__update__btn').id = data.data._id;

    })
    .catch(e=>console.log(e))
}
//------------ delete teamMember row -----------------
const deleteTeamMembers = id => {
    const tokenStr = localStorage.getItem('token');
    const url = `/admin/delTeamMember?id=${id}`;
    
    Swal.fire({
        title: 'اخطار',
        text: "آیا مطمئن هستید؟",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'خیر',
        confirmButtonText: 'بله'
      }).then((result) => {
        if (result.value) {
            show();
            axios({
                method: "post",
                url,
                headers: {"Authorization" : `Bearer ${tokenStr}`} 
            })
            .then(data => {
                hide();
                if(data.data.login){
                    const token = localStorage.getItem('token');
                    if (token) localStorage.removeItem('token');
                    return window.location.replace("/admin/login");
                }
                getTeamMembers()
                Swal.fire({
                    icon: 'success',
                    title: 'آیتم مورد نظر با موفقیت حذف شد.',
                    confirmButtonText: 'تایید'
                })
            })
            .catch(e => console.log(e));
        }
      })
      
}
//------------ delete educationYear row -----------------
const deleteEducationYear = id =>{
    const tokenStr = localStorage.getItem('token');
    const url = `/admin/delEducationYear?id=${id}`;

    Swal.fire({
        title: 'اخطار',
        text: "آیا مطمئن هستید؟",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'خیر',
        confirmButtonText: 'بله'
      }).then((result) => {
        if (result.value) {
            show();
            axios({
                method: "post",
                url,
                headers: {"Authorization" : `Bearer ${tokenStr}`} 
            })
            .then(data => {
                hide();
                if(data.data.login){
                    const token = localStorage.getItem('token');
                    if (token) localStorage.removeItem('token');
                    return window.location.replace("/admin/login");
                }
                getEducationYear()
                Swal.fire({
                    icon: 'success',
                    title: 'آیتم مورد نظر با موفقیت حذف شد.',
                    confirmButtonText: 'تایید'
                })
            })
            .catch(e => console.log(e));
        }
      })
}
//------------------delete Items ------------------------------
const deleteItems = (container, route, func)=>{
    
    const tokenStr = localStorage.getItem('token');
    
        let chexkedNews = container.querySelectorAll('input:checked');
        if (!chexkedNews) return true
        chexkedNews = Array.from(chexkedNews);
        const data = [];
        chexkedNews.forEach(el=>{
            data.push({id: el.value})
        })
        if (data.length === 0){
            Swal.fire({
                icon: 'warning',
                title: 'شما هیچ آیتمی انتخاب نکرده اید.',
                confirmButtonText: 'تایید'
            })
        } else {
        
            Swal.fire({
                title: 'اخطار',
                text: "آیا مطمئن هستید؟",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'خیر',
                confirmButtonText: 'بله'
              }).then((result) => {
                if (result.value) {
                    show();
                    axios({
                        method: 'post',
                        url: route,
                        data: {
                            data
                        },
                        headers: {"Authorization" : `Bearer ${tokenStr}`} 
                    })
                    .then(data => {
                        hide();
                        if(data.data.login){
                            const token = localStorage.getItem('token');
                            if (token) localStorage.removeItem('token');
                            return window.location.replace("/admin/login");
                        }
                
                        func();
                        Swal.fire({
                            icon: 'success',
                            title: 'آیتم مورد نظر با موفقیت حذف شد.',
                            confirmButtonText: 'تایید'
                        })
                    })
                    .catch(e => console.log(e));
                }
              })
              
        }
}
    
//------------------------ Digit to ENG convertor ---------------------------
const digitToEnglish = (value)=>{
    // const persianDigit = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    let res;
    let newValue='';
    for (let i=0; i<value.length; i++){
        res = value.charCodeAt(i) - '۰'.charCodeAt(0);
        if (res>=0 && res<=9) 
            newValue += res
        else
            newValue += value.substring(i,i+1);
    }
    return newValue;
   }
   //------------------------ Digit to Persian convertor ---------------------------
const digitToPersian = (value)=>{
    const persianDigit = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    let res;
    let newValue='';
    for (let i=0; i<value.length; i++){
        res = value.charCodeAt(i) - '0'.charCodeAt(0);
        if (res>=0 && res<=9) 
            newValue += persianDigit[res]
        else
            newValue += value.substring(i,i+1);
    }
    return newValue;
}
   //-------------------- Set Price format function ---------------------------
const setPriceFormat = (classlabel, e)=>{
    setTimeout(function() {
        let newValue = '';
        let value = e.target.value;
        let label = document.querySelector(classlabel);
        let temp = '';
        //------------------reverse the string----------------
        for (let i=value.length; i>0; i--){
            newValue += value.substring(i-1,i);
        }
        //----------set , to string -----------------------
        for(let i=0; i< newValue.length; i++){
            if(i % 3 === 0 && i !== 0){
                temp += ',';
            }
            temp += newValue.substring(i, i+1);
        }
        //-------------- reverse ----------------------------
        newValue = '';
        for (let i=temp.length; i>0; i--){
            newValue += temp.substring(i-1,i);
        }
        label.textContent =  digitToPersian(newValue)
    },0)
}
const setPriceFormatV2 = (val)=>{
    
    let newValue = '';
    let value =  val + '';
    let temp = '';
    //------------------reverse the string----------------
    for (let i=value.length; i>0; i--){
        newValue += value.substring(i-1,i);
    }
    //----------set , to string -----------------------
    for(let i=0; i< newValue.length; i++){
        if(i % 3 === 0 && i !== 0){
            temp += ',';
        }
        temp += newValue.substring(i, i+1);
    }
    //-------------- reverse ----------------------------
    newValue = '';
    for (let i=temp.length; i>0; i--){
        newValue += temp.substring(i-1,i);
    }
    return (digitToPersian(newValue))
    
}
//---------------------- admin can search students ------------------------
$students__search__box.querySelector('a').addEventListener('click', async (e)=>{
    getStudents();
});
//---------------------------- get students --------------------
const getStudents = (limit=LIMIT, skip=0, current=1)=>{
    const tokenStr = localStorage.getItem('token');
    const select = $students__search__box.querySelector('select').value;
    const title =  $students__search__box.querySelector('.input__search').value;
    show();
    axios({
        method: 'post',
        url: '/admin/getStudents',
        data: {
            title,
            select,
            limit,
            skip
        },
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    .then((data)=>{
        hide();
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        $students__result__container.querySelector('table').innerHTML = '';
        let html =`
        <tr>
            <th>ردیف</th>
            <th>نام و نام خانوادگی</th>
            <th>نام پدر</th>
            <th>کد ملی</th>
            <th>شماره همراه</th>
            <th>مشاهده پروفایل</th>
        </tr>`;
        const realRow = (current-1)*LIMIT;
        data.data.student.forEach((el, index)=>{
            html += `
            <tr>
                <td>${index + 1 + realRow}</td>
                <td>${el.firstName}  ${el.lastName}</td>
                <td>${el.parentName}</td>
                <td>${el.nationalID}</td>
                <td>${el.mobileNumber}</td>
                <td><a href="#" class="find" onclick="showStudentProfile('${el._id}')"><i class="fas fa-tv"></i></a></td>
            </tr>
            `
        })
        document.querySelector('.showProfile__container').classList.remove('show');
        document.querySelector('.showProfile__container').classList.add('hide');
        $students__result__container.querySelector('table').insertAdjacentHTML('beforeend', html);
        html = [];
        
        $students__result__container.querySelector('.pagination').querySelector('.last').innerHTML = '';
        $students__result__container.querySelector('.pagination').querySelector('.pages').innerHTML = '';
        $students__result__container.querySelector('.pagination').querySelector('.first').innerHTML = '';
        let j = 1;
        for (let i=1; i<=data.data.len; i+=LIMIT){
            
            if (j===current) 
                html.push(`<div><a href="#" class="currentPage" onclick="getStudents(${LIMIT}, ${(j-1)*LIMIT}, ${j})">${j} </a></div>`);
            else
                html.push(`<div><a href="#" onclick="getStudents(${LIMIT}, ${(j-1)*LIMIT}, ${j})">${j} </a></div>`);  
            j++;
        }
        let newHtml = '';
        if (html.length>=3){

            if(current === (html.length)){
                newHtml = html[current-3] + html[current-2] + html[current-1];
            }
            else if(current  === (html.length - 1)){
                newHtml = html[current-2] + html[current-1] + html[current];
            }
            else {
                newHtml = html[current-1] + html[current] + html[current+1];
            }
        }else if (html.length===2){
            newHtml =  html[0] + html[1];

        }else if (html.length===1){
            newHtml =  html[0];
        }
        let previous = `
        <div>
        <a href="#" onclick="getStudents(${LIMIT}, ${0}, ${1})"><i class="fas fa-angle-double-left"></i></a>
        <a href="#" onclick="getStudents(${LIMIT}, ${current-2<0 ? 0 : (current-2)*LIMIT}, ${current-1>0 ? current-1:1})"><i class="fas fa-angle-left"></i></a>
        <div>
        `;
        let next = `
        <div>
        <a href="#" onclick="getStudents(${LIMIT}, ${current===html.length ? (current-1)* LIMIT : current*LIMIT}, ${current===html.length ? html.length : current+1})"><i class="fas fa-angle-right"></i></a>
        <a href="#" onclick="getStudents(${LIMIT}, ${(html.length-1)*LIMIT}, ${html.length})"><i class="fas fa-angle-double-right"></i></a>
        <div>
        `;
        $students__result__container.querySelector('.pagination').querySelector('.last').innerHTML = next;
        $students__result__container.querySelector('.pagination').querySelector('.pages').innerHTML = newHtml;
        $students__result__container.querySelector('.pagination').querySelector('.first').innerHTML = previous;
    
    });

}

//-------------------------- show student profile function -------------------------------------
const showStudentProfile = (id) => {
    const tokenStr = localStorage.getItem('token');
    show();
    axios({
        method: 'post',
        url: '/admin/getStudentInfo',
        data: {
            id
        },
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    .then(data => {
        hide();
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        document.querySelector('.showProfile__container').classList.remove('hide');
        document.querySelector('.showProfile__container').classList.add('show');
        $profileContainer.querySelector('.information').querySelector('input[name="firstName"]').value = data.data.student.firstName;
        $profileContainer.querySelector('.information').querySelector('input[name="lastName"]').value = data.data.student.lastName;
        $profileContainer.querySelector('.information').querySelector('input[name="NationalID"]').value = data.data.student.nationalID;
        $profileContainer.querySelector('.information').querySelector('input[name="mobileNumber"]').value = data.data.student.mobileNumber;
        $profileContainer.querySelector('.information').querySelector('input[name="parentName"]').value = data.data.student.parentName;
        $profileContainer.querySelector('.information').querySelector('input[name="address"]').value = data.data.student.address;
        $profileContainer.querySelector('.information').querySelector('input[name="yearOfBirth"]').value = data.data.student.yearOfBirth;
        $profileContainer.querySelector('.information').querySelector('input[name="zipCode"]').value = data.data.student.zipCode;
        $profileContainer.querySelector('.profilePart').querySelector('.changePassword').id = data.data.student._id;
        $profileContainer.querySelector('.information').querySelector('#img1').src = `../img/docs/${data.data.student.nationalID}/${data.data.student.pictureURL}`;
        $profileContainer.querySelector('.information').querySelector('#img2').src = `../img/docs/${data.data.student.nationalID}/${data.data.student.passportURL}`;
        $profileContainer.querySelector('.information').querySelector('#img3').src = `../img/docs/${data.data.student.nationalID}/${data.data.student.nationalIDURL}`;
        const years = data.data.year;
        let html = '';
        years.forEach(item=>{
            html = html + `<option value="${item.thisYear}">${item.thisYear}</option>`;
        })
        $profileContainer.querySelector('.payment__form').querySelector('select[name="years"]').innerHTML = html;

        let sumPayment = 0;
        html = '';
        data.data.currentPayments.forEach((item, index)=>{
            sumPayment += item.bill;
            let status = '';
            if (item.approve){
                if (item.isDiscount){
                    status = 'تخفیف'
                }else{
                    status = 'تایید شده'
                }
            }else{
                status = 'منتظر تایید'
            }
            html += `<tr> <td>${index+1}</td> <td>${item.payDate.substring(0,10)}</td> <td>${setPriceFormatV2(item.bill)}</td> <td>${status}</td> </tr>`
        })
        // draw(sumPayment, data.data.currentYear.tuition - sumPayment, 'cost8');
        document.getElementById('paid').textContent = `جمع پرداختی ها:  ${setPriceFormatV2(sumPayment)} ریال`;
        document.getElementById('remain').textContent = ` مانده حساب:  ${setPriceFormatV2(data.data.currentYear.tuition - sumPayment)} ریال`;
        const newhtml = '<tr> <th>ردیف</th> <th>تاریخ واریز</th> <th>مبلغ واریزی</th> <th>وضعیت پرداخت</th> </tr>' + html;
        document.getElementById('payments_table').innerHTML = newhtml;
        $admin__payment__form.querySelector('.submit').id = data.data.student.nationalID;
        
        
    })
    .catch(e => console.log(e))
}
//----------------change student password by admin function-------------------------------------------------
const changePassword = async (e)=>{
    const id = e.target.id;
    const { value: formValues } = await Swal.fire({
        title: 'تغییر رمز عبور',
        showCancelButton: true,
        confirmButtonText: 'تایید',
        cancelButtonText: 'انصراف',
        html:
          '<input id="swal-input2" class="swal2-input" placeholder="رمز عبور جدید" type="password">' +
          '<input id="swal-input3" class="swal2-input" placeholder="تکرار رمز عبور جدید" type="password">',
        focusConfirm: false,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return [
            document.getElementById('swal-input2').value,
            document.getElementById('swal-input3').value
          ]
        }
      })
      
      if (formValues) {
        if (formValues[0] !== formValues[1]) {
            Swal.fire({
                icon: 'error',
                title: 'خطا!',
                text: ' رمز عبور جدید با تکرار آن یکسان نیست!!!',
                confirmButtonText: 'تایید'
            })
        }
        else
        {
            const token = localStorage.getItem('token')
            show();
            axios({
                method: 'post',
                url: '/admin/changeStudentPassword',
                data: {
                    formValues,
                    id
                },
                headers: {"Authorization" : `Bearer ${token}`} 
            })
            .then(data => {
                hide();
                if(data.data.login){
                    const token = localStorage.getItem('token');
                    if (token) localStorage.removeItem('token');
                    return window.location.replace("/admin/login");
                }
                if (data.data === 'changed'){
                    Swal.fire({
                        icon: 'success',
                        title: 'رمز شما با موفقیت تغییر کرد',
                        confirmButtonText: 'تایید'
                      })

                }

            })
            .catch(e=> console.log(e))
        } 
      }
}
//------------------image hover listener -------------------------------
$profileContainer.querySelector('.information').querySelector('#img1').addEventListener('click', ()=>{
    const imageUrl = $profileContainer.querySelector('.information').querySelector('#img1').src;
    biggerImage(imageUrl, 150, 200)
})
$profileContainer.querySelector('.information').querySelector('#img2').addEventListener('click', ()=>{
    const imageUrl = $profileContainer.querySelector('.information').querySelector('#img2').src;
    biggerImage(imageUrl, 650, 400)
})
$profileContainer.querySelector('.information').querySelector('#img3').addEventListener('click', ()=>{
    const imageUrl = $profileContainer.querySelector('.information').querySelector('#img3').src;
    biggerImage(imageUrl, 550, 400)
})
const biggerImage = (imageUrl, width, height)=>{
    Swal.fire({
        imageUrl: imageUrl,
        imageWidth: width,
        imageHeight: height,
        imageAlt: 'Custom image',
      })
}
//-------------------admin payment form listener -------------------
$admin__payment__form.querySelector('.submit').addEventListener('click', (e)=>{
    e.preventDefault();
    const tokenStr = localStorage.getItem('token');
    const paymentType = $admin__payment__form.querySelector('select[name="paymentType"]').value;
    const year = $admin__payment__form.querySelector('select[name="years"]').value;
    const cost = $admin__payment__form.querySelector('input[name="cost"]').value;
    const isDiscount = $admin__payment__form.querySelector('input[type="checkbox"]').checked;
    const studentID = $admin__payment__form.querySelector('.submit').id;
    show();
    axios({
        method: 'post',
        url: '/admin/adminPayment',
        data: {
            studentID,
            paymentType,
            year,
            cost,
            isDiscount
        },
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    .then(data=>{
        hide();
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        $admin__payment__form.reset();
        $admin__payment__form.querySelector('.cost1').textContent = '';
        showStudentProfile(data.data._id)
        Swal.fire({
            icon: 'success',
            title: 'پرداخت شما با موفقیت انجام شد.',
            confirmButtonText: 'تایید'
          })
    })
    .catch(e=> console.log(e))
})
//------------------------------------------
$admin__payment__form.querySelector('input[name="cost"]').addEventListener('keypress', (e)=>{
    setPriceFormat('.payment__form .cost1', e);
})