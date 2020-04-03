const $teacherInfo = document.querySelector('.teacherInfo');
const $teacherCourseForm = document.querySelector('.teacherCourse');
const $teacherChangePassword = document.querySelector('.teacherChangePassword a');
const $questionDesign = document.querySelector('.questionDesign');
const $questionSharing = document.querySelector('.questionSharing');
const $questionShairing__form = document.querySelector('.questionSharing .questionSelect');
const $questionEdit = document.querySelector('.questionEdit');
//------------------ show / hide sections --------------------------
const showHide = (blockClass, activeClass)=>{
    document.querySelector('.content .profile').style.display = 'none';
    document.querySelector('.content .questionDesign').style.display = 'none';
    document.querySelector('.content .questionSharing').style.display = 'none';   
    document.querySelector('.content .questionEdit').style.display = 'none';
    // document.querySelector('.content .education__year').style.display = 'none';
    document.querySelector('.questionSharing__section').classList.remove('active-menu');
    document.querySelector('.questionDesign__section').classList.remove('active-menu');
    document.querySelector('.dashbord__section').classList.remove('active-menu');
    document.querySelector('.questionEdit__section').classList.remove('active-menu');
    // document.querySelector('.aboutUs__section').classList.remove('active-menu');
    document.querySelector(`${blockClass}`).style.display = 'block';
    document.querySelector(`${activeClass}`).classList.add('active-menu');


}
//------------------- profile listener -----------------------
document.querySelector('.dashbord__section').addEventListener('click', ()=>{
    showHide('.content .profile', '.dashbord__section');
    getTeacherInfo();
})
//------------------- question edit listener -----------------------
document.querySelector('.questionEdit__section').addEventListener('click', ()=>{
    showHide('.content .questionEdit', '.questionEdit__section');
    questionDesign('.questionEditDel', 'edit');
})
//------------------- payment listener -----------------------
document.querySelector('.questionSharing__section').addEventListener('click', ()=>{
    showHide('.content .questionSharing', '.questionSharing__section');
    questionDesign('.questionsFilter');
    
})
//------------------- question design listener -----------------------
document.querySelector('.questionDesign__section').addEventListener('click', ()=>{
    showHide('.content .questionDesign', '.questionDesign__section');
    questionDesign('.questionDesign');

})
//-----------------log out/exit-------------------
document.querySelector('.logout').addEventListener('click', ()=>{
    const token = localStorage.getItem('teacherToken')
    show();
    axios({
        method: 'get',
        url: '/teacher/logout',
        headers: {"Authorization" : `Bearer ${token}`}
    })
    .then(data => {
        hide();
        if(data.data.logout){
            localStorage.removeItem('teacherToken')
            window.location.replace('/teacher/login');
        }
    })
    .catch(e=>console.log(e))
});
//--------------- get teacher info -------------
const getTeacherInfo = ()=>{
    const token = localStorage.getItem('teacherToken')
    show();
    axios({
        method: 'get',
        url: '/teacher/getInfo',
        headers: {"Authorization" : `Bearer ${token}`}
    })
    .then(data => {
        hide();
        if(data.data.logout){
            localStorage.removeItem('teacherToken')
            window.location.replace('/teacher/login');
        }
        $teacherInfo.querySelector('input[name="firstName"]').value = data.data.teacher.firstName;
        $teacherInfo.querySelector('input[name="lastName"]').value = data.data.teacher.lastName;
        $teacherInfo.querySelector('input[name="nationalID"]').value = data.data.teacher.nationalID;
        $teacherInfo.querySelector('input[name="mobileNumber"]').value = data.data.teacher.mobileNumber;
        if (data.data.teacher.profileImageUrl)
        document.querySelector('.profilePic').src = `../img/teachers/${data.data.teacher.nationalID}/${data.data.teacher.profileImageUrl}`;
        $teacherCourseForm.querySelector('div').innerHTML = '';
        let teacherCourses = [];
        if (data.data.teacherCourse.length > 0)
        {
            data.data.courses.forEach(el=>{
                if (data.data.teacherCourse.includes(el._id)) 
                    teacherCourses.push(el)        
            })
            let html = '';
            teacherCourses.forEach(el=>{
                html += `<input value='${el.name}  ${el.grade}' type='text' readonly>`
            })
            $teacherCourseForm.querySelector('div').innerHTML = html;
        }  
        else
        {
            $teacherCourseForm.querySelector('div').innerHTML = '<p> در سال تحصیلی جاری درسی برای شما درنظر گرفته نشده است</p>';
        }     
    })
    .catch(e=>console.log(e))
}
//---------------- windows load -----------------
window.addEventListener('load', e=>{
    getTeacherInfo();
})
//----------------check validation of pictures ----------------------
$teacherInfo.querySelector('input[name="image"]').addEventListener('change', e => {
    if(e.target.files.length > 0){
        if(!fileSize(e.target.files[0])){
            Swal.fire({
                icon: 'error',
                title: 'حجم فایل انتخابی باید کمتر از دو مگا بایت باشد',
                confirmButtonText: 'تایید'
            })
            $teacherInfo.querySelector('input[name="image"]').value = '';
        }
        
    }
});
//-------------------fileSize function------------------------

const fileSize = (el)=>{
    if (el.size<=2000000)
        return true
    else
        return false  
}
//-------------------- change picture profile --------------------
$teacherInfo.addEventListener('submit', e=>{
    const token = localStorage.getItem('teacherToken')
    let formData = new FormData();
    const image = $teacherInfo.querySelector('input[name="image"]').files[0];
    formData.append("image", image);
    show();
    axios.post('/teacher/changePRofileImage', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization' : `Bearer ${token}`
        }
    })
    .then(data=>{
        hide();
        if(data.data.login){
            localStorage.removeItem('teacherToken')
            window.location.replace('/teacher/login');
        }
        Swal.fire({
            icon: 'success',
            title: 'تصویر پروفایل شما با موفقیت تغییر کرد',
            confirmButtonText: 'تایید'
        })
        document.querySelector('.profilePic').src = `../img/teachers/${data.nationalID}/${data.profileImageUrl}`;
    })
    .catch(e=> console.log(e))
})
//-------------teacher change password --------------------
$teacherChangePassword.addEventListener('click', async e=>{
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
            const token = localStorage.getItem('teacherToken')
            show();
            axios({
                method: 'post',
                url: '/teacher/changePassword',
                data: {
                    formValues
                },
                headers: {"Authorization" : `Bearer ${token}`} 
            })
            .then(data => {
                hide();
                if(data.data.login){
                    const isLogin = localStorage.getItem('teacherToken');
                    if (isLogin) localStorage.removeItem('teacherToken');
                    return window.location.replace("/teacher/login");
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
//------------------ question design function -----------------
const questionDesign = (classContauner, type='none')=>{
    const token = localStorage.getItem('teacherToken')
    show();
    axios({
        method: 'post',
        url: '/teacher/getTeacherCourses',
        headers: {"Authorization" : `Bearer ${token}`} 
    })
    .then(data=>{
        hide();
        if(data.data.login){
            const isLogin = localStorage.getItem('teacherToken');
            if (isLogin) localStorage.removeItem('teacherToken');
            return window.location.replace("/teacher/login");
        }
        let teacherCourses = [];
        if (data.data.teacherCourse.length > 0)
        {
            data.data.course.forEach(el=>{
                if (data.data.teacherCourse.includes(el._id)) 
                    teacherCourses.push(el)        
            })
            let html = '';
            teacherCourses.forEach((el, index)=>{
                if (index === 0) {
                    $questionDesign.querySelector('.addQuestion button').id = el._id;
                    html += `<option value='${el._id}' selected>${el.name} ${el.grade}</option>`;
                    $questionDesign.querySelector('.addQuestion span').textContent = el.name + ' ' + el.grade;
                    $questionSharing.querySelector('.questionSelect span').textContent = el.name + ' ' + el.grade;
                    $questionEdit.querySelector('.questionSelectForEdit span').textContent = el.name + ' ' + el.grade;
                    if (type === 'edit')
                        getQuestion(el._id, 'edit')
                    else
                        getQuestion(el._id);
                }else {
                    html += `<option value='${el._id}'>${el.name} ${el.grade}</option>`;
                }
            })
            document.querySelector(`${classContauner}`).querySelector('.courseSelect .openForm p').classList.remove('show');
            document.querySelector(`${classContauner}`).querySelector('.courseSelect .openForm p').classList.add('hide');
            document.querySelector(`${classContauner}`).querySelector('.openForm select').innerHTML = html;
            document.querySelector(`${classContauner}`).querySelector('.courseSelect .openForm select').classList.remove('hide');
            document.querySelector(`${classContauner}`).querySelector('.courseSelect .openForm select').classList.add('show');
        }  
        else
        {
            document.querySelector(`${classContauner}`).querySelector('.courseSelect .openForm p').classList.remove('hide');
            document.querySelector(`${classContauner}`).querySelector('.courseSelect .openForm p').classList.add('show');
            document.querySelector(`${classContauner}`).querySelector('.courseSelect .openForm p').textContent = `در سال تحصیلی ${data.data.educationYear.year} درسی برای شما درنظر گرفته نشده است`;
            document.querySelector(`${classContauner}`).querySelector('.courseSelect .openForm select').classList.remove('show');
            document.querySelector(`${classContauner}`).querySelector('.courseSelect .openForm select').classList.add('hide');

        }     
    })
    .catch(e=> console.log(e))
}
// -------------------- select question type -----------------
$questionDesign.querySelector('.addQuestion .questionTypes').addEventListener('change', e=>{
    let choice =  $questionDesign.querySelector('.addQuestion .questionTypes').value;
    switch (choice)   {
        case '1':
            $questionDesign.querySelector('.addQuestion .yes-no').classList.remove('show');
            $questionDesign.querySelector('.addQuestion .multiChioce').classList.remove('show');
            $questionDesign.querySelector('.addQuestion .yes-no').classList.add('hide');
            $questionDesign.querySelector('.addQuestion .multiChioce').classList.add('hide');
            $questionDesign.querySelector('.addQuestion .desciptive').classList.remove('hide');
            $questionDesign.querySelector('.addQuestion .desciptive').classList.add('show');
            break;
        case '3':
            $questionDesign.querySelector('.addQuestion .desciptive').classList.remove('show');
            $questionDesign.querySelector('.addQuestion .multiChioce').classList.remove('show');
            $questionDesign.querySelector('.addQuestion .desciptive').classList.add('hide');
            $questionDesign.querySelector('.addQuestion .multiChioce').classList.add('hide');
            $questionDesign.querySelector('.addQuestion .yes-no').classList.remove('hide');
            $questionDesign.querySelector('.addQuestion .yes-no').classList.add('show');
            break;
        case '2':
            $questionDesign.querySelector('.addQuestion .desciptive').classList.remove('show');
            $questionDesign.querySelector('.addQuestion .yes-no').classList.remove('show');
            $questionDesign.querySelector('.addQuestion .desciptive').classList.add('hide');
            $questionDesign.querySelector('.addQuestion .yes-no').classList.add('hide');
            $questionDesign.querySelector('.addQuestion .multiChioce').classList.remove('hide');
            $questionDesign.querySelector('.addQuestion .multiChioce').classList.add('show');
            break;
    }
})
// -------------------- select course for design questions -----------------
$questionDesign.querySelector('.courseSelect select').addEventListener('change', e=>{
    let select =  $questionDesign.querySelector('.courseSelect select');
    let choice = select.value;
    let text = select.options[select.selectedIndex].text;
    $questionDesign.querySelector('.addQuestion span').textContent = text;
    $questionDesign.querySelector('.addQuestion button').id = choice;
})
//----------------add question form listener -------------------------
$questionDesign.querySelector('.addQuestion').addEventListener('submit', e=>{
    e.preventDefault();
    const token = localStorage.getItem('teacherToken');
    let choice =  $questionDesign.querySelector('.addQuestion .questionTypes').value;
    let difficulty = $questionDesign.querySelector('.addQuestion .difficulty').value;
    const question = $questionDesign.querySelector('.addQuestion textarea[name="question"]').value;
    let data = {
        type: choice,
        question,
        difficulty,
        courseID: $questionDesign.querySelector('.addQuestion button').id
    }
    switch (choice)   {
        case '1':
            const desciptiveAnswer = $questionDesign.querySelector('.addQuestion .desciptive textarea').value
            data.desciptive = desciptiveAnswer;
            break;
        case '2':
            const multiChoiceAnswer = $questionDesign.querySelector('.addQuestion .multiChioce select').value;
            const choice1 = $questionDesign.querySelector('.addQuestion .multiChioce input[name="choice1"]').value;
            const choice2 = $questionDesign.querySelector('.addQuestion .multiChioce input[name="choice2"]').value;
            const choice3 = $questionDesign.querySelector('.addQuestion .multiChioce input[name="choice3"]').value;
            const choice4 = $questionDesign.querySelector('.addQuestion .multiChioce input[name="choice4"]').value;
            data.choice1 = choice1;
            data.choice2 = choice2;
            data.choice3 = choice3;
            data.choice4 = choice4;
            data.multiChoiceAnswer = multiChoiceAnswer;
            break;
        case '3':
            const yesNoAnswer = $questionDesign.querySelector('.addQuestion .yes-no select').value;
            data.yesNoAnswer = yesNoAnswer;
            break;
    }
    show();
    axios({
        method: 'post',
        url: '/teacher/addQuestion',
        data,
        headers: {"Authorization" : `Bearer ${token}`} 
    })
    .then(data=>{
        hide();
        if(data.data.login){
            const isLogin = localStorage.getItem('teacherToken');
            if (isLogin) localStorage.removeItem('teacherToken');
            return window.location.replace("/teacher/login");
        }
        $questionDesign.querySelector('.addQuestion').reset();
        Swal.fire({
            icon: 'success',
            title: 'سوال با موفقیت ثبت شد',
            confirmButtonText: 'تایید'
          })
        $questionDesign.querySelector('.addQuestion .desciptive').classList.remove('show');
        $questionDesign.querySelector('.addQuestion .yes-no').classList.remove('show');
        $questionDesign.querySelector('.addQuestion .desciptive').classList.add('hide');
        $questionDesign.querySelector('.addQuestion .yes-no').classList.add('hide');
        $questionDesign.querySelector('.addQuestion .multiChioce').classList.remove('hide');
        $questionDesign.querySelector('.addQuestion .multiChioce').classList.add('show');
    })
    .catch(e=> console.log(e))
})
// -------------------- select course for share questions -----------------
$questionSharing.querySelector('.courseSelect select').addEventListener('change', e=>{
    let select =  $questionSharing.querySelector('.courseSelect select');
    let choice = select.value;
    let text = select.options[select.selectedIndex].text;
    $questionSharing.querySelector('.questionSelect span').textContent = text;
    getQuestion(select.value)
})
//-------------------- get questions info per course function --------------
const getQuestion = (courseID, type='none')=>{
    const token = localStorage.getItem('teacherToken');
    show();
    axios({
        method: 'post',
        url: '/teacher/getCourseQuestion',
        data: {
            courseID
        },
        headers: {"Authorization" : `Bearer ${token}`} 
    })
    .then(data=>{
        hide();
        document.querySelector('.questionSelect').querySelector('table').innerHTML = '';
        document.querySelector('.questionSelectForEdit').querySelector('table').innerHTML = '';
        if (type === 'edit'){
            let html =`
            <tr>
            <th>ردیف</th>
            <th>وضعیت انتشار</th>
            <th>عنوان سوال</th>
            <th>درجه سختی</th>
            <th>نوع سوال</th>
            <th>ویرایش</th>
            <th>انتخاب</th>
            </tr>`;
            if (!data.data){
                return Swal.fire({
                    icon: 'error',
                    title: 'برای این درس سوالی یافت نشد',
                    confirmButtonText: 'تایید'
                })
            }
            data.data.forEach(function (el, index){
                html += `
                <tr>
                <td>${index + 1}</td>
                <td>${el.shairing? 'بلی':'خیر'}</td>
                <td><div class='tooltip'>${el.questionTitle.substring(0,40)}<span class='tooltiptext'>${el.questionTitle}</span></div></td>
                <td>${el.difficulty === '1' ? 'راحت':el.difficulty === '2' ? 'متوسط':el.difficulty === '3' ? 'سخت':'خیلی سخت'}</td>
                <td>${el.questionType === '1' ? 'تشریحی':el.questionType === '2' ? 'تستی':'بلی-خیر'}</td>
                <td><a href='#' onclick='editQuestion("${el._id}")'><i class="fas fa-edit"></i></a></td>
                <td><input type='checkbox' id='${el._id}' style="width: 30px !important;"></td>
                </tr>
                `     
            })
            document.querySelector('.questionSelectForEdit').querySelector('table').insertAdjacentHTML('beforeend', html);
            document.querySelector('.questionSelectForEdit').querySelector('.delQuestion').value = courseID;
            
        }else{

            let html =`
            <tr>
            <th>ردیف</th>
            <th>وضعیت انتشار</th>
            <th>عنوان سوال</th>
            <th>درجه سختی</th>
            <th>نوع سوال</th>
            <th>انتخاب</th>
            </tr>`;
            if (!data.data){
                return Swal.fire({
                    icon: 'error',
                    title: 'برای این درس سوالی یافت نشد',
                    confirmButtonText: 'تایید'
                })
            }
            data.data.forEach(function (el, index){
                html += `
                <tr>
                <td>${index + 1}</td>
                <td>${el.shairing? 'بلی':'خیر'}</td>
                <td><div class='tooltip'>${el.questionTitle.substring(0,60)}<span class='tooltiptext'>${el.questionTitle}</span></div></td>
                <td>${el.difficulty === '1' ? 'راحت':el.difficulty === '2' ? 'متوسط':el.difficulty === '3' ? 'سخت':'خیلی سخت'}</td>
                <td>${el.questionType === '1' ? 'تشریحی':el.questionType === '2' ? 'تستی':'بلی-خیر'}</td>
                <td><input type='checkbox' id='${el._id}' style="width: 30px !important;"></td>
                </tr>
                `     
            })
            document.querySelector('.questionSelect').querySelector('table').insertAdjacentHTML('beforeend', html);
            document.querySelector('.questionSelect').querySelector('.publishBTN').value = courseID;
            document.querySelector('.questionSelect').querySelector('.unPublishBTN').value = courseID;
            hide();
        }
    })
    .catch(e=> console.log(e))
}
//--------------------------------- question shairing form listener ------------------------
$questionShairing__form.querySelector('#pub').addEventListener('click', e=>{
    e.preventDefault();
    pubOrUnpub('pub', e.target.value)
})
$questionShairing__form.querySelector('#unpub').addEventListener('click', e=>{
    e.preventDefault();
    pubOrUnpub('unpub', e.target.value)
})
//--------------------------publish or unpublish question function ------------------------
const pubOrUnpub = (id, courseID)=>{

    const token = localStorage.getItem('teacherToken');
    let questions = $questionShairing__form.querySelectorAll('input:checked');
    questions = Array.from(questions);
    if (questions.length === 0){
        return Swal.fire({
            icon: 'warning',
            title: 'حداقل باید یک سوال را انتخاب کنید',
            confirmButtonText: 'تایید'
        })
    }
    let questionID = [];
    questions.forEach(el=>{
        questionID.push(el.id);
    })
    show();
    axios({
        method: 'post',
        url: '/teacher/publishQuestions',
        data: {
            questionID,
            id
        },
        headers: {"Authorization" : `Bearer ${token}`} 
    })
    .then(data=>{
        hide();
        getQuestion(courseID);
        if (data.data === 'pub')
            Swal.fire({
                icon: 'success',
                title: 'سوالات با موفقیت منتشر شد',
                confirmButtonText: 'تایید'
            })  
        else
            Swal.fire({
                icon: 'success',
                title: 'سوالات با موفقیت از انتشار خارج شد',
                confirmButtonText: 'تایید'
            })
    })
    .catch(e=> console.log(e))   
}
// -------------------- select course for edit or delete questions -----------------
$questionEdit.querySelector('.courseSelect select').addEventListener('change', e=>{
    let select =  $questionEdit.querySelector('.courseSelect select');
    let choice = select.value;
    let text = select.options[select.selectedIndex].text;
    $questionEdit.querySelector('.questionSelectForEdit span').textContent = text;
    getQuestion(choice, 'edit');
})
//----------------------------- delete question listener -----------------------------
$questionEdit.querySelector('.questionSelectForEdit').addEventListener('submit', e=>{
    e.preventDefault();
    const token = localStorage.getItem('teacherToken');
    let questions = $questionEdit.querySelector('.questionSelectForEdit').querySelectorAll('input:checked');
    questions = Array.from(questions);
    let questionID = [];
    questions.forEach(el=>{
        questionID.push(el.id);
    })
    if (questions.length === 0){
        return Swal.fire({
            icon: 'warning',
            title: 'حداقل باید یک سوال را انتخاب کنید',
            confirmButtonText: 'تایید'
        })
    }
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
                url: '/teacher/deleteQuestions',
                data: {
                    questionID
                },
                headers: {"Authorization" : `Bearer ${token}`} 
            })
            .then(data=>{
                hide();
                getQuestion($questionEdit.querySelector('.questionSelectForEdit').querySelector('.delQuestion').value, 'edit');
                Swal.fire({
                    icon: 'success',
                    title: 'سوالات با موفقیت حذف شد',
                    confirmButtonText: 'تایید'
                })
            })
            .catch(e=> console.log(e)) 
        }
      })
   
})
//---------------- edit question function ---------------------
const editQuestion = questionID=>{
    $questionEdit.querySelector('.questionSelectForEdit').style.display = 'none';
    $questionEdit.querySelector('.editQuestion').style.display = 'block';
    const token = localStorage.getItem('teacherToken');
    show();
    axios({
        method: 'post',
        url: '/teacher/getQuestion',
        data: {
            questionID
        },
        headers: {"Authorization" : `Bearer ${token}`} 
    })
    .then(data=>{
        hide();
        $questionEdit.querySelector('.editQuestion').querySelector('textarea[name="question"]').value = data.data.questionTitle;
        $questionEdit.querySelector('.editQuestion').querySelector('.difficulty').value = data.data.difficulty;
        $questionEdit.querySelector('.editQuestion').querySelector('.questionTypes').value = data.data.questionType;
        switch (data.data.questionType){
            case '1':
                $questionEdit.querySelector('.editQuestion').querySelector('.desciptive').classList.remove('show');
                $questionEdit.querySelector('.editQuestion').querySelector('.yes-no').classList.remove('show');
                $questionEdit.querySelector('.editQuestion').querySelector('.multiChioce').classList.remove('show');
                $questionEdit.querySelector('.editQuestion').querySelector('.desciptive').classList.add('hide');
                $questionEdit.querySelector('.editQuestion').querySelector('.yes-no').classList.add('hide');
                $questionEdit.querySelector('.editQuestion').querySelector('.multiChioce').classList.add('hide');
                $questionEdit.querySelector('.editQuestion').querySelector('.desciptive').classList.add('show');
                $questionEdit.querySelector('.editQuestion').querySelector('.desciptive textarea').value = data.data.discriptive;
                break;
            case '2':
                $questionEdit.querySelector('.editQuestion').querySelector('.desciptive').classList.remove('show');
                $questionEdit.querySelector('.editQuestion').querySelector('.yes-no').classList.remove('show');
                $questionEdit.querySelector('.editQuestion').querySelector('.multiChioce').classList.remove('show');
                $questionEdit.querySelector('.editQuestion').querySelector('.desciptive').classList.add('hide');
                $questionEdit.querySelector('.editQuestion').querySelector('.yes-no').classList.add('hide');
                $questionEdit.querySelector('.editQuestion').querySelector('.multiChioce').classList.add('hide');
                $questionEdit.querySelector('.editQuestion').querySelector('.multiChioce').classList.add('show');
                $questionEdit.querySelector('.editQuestion').querySelector('.multiChioce input[name="choice1"]').value = data.data.multipleChoice[0].choice1;
                $questionEdit.querySelector('.editQuestion').querySelector('.multiChioce input[name="choice2"]').value = data.data.multipleChoice[0].choice2;
                $questionEdit.querySelector('.editQuestion').querySelector('.multiChioce input[name="choice3"]').value = data.data.multipleChoice[0].choice3;
                $questionEdit.querySelector('.editQuestion').querySelector('.multiChioce input[name="choice4"]').value = data.data.multipleChoice[0].choice4;
                $questionEdit.querySelector('.editQuestion').querySelector('.multiChioce select').value = data.data.multipleChoice[0].answer;
                break;
            case '3':
                $questionEdit.querySelector('.editQuestion').querySelector('.desciptive').classList.remove('show');
                $questionEdit.querySelector('.editQuestion').querySelector('.yes-no').classList.remove('show');
                $questionEdit.querySelector('.editQuestion').querySelector('.multiChioce').classList.remove('show');
                $questionEdit.querySelector('.editQuestion').querySelector('.desciptive').classList.add('hide');
                $questionEdit.querySelector('.editQuestion').querySelector('.yes-no').classList.add('hide');
                $questionEdit.querySelector('.editQuestion').querySelector('.multiChioce').classList.add('hide');
                $questionEdit.querySelector('.editQuestion').querySelector('.yes-no').classList.add('show');
                $questionEdit.querySelector('.editQuestion').querySelector('.yes-no select').value = data.data.yesNoQuestion
                break;
        }
        $questionEdit.querySelector('.editQuestion').querySelector('.update').value = data.data._id + ',' + data.data.courseID;

        
    })
    .catch(e=> console.log(e)) 
}
//--------------------------- cancel update question form btn --------------------------
$questionEdit.querySelector('.editQuestion').querySelector('.cancel').addEventListener('click', e=>{
    $questionEdit.querySelector('.questionSelectForEdit').style.display = 'block';
    $questionEdit.querySelector('.editQuestion').style.display = 'none';
})
// -------------------- select question type -----------------
$questionEdit.querySelector('.editQuestion').querySelector('.questionTypes').addEventListener('change', e=>{
    let choice =   $questionEdit.querySelector('.editQuestion').querySelector('.questionTypes').value;
    switch (choice)   {
        case '1':
            $questionEdit.querySelector('.editQuestion .yes-no').classList.remove('show');
            $questionEdit.querySelector('.editQuestion .multiChioce').classList.remove('show');
            $questionEdit.querySelector('.editQuestion .yes-no').classList.add('hide');
            $questionEdit.querySelector('.editQuestion .multiChioce').classList.add('hide');
            $questionEdit.querySelector('.editQuestion .desciptive').classList.remove('hide');
            $questionEdit.querySelector('.editQuestion .desciptive').classList.add('show');
            break;
        case '3':
            $questionEdit.querySelector('.editQuestion .desciptive').classList.remove('show');
            $questionEdit.querySelector('.editQuestion .multiChioce').classList.remove('show');
            $questionEdit.querySelector('.editQuestion .desciptive').classList.add('hide');
            $questionEdit.querySelector('.editQuestion .multiChioce').classList.add('hide');
            $questionEdit.querySelector('.editQuestion .yes-no').classList.remove('hide');
            $questionEdit.querySelector('.editQuestion .yes-no').classList.add('show');
            break;
        case '2':
            $questionEdit.querySelector('.editQuestion .desciptive').classList.remove('show');
            $questionEdit.querySelector('.editQuestion .yes-no').classList.remove('show');
            $questionEdit.querySelector('.editQuestion .desciptive').classList.add('hide');
            $questionEdit.querySelector('.editQuestion .yes-no').classList.add('hide');
            $questionEdit.querySelector('.editQuestion .multiChioce').classList.remove('hide');
            $questionEdit.querySelector('.editQuestion .multiChioce').classList.add('show');
            break;
    }
})
//--------------------------- update question form btn --------------------------
$questionEdit.querySelector('.editQuestion').querySelector('.update').addEventListener('click', e=>{
    e.preventDefault();

    const token = localStorage.getItem('teacherToken');
    let choice =  $questionEdit.querySelector('.editQuestion .questionTypes').value;
    let difficulty = $questionEdit.querySelector('.editQuestion .difficulty').value;
    const question = $questionEdit.querySelector('.editQuestion textarea[name="question"]').value;
    let IDs = $questionEdit.querySelector('.editQuestion').querySelector('.update').value.split(',');
    let data = {

        type: choice,
        question,
        difficulty,
        questionID: IDs[0]
    }
    switch (choice)   {
        case '1':
            const desciptiveAnswer = $questionEdit.querySelector('.editQuestion .desciptive textarea').value
            data.desciptive = desciptiveAnswer;
            break;
        case '2':
            const multiChoiceAnswer = $questionEdit.querySelector('.editQuestion .multiChioce select').value;
            const choice1 = $questionEdit.querySelector('.editQuestion .multiChioce input[name="choice1"]').value;
            const choice2 = $questionEdit.querySelector('.editQuestion .multiChioce input[name="choice2"]').value;
            const choice3 = $questionEdit.querySelector('.editQuestion .multiChioce input[name="choice3"]').value;
            const choice4 = $questionEdit.querySelector('.editQuestion .multiChioce input[name="choice4"]').value;
            data.choice1 = choice1;
            data.choice2 = choice2;
            data.choice3 = choice3;
            data.choice4 = choice4;
            data.multiChoiceAnswer = multiChoiceAnswer;
            break;
        case '3':
            const yesNoAnswer = $questionEdit.querySelector('.editQuestion .yes-no select').value;
            data.yesNoAnswer = yesNoAnswer;
            break;
    }
    show();
    axios({
        method: 'post',
        url: '/teacher/editQuestion',
        data,
        headers: {"Authorization" : `Bearer ${token}`} 
    })
    .then(data=>{
        hide();
        if(data.data.login){
            const isLogin = localStorage.getItem('teacherToken');
            if (isLogin) localStorage.removeItem('teacherToken');
            return window.location.replace("/teacher/login");
        }
        $questionEdit.querySelector('.editQuestion').reset();
        Swal.fire({
            icon: 'success',
            title: 'سوال با موفقیت تغییر کرد',
            confirmButtonText: 'تایید'
          })
        $questionEdit.querySelector('.editQuestion .desciptive').classList.remove('show');
        $questionEdit.querySelector('.editQuestion .yes-no').classList.remove('show');
        $questionEdit.querySelector('.editQuestion .desciptive').classList.add('hide');
        $questionEdit.querySelector('.editQuestion .yes-no').classList.add('hide');
        $questionEdit.querySelector('.editQuestion .multiChioce').classList.remove('hide');
        $questionEdit.querySelector('.editQuestion .multiChioce').classList.add('show');
        $questionEdit.querySelector('.questionSelectForEdit').style.display = 'block';
        $questionEdit.querySelector('.editQuestion').style.display = 'none';
        getQuestion(IDs[1], 'edit');
    })
    .catch(e=> console.log(e))
  
})