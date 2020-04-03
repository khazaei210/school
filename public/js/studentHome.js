const $register__form = document.querySelector('.content .profile .information');
const $docs = document.querySelector('.content .profile .information .docs');
const $exit = document.querySelector('.logout');
const $uploadProfile = document.querySelector('.content .profile .information button');
const $profile = document.querySelector('.content .profile');
const $setting = document.querySelector('.settings');
const $enroll__form = document.querySelector('.enroll__form');
const $payment__form = document.querySelector('.payment__form');
const $change__password = document.querySelector('.change__password');

//------------------ show / hide sections --------------------------
const showHide = (blockClass, activeClass)=>{
    document.querySelector('.content .profile').style.display = 'none';
    document.querySelector('.content .enroll').style.display = 'none';
    document.querySelector('.content .payment').style.display = 'none';   
    document.querySelector('.content .question').style.display = 'none';
    // document.querySelector('.content .education__year').style.display = 'none';
    document.querySelector('.payment__section').classList.remove('active-menu');
    document.querySelector('.enroll__section').classList.remove('active-menu');
    document.querySelector('.dashbord__section').classList.remove('active-menu');
    document.querySelector('.question__section').classList.remove('active-menu');
    // document.querySelector('.aboutUs__section').classList.remove('active-menu');
    document.querySelector(`${blockClass}`).style.display = 'block';
    document.querySelector(`${activeClass}`).classList.add('active-menu');


}
//------------------- profile listener -----------------------
document.querySelector('.dashbord__section').addEventListener('click', ()=>{
    showHide('.content .profile', '.dashbord__section');
})
//------------------- question listener -----------------------
document.querySelector('.question__section').addEventListener('click', ()=>{
    showHide('.content .question', '.question__section');
    getStudentCourse();
})
//------------------- payment listener -----------------------
document.querySelector('.payment__section').addEventListener('click', ()=>{
    showHide('.content .payment', '.payment__section');
    const token = localStorage.getItem('studentToken')
    calcPayments();
    show();
    axios({
        method: 'get',
        url: '/student/getStudent',
        headers: {"Authorization" : `Bearer ${token}`} 
    })
    .then(data=>{
        hide();
        if(data.data.login){
            const isLogin = localStorage.getItem('studentToken');
            if (isLogin) localStorage.removeItem('studentToken');
            return window.location.replace("/student/login");
        }
        $payment__form.querySelector('input[name="name"]').value = data.data.student.firstName;
        $payment__form.querySelector('input[name="family"]').value = data.data.student.lastName;
        $payment__form.querySelector('input[name="nationalID"]').value = data.data.student.nationalID;
        const years = data.data.year;
        let html = '';
        years.forEach(item=>{
            html = html + `<option value="${item.thisYear}">${item.thisYear}</option>`;
        })
        $payment__form.querySelector('select').innerHTML = html;
        
    })
    .catch(e=> console.log(e))
})
//-------------------
$payment__form.querySelector('input[name="cost"]').addEventListener('keypress', (e)=>{
    setPriceFormat('.cost1', e);
})
//------------------- enroll listener -----------------------
document.querySelector('.enroll__section').addEventListener('click', ()=>{
    showHide('.content .enroll', '.enroll__section');

    const token = localStorage.getItem('studentToken')
    show();
    axios({
        method: 'get',
        url: '/student/getStudent',
        headers: {"Authorization" : `Bearer ${token}`} 
    })
    .then(data => {
        hide();
        if(data.data.login){
            const isLogin = localStorage.getItem('studentToken');
            if (isLogin) localStorage.removeItem('studentToken');
            return window.location.replace("/student/login");
        }
        $enroll__form.querySelector('input[name="name"]').value = data.data.student.firstName;
        $enroll__form.querySelector('input[name="family"]').value = data.data.student.lastName;
        $enroll__form.querySelector('input[name="nationalID"]').value = data.data.student.nationalID;
        show();
        axios({
            method: 'get',
            url: '/student/getEducationYear',
            headers: {"Authorization" : `Bearer ${token}`}  
        })
        .then(data =>{
            hide();
            if (data.data === 'error'){
                document.querySelector('.dashbord__section').click();
                return Swal.fire({
                    icon: 'warning',
                    text: ' سال تحصیلی جدید هنوز تعریف نشده است',
                    confirmButtonText: 'تایید'
                })
            }
            $enroll__form.querySelector('input[name="education__year"]').value = data.data.current[0].year;

            $enroll__form.querySelector('input[name="cost"]').value = setPriceFormatV2(data.data.current[0].tuition) + '  ریال ';  
            if (data.data.isEnrolled)
            {
                $enroll__form.querySelector('.submit').style.display = 'none';
                $enroll__form.querySelector('select').style.display = 'none';
                document.querySelector('.enroll').querySelector('p').style.display = 'none';
                $enroll__form.querySelector('input[name="grade"]').style.display = 'inline-block';
                $enroll__form.querySelector('input[name="grade"]').value = data.data.grade;
            }
        })
    })
    .catch(e=> console.log(e))
    
})
//---------------------change password-----------------------------
$change__password.addEventListener('click', async e => {
    e.preventDefault();
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
            const token = localStorage.getItem('studentToken')
            show();
            axios({
                method: 'post',
                url: '/student/changePassword',
                data: {
                    formValues
                },
                headers: {"Authorization" : `Bearer ${token}`} 
            })
            .then(data => {
                hide();
                if(data.data.login){
                    const isLogin = localStorage.getItem('studentToken');
                    if (isLogin) localStorage.removeItem('studentToken');
                    return window.location.replace("/student/login");
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

//---------------------payment form listener ---------------------
$payment__form.querySelector('.submit').addEventListener('click', (e)=>{
    e.preventDefault();
    let formData = new FormData();

    const token = localStorage.getItem('studentToken')
    const studentID = $payment__form.querySelector('input[name="nationalID"]').value;
    const currentYear = $payment__form.querySelector('select').value;
    if (currentYear === ''){
        return Swal.fire({
            icon: 'error',
            title: 'دانش آموز عزیز ابتدا از منوی ثبت نام در سال تحصیلی جدید ثبت نام کنید',
            confirmButtonText: 'تایید'
        })
    }
    let bill = $payment__form.querySelector('input[name="cost"]').value;
    bill = digitToEnglish(bill);
    const image = $payment__form.querySelector('input[name="image"]').files[0];
    
    formData.append("studentID", studentID);
    formData.append("currentYear", currentYear);
    formData.append("bill", bill);
    formData.append("image", image);
    show();
    axios.post('/student/payment', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization' : `Bearer ${token}`
        }
    })
    .then(data=>{
        hide();
        if(data.data.login){
            const isLogin = localStorage.getItem('studentToken');
            if (isLogin) localStorage.removeItem('studentToken');
            return window.location.replace("/student/login");
        }
        calcPayments();
        $payment__form.querySelector('input[name="image"]').value = '';
        $payment__form.querySelector('input[name="cost"]').value = '';
        Swal.fire({
            icon: 'success',
            title:  'درخواست شما با موفقیت ارسال شد. منتظر تایید مدیر',
            confirmButtonText: 'تایید'
        })
        
    })
    .catch(e=> console.log(e))
    

})
//---------------------- check payment fish file size -----------------
$payment__form.querySelector('input[name="image"]').addEventListener('change', (e)=>{
    if(e.target.files.length > 0){
        if(!fileSize(e.target.files[0])){
            Swal.fire({
                icon: 'error',
                title: 'حجم فایل انتخابی باید کمتر از دو مگا بایت باشد',
                confirmButtonText: 'تایید'
            })
            $payment__form.querySelector('input[name="image"]').value = '';
        }
        
    }
})
//--------------------- enroll form listener ------------------
$enroll__form.querySelector('.submit').addEventListener('click', (e)=>{
    e.preventDefault();
    const token = localStorage.getItem('studentToken')
    const studentID = $enroll__form.querySelector('input[name="nationalID"]').value;
    const thisYear = $enroll__form.querySelector('input[name="education__year"]').value;
    const grade = $enroll__form.querySelector('select').value;
    show();
    axios({
        method: 'post',
        url: '/student/setStudentGrade',
        data:{
            studentID,
            thisYear,
            grade
        },
        headers: {"Authorization" : `Bearer ${token}`} 
    })
    .then(data => {
        hide();
        if(data.data.login){
            const isLogin = localStorage.getItem('studentToken');
            if (isLogin) localStorage.removeItem('studentToken');
            return window.location.replace("/student/login");
        }
        $enroll__form.querySelector('.submit').style.display = 'none';
        $enroll__form.querySelector('select').style.display = 'none';
        document.querySelector('.enroll').querySelector('p').style.display = 'none';
        $enroll__form.querySelector('input[name="grade"]').style.display = 'inline-block';
        $enroll__form.querySelector('input[name="grade"]').value = grade;
    })
})
//-------------------fileSize function------------------------

const fileSize = (el)=>{
    if (el.size<=2000000)
        return true
    else
        return false  
}
//-----------------------show student in profile--------------------
const getStudent = () => {
    const token = localStorage.getItem('studentToken')
    show();
    axios({
        method: 'get',
        url: '/student/getStudent',
        headers: {"Authorization" : `Bearer ${token}`} 
    })
    .then(data => {
        hide();
        if(data.data.login){
            const isLogin = localStorage.getItem('studentToken');
            if (isLogin) localStorage.removeItem('studentToken');
            return window.location.replace("/student/login");
        }
        if(data.data.student.status === '0'){
            $register__form.querySelector('input[name="firstName"]').value = data.data.student.firstName;
            $register__form.querySelector('input[name="lastName"]').value = data.data.student.lastName;
            $register__form.querySelector('input[name="NationalID"]').value = data.data.student.nationalID;
            $register__form.querySelector('input[name="mobileNumber"]').value = data.data.student.mobileNumber;
            $register__form.querySelector('.docs').style.display = 'none';
            $register__form.querySelector('.pics').style.display = 'block';
        }
        else if(data.data.student.status === '1'){
            $register__form.querySelector('input[name="firstName"]').value = data.data.student.firstName;
            $register__form.querySelector('input[name="lastName"]').value = data.data.student.lastName;
            $register__form.querySelector('input[name="NationalID"]').value = data.data.student.nationalID;
            $register__form.querySelector('input[name="mobileNumber"]').value = data.data.student.mobileNumber;
            $register__form.querySelector('input[name="parentName"]').value = data.data.student.parentName;
            $register__form.querySelector('input[name="address"]').value = data.data.student.address;
            $register__form.querySelector('input[name="yearOfBirth"]').value = data.data.student.yearOfBirth;
            $register__form.querySelector('input[name="zipCode"]').value = data.data.student.zipCode;
            
            $docs.querySelector('#img1').src = `../img/docs/${data.data.student.nationalID}/${data.data.student.pictureURL}`;
            $docs.querySelector('#img2').src = `../img/docs/${data.data.student.nationalID}/${data.data.student.passportURL}`;
            $docs.querySelector('#img3').src = `../img/docs/${data.data.student.nationalID}/${data.data.student.nationalIDURL}`;
            
            $register__form.querySelector('.docs').style.display = 'block';
            $register__form.querySelector('.pics').style.display = 'none';
            
            $profile.querySelector('.alert').textContent = 'منتظر تایید مدیر';
            $profile.querySelector('.alert').style.color = '#C0CA33';
            $register__form.querySelector('.submit-btn').style.display = 'none';
            const elements = $register__form.elements;
            for (let i = 0; i < elements.length ; ++i) {
                elements[i].readOnly = true;
                elements[i].style.border = 'none';
            }


        }

        else if(data.data.student.status === '2'){
            $register__form.querySelector('input[name="firstName"]').value = data.data.student.firstName;
            $register__form.querySelector('input[name="lastName"]').value = data.data.student.lastName;
            $register__form.querySelector('input[name="NationalID"]').value = data.data.student.nationalID;
            $register__form.querySelector('input[name="mobileNumber"]').value = data.data.student.mobileNumber;
            $register__form.querySelector('input[name="parentName"]').value = data.data.student.parentName;
            $register__form.querySelector('input[name="address"]').value = data.data.student.address;
            $register__form.querySelector('input[name="yearOfBirth"]').value = data.data.student.yearOfBirth;
            $register__form.querySelector('input[name="zipCode"]').value = data.data.student.zipCode;
            
            $docs.querySelector('#img1').src = `../img/docs/${data.data.student.nationalID}/${data.data.student.pictureURL}`;
            $docs.querySelector('#img2').src = `../img/docs/${data.data.student.nationalID}/${data.data.student.passportURL}`;
            $docs.querySelector('#img3').src = `../img/docs/${data.data.student.nationalID}/${data.data.student.nationalIDURL}`;
            
            $register__form.querySelector('.docs').style.display = 'block';
            $register__form.querySelector('.pics').style.display = 'none';
            
            $profile.querySelector('.alert').textContent = '';
            $profile.style.borderColor = '#00C853';

            $register__form.querySelector('.submit-btn').style.display = 'none';
            const elements = $register__form.elements;
            for (let i = 0; i < elements.length ; ++i) {
                elements[i].readOnly = true;
                elements[i].style.border = 'none';
            }
            $setting.style.height = '140px';
            $setting.querySelector('.profilePic').style.display = 'block';
            $setting.querySelector('.profilePic').src = `../img/docs/${data.data.student.nationalID}/${data.data.student.pictureURL}`;
   
        }
        
    })
    .catch(e => console.log(e))
}
//-----------------log out/exit-------------------
$exit.addEventListener('click', ()=>{
    const token = localStorage.getItem('studentToken')
    show();
    axios({
        method: 'get',
        url: '/student/logout',
        headers: {"Authorization" : `Bearer ${token}`}
    })
    .then(data => {
        hide();
        if(data.data.logout){
            localStorage.removeItem('studentToken')
            window.location.replace('/student/login');
        }
    })
    .catch(e=>console.log(e))
});
//--------------------------windows load--------------------------------------
window.addEventListener('load', ()=>{
    getStudent()
});
//----------------------upload documents ----------------
// type ? submit : click ??????????

$uploadProfile.addEventListener('click', (e)=>{
    e.preventDefault();
   
    const tokenStr = localStorage.getItem('studentToken');
    let formData = new FormData();
    const firstName = $register__form.querySelector('input[name="firstName"]').value;
    const lastName = $register__form.querySelector('input[name="lastName"]').value;
    const nationalID = $register__form.querySelector('input[name="NationalID"]').value;
    const mobileNumber = $register__form.querySelector('input[name="mobileNumber"]').value;
    const parentName = $register__form.querySelector('input[name="parentName"]').value;
    const address = $register__form.querySelector('input[name="address"]').value;
    let yearOfBirth = $register__form.querySelector('input[name="yearOfBirth"]').value;
    yearOfBirth = digitToEnglish(yearOfBirth);
    let zipCode = $register__form.querySelector('input[name="zipCode"]').value;
    zipCode = digitToEnglish(zipCode);
    const picture = $register__form.querySelector('input[name="picture"]').files[0];
    const passport = $register__form.querySelector('input[name="passport"]').files[0];
    const nationalIDPic = $register__form.querySelector('input[name="nationalIDPic"]').files[0];
    if (!picture)
        return Swal.fire({
            icon: 'error',
            title: 'لطفا تصویر دانش آموز را بارگذاری کنید',
            confirmButtonText: 'تایید'
        })
    if (!passport)
    return Swal.fire({
        icon: 'error',
        title: 'لطفا تصویر شناسنامه دانش آموز را بارگذاری کنید',
        confirmButtonText: 'تایید'
    })
    if (!nationalIDPic)
    return Swal.fire({
        icon: 'error',
        title: 'لطفا تصویر کارت ملی دانش آموز را بارگذاری کنید',
        confirmButtonText: 'تایید'
    })
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("nationalID", nationalID);
    formData.append("mobileNumber", mobileNumber);
    formData.append("parentName", parentName);
    formData.append("address", address);
    formData.append("yearOfBirth", yearOfBirth);
    formData.append("zipCode", zipCode);
    formData.append("picture", picture);
    formData.append("passport", passport);
    formData.append("nationalIDPic", nationalIDPic);
    show();
    axios.post('/student/uploadProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization' : `Bearer ${tokenStr}`
        }
    })
    .then((data)=>{
        hide();
        if(data.data.login){
            const isLogin = localStorage.getItem('studentToken');
            if (isLogin) localStorage.removeItem('studentToken');
            return window.location.replace("/student/login");
        }
        Swal.fire({
            icon: 'success',
            title: 'اطلاعات شما با موفقیت ارسال شد و پس از تایید مدیر لطفا نسبت به ثبت نام سال تحصیلی اقدام فرمایید',
            confirmButtonText: 'تایید'
        })
        $register__form.querySelector('button').disabled = true;
        $profile.style.borderColor = "#689F38";
        $profile.querySelector('.alert').display = "none";
    })
    .catch(e=>console.log(e))
    
    
})
//----------------check validation of pictures ----------------------
$register__form.querySelector('input[name="picture"]').addEventListener('change', e => {
    if(e.target.files.length > 0){
        if(!fileSize(e.target.files[0])){
            Swal.fire({
                icon: 'error',
                title: 'حجم فایل انتخابی باید کمتر از دو مگا بایت باشد',
                confirmButtonText: 'تایید'
            })
            $register__form.querySelector('input[name="picture"]').value = '';
        }
        
    }
});

$register__form.querySelector('input[name="passport"]').addEventListener('change', e => {
    if(e.target.files.length > 0){
        if(!fileSize(e.target.files[0])){
            Swal.fire({
                icon: 'error',
                title: 'حجم فایل انتخابی باید کمتر از دو مگا بایت باشد',
                confirmButtonText: 'تایید'
            })
            $register__form.querySelector('input[name="passport"]').value = '';
        }
        
    }
});

$register__form.querySelector('input[name="nationalIDPic"]').addEventListener('change', e => {
    if(e.target.files.length > 0){
        if(!fileSize(e.target.files[0])){
            Swal.fire({
                icon: 'error',
                title: 'حجم فایل انتخابی باید کمتر از دو مگا بایت باشد',
                confirmButtonText: 'تایید'
            })
            $register__form.querySelector('input[name="nationalIDPic"]').value = '';
        }
        
    }
});

//---------------------chart canvas ------------------------
const draw = (pay, remain) => {
    const ctx = document.getElementById('myChart').getContext('2d');
    const chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'pie',
        // The data for our dataset
        data: {
            labels: ['پرداخت شده', 'باقی مانده حساب'],
            datasets: [{
                label: 'My First dataset',
                backgroundColor: ['green', 'orange'],
                data: [pay, remain]
            }]
        },
        // Configuration options go here
        options: {
            title: {
                display: true,
                text: 'پرداختی های سال جاری'
            },
            legend: {

            }
        }
    });
}
//---------------------- table of payments ------------------
const paymentTable = (html)=>{
    const newhtml = '<tr> <th>ردیف</th> <th>تاریخ واریز</th> <th>مبلغ واریزی</th> <th>وضعیت پرداخت</th> </tr>' + html;
    document.getElementById('payments_table').innerHTML = newhtml;
}
//---------------------- calculate payments ------------------
const calcPayments = ()=>{
    const token = localStorage.getItem('studentToken')
    show();
    axios({
        method: 'get',
        url: '/student/getPayments',
        headers: {"Authorization" : `Bearer ${token}`}
    })
    .then(data=>{
        hide();
        if(data.data.login){
            const isLogin = localStorage.getItem('studentToken');
            if (isLogin) localStorage.removeItem('studentToken');
            return window.location.replace("/student/login");
        }
        let sumPayment = 0;
        let html = '';
        data.data.currentStudent.forEach((item, index)=>{
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
        draw(sumPayment, data.data.year.tuition - sumPayment);
        document.getElementById('paid').textContent = `جمع پرداختی ها:  ${setPriceFormatV2(sumPayment)} ریال`;
        document.getElementById('remain').textContent = ` مانده حساب:  ${setPriceFormatV2(data.data.year.tuition - sumPayment)} ریال`;
        paymentTable(html);
    })
    .catch(e=> console.log(e))
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
//------------------ get student courses in current year -------------------
const getStudentCourse = ()=>{
    const token = localStorage.getItem('studentToken')
    show();
    axios({
        method: 'get',
        url: '/student/getCourses',
        headers: {"Authorization" : `Bearer ${token}`}
    })
    .then(data=>{
        if(data.data.login){
            const isLogin = localStorage.getItem('studentToken');
            if (isLogin) localStorage.removeItem('studentToken');
            return window.location.replace("/student/login");
        }
        hide();
        if (data.data === 'not found')
            return Swal.fire({
                icon: 'error',
                title: 'شما در سال تحصیلی جدید ثبت نام نکرده اید',
                confirmButtonText: 'تایید'
            })
        let html = '';
        data.data.forEach((el, index)=>{
            html += `<option value='${el._id}'>${el.name} ${el.grade}</option>`;
            if (index === 0) getQuestionToShow(el._id);
        })
        document.querySelector('.courseSelect .openForm select').innerHTML = html;
    })
    .catch(e=> console.log(e))
}
//------------------------- select course to show its questions ------------------
document.querySelector('.courseSelect .openForm select').addEventListener('change', e=>{
    let select =  document.querySelector('.courseSelect .openForm select');
    let value = select.value;
    console.log(value);
    getQuestionToShow(value);

})
//-------------------------- show questions of selected course --------------------
const getQuestionToShow = (courseID)=>{
    const token = localStorage.getItem('studentToken')
    show();
    axios({
        method: 'post',
        url: '/student/getCoursesQuestion',
        data: {
            courseID
        },
        headers: {"Authorization" : `Bearer ${token}`}
    })
    .then(data=>{
        hide();
        if(data.data.login){
            const isLogin = localStorage.getItem('studentToken');
            if (isLogin) localStorage.removeItem('studentToken');
            return window.location.replace("/student/login");
        }
        document.querySelector('.question .questionContainer form').innerHTML = '';
        if (data.data === 'not found')
            return Swal.fire({
                icon: 'error',
                title: ' در حال حاضر سوالی برای نمایش وجود ندارد',
                confirmButtonText: 'تایید'
            })
        let html = '';
        data.data.forEach((el, index)=>{
            html +=`
            <label class="questionNum">سوال شماره ${index+1}</label>
            <br>
            <label class="questionTilte" >سوال :</label>
            <textarea name="question" cols="100" rows="3" readonly>${el.questionTitle}</textarea>
            <br>
            `;
            switch (el.questionType)   {
                case '1':
                    html += `
                            <label onclick='showHideAnswer("${el._id}")' class="questionAnswer">پاسخ</label>
                            <textarea id='${el._id}' class="answerValue hide" name="answer" cols="100" rows="3" readonly>${el.discriptive}</textarea>
                            <br>
                    `;
                    break;
                case '2':
                    html +=`
                        <label class="questionTilte">گزینه الف :</label>
                        <input class="left100" type="text" name="choice1" placeholder="${el.multipleChoice[0].choice1}" readonly>
                        <label class="questionTilte">گزینه ب :</label>
                        <input  type="text" name="choice2" placeholder="${el.multipleChoice[0].choice2}" readonly>
                        <br>
                        <label class="questionTilte">گزینه ج :</label>
                        <input class="left100" type="text" name="choice3" placeholder="${el.multipleChoice[0].choice3}" readonly>
                        <label class="questionTilte">گزینه د :</label>
                        <input type="text" name="choice4" placeholder="${el.multipleChoice[0].choice4}" readonly>
                        <br>
                        <label onclick='showHideAnswer("${el._id}")' class="questionAnswer">پاسخ </label>
                        <input id='${el._id}' class="answerValue hide" type="text" name="answer" placeholder="${el.multipleChoice[0].answer === '1' ? 'الف':el.multipleChoice[0].answer === '2' ? 'ب': el.multipleChoice[0].answer === '3' ? 'ج':'د' }" readonly>
                        <br>
                    `;
                    break;
                case '3':
                    html += `
                        <label class="questionAnswer" onclick='showHideAnswer("${el._id}")'>پاسخ</label>
                        <input id='${el._id}' class="answerValue hide" type="text" name="answer" placeholder="${el.yesNoQuestion ? 'بلی':'خیر'}" readonly>
                        <br>
                    `;
                    break;
            }
            if (index !== data.data.length -1)
            html += `<hr>`
        })
        document.querySelector('.question .questionContainer form').innerHTML = html;
    })
    .catch(e=> console.log(e))
}
//---------------------- show hide answer ------------------------------------
const showHideAnswer = id =>{
    document.getElementById(`${id}`).classList.toggle('hide');
    
}