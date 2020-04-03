const $teacher__search__box = document.querySelector('.teacher .search__tools');
const $addTeacher_form = document.querySelector('.newTeacher__section .teacherForm');
const $teacherCourse__section = document.querySelector('.teacherCourse__section');
const $teacherCourse__form = document.querySelector('.teacherCourse__section .teacherCourseForm');
const $teacherProfile__section = document.querySelector('.teacherProfile__section');
const $teacherProfile__form = document.querySelector('.teacherProfileForm');
const TEACHERLIMIT = 2;

//-----------------------set active teacher section function-------------------------------
const setActiveTeacherSection = (setActive, setClass) => {
    document.querySelector('.newTeacher__section').style.display = 'none';
    document.querySelector('.teacherCourse__section').style.display = 'none'; 
    document.querySelector('.teacherProfile__section').style.display = 'none';
    document.querySelector('.teacherPayments__section').style.display = 'none';

    document.querySelector('.newTeacher__box').classList.remove('active');
    document.querySelector('.teacherCourse__box').classList.remove('active');
    document.querySelector('.teacherProfile__box').classList.remove('active');
    document.querySelector('.teacherPayments__box').classList.remove('active');

    document.querySelector(setActive).classList.add('active');
    document.querySelector(setClass).style.display = 'block';

}
//---------------new teacher btn ---------------------------
document.querySelector('.newTeacher__box').addEventListener('click', () => {
    
    setActiveTeacherSection('.newTeacher__box', '.newTeacher__section');

})
//--------------teacher course btn ------------------------
document.querySelector('.teacherCourse__box').addEventListener('click', () => {
    
    setActiveTeacherSection('.teacherCourse__box', '.teacherCourse__section');
    getTeachers('.teacherCourse__section', 1);

})
//---------------- teacher profile btn -----------------------
document.querySelector('.teacherProfile__box').addEventListener('click', () => {
    
    setActiveTeacherSection('.teacherProfile__box', '.teacherProfile__section');
    getTeachers('.teacherProfile__section', 0);

})

//---------------- teacher Payments btn -----------------------
document.querySelector('.teacherPayments__box').addEventListener('click', () => {
    
    setActiveTeacherSection('.teacherPayments__box', '.teacherPayments__section');

})
//----------------- add new teacher listener -----------------------
$addTeacher_form.addEventListener('submit', e=>{
    e.preventDefault();
    const tokenStr = localStorage.getItem('token');
    let formData = new FormData();
    const firstName = $addTeacher_form.querySelector('input[name="firstName"]').value;
    const lastName = $addTeacher_form.querySelector('input[name="lastName"]').value;
    const nationalID = $addTeacher_form.querySelector('input[name="nationalID"]').value;
    const mobileNumber = $addTeacher_form.querySelector('input[name="mobileNumber"]').value;
    const image = $addTeacher_form.querySelector('input[name="image"]').files[0];
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("nationalID", nationalID);
    formData.append("mobileNumber", mobileNumber);
    formData.append("image", image);
    axios.post('/admin/addNewTeacher', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization' : `Bearer ${tokenStr}`
        }
    })
    .then(data=>{
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
        $addTeacher_form.reset();
    })
    .catch(e=> console.log(e))
})
//--------------------------Check teacher image size-----------------------------------

$addTeacher_form.querySelector('input[name="image"]').addEventListener('change', (e)=>{
    if(e.target.files.length > 0){
        if(!fileSize(e.target.files[0])){
            Swal.fire({
                icon: 'error',
                title: 'حجم فایل انتخابی باید کمتر از دو مگا بایت باشد',
                confirmButtonText: 'تایید'
            })
            $addTeacher_form.querySelector('input[name="image"]').value = '';
        }
        
    }
})
//---------------------- admin can search teachers ------------------------
$teacher__search__box.querySelector('a').addEventListener('click', async (e)=>{
    getTeachers('.teacherCourse__section', 1);
});
//---------------------------- get teachers function --------------------
const getTeachers = function (section ,func, limit=TEACHERLIMIT, skip=0, current=1){
    
    const tokenStr = localStorage.getItem('token');
    const select = $teacher__search__box.querySelector('select').value;
    const title =  $teacher__search__box.querySelector('.input__search').value;

    axios({
        method: 'post',
        url: '/admin/getTeachers',
        data: {
            title,
            select,
            limit,
            skip
        },
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    .then(function (data){
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        document.querySelector(section).querySelector('table').innerHTML = '';
        let html =`
        <tr>
        <th>ردیف</th>
        <th>نام و نام خانوادگی</th>
        <th>کد ملی</th>
        <th>شماره همراه</th>
        <th>مشاهده پروفایل</th>
        </tr>`;
        const realRow = (current-1)*TEACHERLIMIT;
        if (!data.data.teacher){
            return Swal.fire({
                icon: 'error',
                title: 'معلم مورد نظر یافت نشد',
                confirmButtonText: 'تایید'
            })
        }
        data.data.teacher.forEach(function (el, index){
            html += `
            <tr>
            <td>${index + 1 + realRow}</td>
            <td>${el.firstName}  ${el.lastName}</td>
            <td>${el.nationalID}</td>
            <td>${el.mobileNumber}</td>
            <td><a href="#" class="find" onclick="${func===1 ? 'showTeacher':'showTeacherProfile'}('${el._id}')"><i class="fas fa-tv"></i></a></td>
            </tr>
            `
            
        })
        // document.querySelector('.showProfile__container').classList.remove('show');
        // document.querySelector('.showProfile__container').classList.add('hide');
        document.querySelector(section).querySelector('table').insertAdjacentHTML('beforeend', html);
        html = [];
        
        document.querySelector(section).querySelector('.pagination').querySelector('.last').innerHTML = '';
        document.querySelector(section).querySelector('.pagination').querySelector('.pages').innerHTML = '';
        document.querySelector(section).querySelector('.pagination').querySelector('.first').innerHTML = '';
        let j = 1;
        for (let i=1; i<=data.data.len; i+=TEACHERLIMIT){
            
            if (j===current) 
                html.push(`<div><a href="#" class="currentPage" onclick="getTeachers('${section}' ,${func} ,${TEACHERLIMIT}, ${(j-1)*TEACHERLIMIT}, ${j})">${j} </a></div>`);
            else
                html.push(`<div><a href="#" onclick="getTeachers('${section}' ,${func} ,${TEACHERLIMIT}, ${(j-1)*TEACHERLIMIT}, ${j})">${j} </a></div>`);  
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
        <a href="#" onclick="getTeachers('${section}' ,${func} ,${TEACHERLIMIT}, ${0}, ${1})"><i class="fas fa-angle-double-left"></i></a>
        <a href="#" onclick="getTeachers('${section}' ,${func} ,${TEACHERLIMIT}, ${current-2<0 ? 0 : (current-2)*TEACHERLIMIT}, ${current-1>0 ? current-1:1})"><i class="fas fa-angle-left"></i></a>
        <div>
        `;
        let next = `
        <div>
        <a href="#" onclick="getTeachers('${section}' ,${func} ,${TEACHERLIMIT}, ${current===html.length ? (current-1)* TEACHERLIMIT : current*TEACHERLIMIT}, ${current===html.length ? html.length : current+1})"><i class="fas fa-angle-right"></i></a>
        <a href="#" onclick="getTeachers('${section}' ,${func} ,${TEACHERLIMIT}, ${(html.length-1)*TEACHERLIMIT}, ${html.length})"><i class="fas fa-angle-double-right"></i></a>
        <div>
        `;
        document.querySelector(section).querySelector('.pagination').querySelector('.last').innerHTML = next;
        document.querySelector(section).querySelector('.pagination').querySelector('.pages').innerHTML = newHtml;
        document.querySelector(section).querySelector('.pagination').querySelector('.first').innerHTML = previous;
    
    });

}
//--------------------- show teacher for select his course -------------
const showTeacher = (id)=>{
    const tokenStr = localStorage.getItem('token');

    axios({
        method: 'post',
        url: '/admin/getTeacherInfo',
        data: {
            id
        },
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    .then(data=>{
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        
        $teacherCourse__section.querySelector('.teacherCourseForm').querySelector('input[name="firstName"]').value = data.data.teacher.firstName;
        $teacherCourse__section.querySelector('.teacherCourseForm').querySelector('input[name="lastName"]').value = data.data.teacher.lastName;
        $teacherCourse__section.querySelector('.teacherCourseForm').querySelector('input[name="year"]').value = data.data.educationYear.year;
        $teacherCourse__section.querySelector('.teacherCourseForm').querySelector('input[name="year"]').id = data.data.educationYear._id;
        $teacherCourse__section.querySelector('.teacherCourseForm').querySelector('button[type="submit"]').id = data.data.teacher._id;
        $teacherCourse__section.querySelector('.teacherCourseForm').style.display = 'block';
        getCourse();
    })
    .catch(e=> console.log(e))
}
//--------------------- get course to assign to the teacher -------------
const getCourse = (grade='اول')=>{
    const tokenStr = localStorage.getItem('token');

    axios({
        method: 'post',
        url: '/admin/getCourses',
        data: {
            grade
        },
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    .then(data=>{
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        $teacherCourse__section.querySelector('.course__container').innerHTML = '';
        let html = '';
        // console.log(data)
        data.data.course.forEach(el=>{
            html += `<div class="space"><label>${el.name}  ${el.grade}</label><input type="checkbox" id="${el._id}"></div>`;
        })
        $teacherCourse__section.querySelector('.course__container').innerHTML = html;
    })
    .catch(e=> console.log(e))
}
//------------------------ select listener for grade -----------------------
$teacherCourse__form.querySelector('select').addEventListener('change', e=>{
    const grade = $teacherCourse__form.querySelector('select').value;
    getCourse(grade);
})
//------------------------------------------
$teacherCourse__form.addEventListener('submit', e=>{
    e.preventDefault();
    const tokenStr = localStorage.getItem('token');

    const teacherID = $teacherCourse__form.querySelector('button[type="submit"]').id;
    const educationYearID = $teacherCourse__form.querySelector('input[name="year"]').id
    const checked = $teacherCourse__form.querySelectorAll('input:checked');
    let courses = Array.from(checked);
    let courseID = [];
    if(courses.length === 0){
         
        return Swal.fire({
            icon: 'warning',
            title: 'درسی انتخاب نشده است!',
            confirmButtonText: 'تایید'
        })
    }
    courses.forEach(el=>{
        courseID.push(el.id);
    }) 
    axios({
        method: 'post',
        url: '/admin/assignCourseToTeacher',
        data: {
            teacherID,
            educationYearID,
            courseID
        },
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    .then(data=>{
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        $teacherCourse__section.querySelector('.teacherCourseForm').style.display = 'none';
        Swal.fire({
            icon: 'success',
            title: 'اطلاعات شما با موفقیت ثبت شد.',
            confirmButtonText: 'تایید'
        })
    })
    .catch(e=> console.log(e))
})
//--------------------- show teacher profile -------------
const showTeacherProfile = (id)=>{
    const tokenStr = localStorage.getItem('token');

    axios({
        method: 'post',
        url: '/admin/getTeacherInfo',
        data: {
            id
        },
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    .then(data=>{
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        if (data.data.teacher.profileImageUrl)
        $teacherProfile__section.querySelector('.teacherProfileForm').querySelector('img').src = `../img/teachers/${data.data.teacher.nationalID}/` + data.data.teacher.profileImageUrl;
        $teacherProfile__section.querySelector('.teacherProfileForm').querySelector('input[name="firstName"]').value = data.data.teacher.firstName;
        $teacherProfile__section.querySelector('.teacherProfileForm').querySelector('input[name="lastName"]').value = data.data.teacher.lastName;
        $teacherProfile__section.querySelector('.teacherProfileForm').querySelector('input[name="year"]').value = data.data.educationYear.year;
        $teacherProfile__section.querySelector('.teacherProfileForm').querySelector('input[name="year"]').id = data.data.educationYear._id;
        $teacherProfile__section.querySelector('.teacherProfileForm').querySelector('button[type="submit"]').id = data.data.teacher._id;
        $teacherProfile__section.querySelector('.teacherProfileForm').style.display = 'block';
        $teacherProfile__section.querySelector('.course__container').innerHTML = '';
        $teacherProfile__section.querySelector('.teacherProfileForm').querySelector('a').id =  data.data.teacher._id;
        let html = '';
        
        data.data.course.forEach(el=>{
            if (data.data.teacherCourses.includes(el._id))
            html += `<div class="space"><label>${el.name}  ${el.grade}</label><input type="checkbox" id="${el._id}"></div>`;
        })
        $teacherProfile__section.querySelector('.course__container').innerHTML = html;
    })
    .catch(e=> console.log(e))
}

//-------------------------delete selected courses--------------------------
$teacherProfile__form.addEventListener('submit', (e) => {
    e.preventDefault();
    const tokenStr = localStorage.getItem('token');
    const teacherID = $teacherProfile__form.querySelector('button[type="submit"]').id;
    const checked = $teacherProfile__form.querySelectorAll('input:checked');
    let courses = Array.from(checked);
    let courseID = [];
    if(courses.length === 0){
        return Swal.fire({
            icon: 'warning',
            title: 'درسی انتخاب نشده است!',
            confirmButtonText: 'تایید'
        })
    }
    courses.forEach(el=>{
        courseID.push(el.id);
    }) 
    axios({
        method: 'post',
        url: '/admin/deleteTeacherCourse',
        data: {
            teacherID,
            courseID
        },
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    .then(data => {
        Swal.fire({
            icon: 'success',
            title: 'دروس مورد نظر با موفقیت حذف شد.',
            confirmButtonText: 'تایید'
        })
        showTeacherProfile(teacherID)
    })
    .catch(e=>console.log(e))
})

//--------------- change teacher password by admin function----------------------------------
const changeTeacherPassword = async (e)=>{
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
            axios({
                method: 'post',
                url: '/admin/changeTeacherPassword',
                data: {
                    formValues,
                    id
                },
                headers: {"Authorization" : `Bearer ${token}`} 
            })
            .then(data => {
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