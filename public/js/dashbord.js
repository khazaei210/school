let $student__abstract__list = document.querySelector('.student__abstract__list');
let $acceptEnroll__abstract__list = document.querySelector('.acceptEnroll__abstract__list');
const $student__preEnroll__status__edit = document.querySelector('.content .dashbord .toolbox__section .student__abstract__list');
const $student__preEnroll__form = document.querySelector('.content .dashbord .preEnroll__section .detail__section form');
const $student__acceptEnroll__form = document.querySelector('.content .dashbord .acceptEnroll__section .detail__section form');
const $waiting__approve__wrapper = document.querySelector('.content .dashbord .acceptPayment__section .waiting__approve__list');
const student__enroll__list__template = document.querySelector('#student__enroll__list__template').innerHTML;
const enroll__list__template = document.querySelector('#enroll__list__template').innerHTML;
const $student__preEnroll__section = document.querySelector('.content .dashbord .preEnroll__section .detail__section');
const $student__acceptEnroll__section = document.querySelector('.content .dashbord .acceptEnroll__section .detail__section');

const $students__waiting = document.querySelector('.content .dashbord .main__section .preEnroll__box .counter');
const $students__finalWaiting = document.querySelector('.content .dashbord .main__section .acceptEnroll__box .counter');
const $students__PaymentsWaiting =document.querySelector('.content .dashbord .main__section .acceptPayments__box .counter');
const $search = document.querySelector('.content .dashbord .toolbox__section .search__box');
const $input__search = document.querySelector('.content .dashbord .toolbox__section .search__box .input__search');
const $aboutUs = document.querySelector('.about__us form');
const $preEnroll__btn = document.querySelector('.content .dashbord .main__section .preEnroll__box');
const $acceptEnroll__btn = document.querySelector('.content .dashbord .main__section .acceptEnroll__box');
const $acceptPayments__btn = document.querySelector('.content .dashbord .main__section .acceptPayments__box');
const $accept__payment__section = document.querySelector('.content .dashbord .acceptPayment__section');
const $accept__payment__form = document.querySelector('.content .dashbord .acceptPayment__section .approve__payments');
const $final__accept = document.querySelector('.content .dashbord .acceptEnroll__section .detail__section form .accept__Enroll');
const $chart__btn = document.querySelector('.chart__box');
const $preEnroll__section = document.querySelector('.content .dashbord .preEnroll__section');
const $acceptEnroll__section = document.querySelector('.content .dashbord .acceptEnroll__section');
const $docs = document.querySelector('.content .dashbord .acceptEnroll__section .detail__section form .docs')
//-------------------------------------------------------------
window.addEventListener('load', ()=>{
    getNumSt();
    getWaitingSt();
    totalPayments();
    paymentStatus();
    getPaymentNum();
    
    $preEnroll__section.style.display = 'none'; // جای این خط رو باید تغیر بدیم چون میخوایم با تغیر دکمه نمایشش تموم بشه
})

//-----------------------set active dashboard button-------------------------------
const setActive = (setActive, setClass) => {
    document.querySelector('.preEnroll__section').style.display = 'none';
    document.querySelector('.acceptEnroll__section').style.display = 'none'; 
    document.querySelector('.acceptPayment__section').style.display = 'none';
    document.querySelector('.chart__section').style.display = 'none';

    document.querySelector('.chart__box').classList.remove('active');
    document.querySelector('.preEnroll__box').classList.remove('active');
    document.querySelector('.acceptEnroll__box').classList.remove('active');
    document.querySelector('.acceptPayments__box').classList.remove('active');

    document.querySelector(setActive).classList.add('active');
    document.querySelector(setClass).style.display = 'block';

}
//---------------PreEnroll btn ---------------------------
$preEnroll__btn.addEventListener('click', () => {
    
    setActive('.preEnroll__box', '.preEnroll__section');
    displayList('all');

})
//--------------acceptEnroll btn ------------------------
$acceptEnroll__btn.addEventListener('click', () => {
    
    setActive('.acceptEnroll__box', '.acceptEnroll__section');
    displayAcceptEnrollList();
})
//---------------- accept payments btn -----------------------
$acceptPayments__btn.addEventListener('click', ()=>{
    setActive('.acceptPayments__box', '.acceptPayment__section');
    approvePaymentsList();
})

//---------------- chart show btn -----------------------
$chart__btn.addEventListener('click', ()=>{
    setActive('.chart__box', '.chart__section');
    totalPayments();
    paymentStatus();
    getEducationYears();
    
})
//------------------------------------------------------------
document.querySelector('.educationYear__selector').querySelector('select').addEventListener('change', e=>{
    const year = document.querySelector('.educationYear__selector').querySelector('select').value;
    totalPayments(year);
    paymentStatus(year);
})
//------------------------------------------------------------
$student__preEnroll__form.querySelector('.changeStatusBtn').addEventListener('click', (e)=>{
    e.preventDefault();
    const tokenStr = localStorage.getItem('token');
    const _id = $student__preEnroll__form.querySelector('.changeStatusBtn').id;
    const status = $student__preEnroll__form.querySelectorAll('input[name="status"]');
    const changed = Array.from(status);
    let val;
    changed.forEach(el=>{
        if (el.checked) val = el.value;
    })
    
    axios({
        method: 'patch',
        url: '/admin/changeStatus',
        data: {
            _id,
            status: val
        },
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    .then((data)=>{
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        
         $student__preEnroll__section.style.display = "none"; //******** */
        // getEnrolledStudent()

    })
    .catch(e=> console.log(e))

})

//---------------------reset__btn listener ----------------------

$student__preEnroll__form.querySelector('.reset__btn').addEventListener('click', e => {
    $student__preEnroll__section.style.display = "none"; //******** */
})
//------------------------------------------------------------
const updateEnrollStatus = (id)=>{
    
    const tokenStr = localStorage.getItem('token');
    const url = `/admin/getEnrolled?id=${id}`;
    axios({
        method: 'get',
        url: url,
        headers: {"Authorization" : `Bearer ${tokenStr}`}
    
    })
    .then(data=>{
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        $student__preEnroll__section.style.display = "block";
        $student__preEnroll__form.querySelector('input[name="name"]').value = data.data.firstName;
        $student__preEnroll__form.querySelector('input[name="family"]').value = data.data.lastName;
        $student__preEnroll__form.querySelector('input[name="lastSchool"]').value = data.data.lastSchool;
        $student__preEnroll__form.querySelector('input[name="mobile"]').value = data.data.mobileNumber;
        $student__preEnroll__form.querySelector('input[name="childNum"]').value = data.data.childNum;
        $student__preEnroll__form.querySelector('input[name="level"]').value = data.data.level;
        $student__preEnroll__form.querySelector('input[name="fatherJob"]').value = data.data.fatherJob;
        $student__preEnroll__form.querySelector('input[name="fatherLicense"]').value = data.data.fatherLicense;
        $student__preEnroll__form.querySelector('input[name="motherJob"]').value = data.data.motherJob;
        $student__preEnroll__form.querySelector('input[name="motherLicense"]').value = data.data.motherLicense;
        $student__preEnroll__form.querySelector('input[name="isSacrifice"]').value = data.data.isSacrifice === true ? 'بلی' : 'خیر';
        $student__preEnroll__form.querySelector('input[name="lastYearMark"]').value = data.data.lastYearMark;
       
        let status;
        
        switch (data.data.status){
            case 0:
                status = 'reject';
                break;
            case 1:
                status = 'accept';
                break;
            case 2:
                status = 'waiting'
        }
        $student__preEnroll__form.querySelector(`.decision #${status}`).checked = true;
        $student__preEnroll__form.querySelector('.changeStatusBtn').id = data.data._id;

    })
    .catch(e=>console.log(e))
}
//------------------------------------------------------------
const getEnrolledStudent = ()=>{
    const tokenStr = localStorage.getItem('token');
    $student__abstract__list.innerHTML = '';
    axios({
        method: 'get',
        url: '/admin/getEnrolledStudent',
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    .then(data=>{
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        data.data.forEach((el, index)=>{
            const background__color = index % 2 === 0 ? 'even':'odd';
            const fullName = el.firstName + ' ' + el.lastName;
            const mobileNumber = el.mobileNumber;
            const id = el._id;
            const status = el.status === 2 ? 'بررسی نشده': el.status === 1 ? 'تایید شده':'رد شده';
            let className;
            switch(el.status){
                case 0:
                   className = 'reject';
                    break;
                case 1:
                    className = 'accept';

                    break;
                case 2:
                    className = 'waiting';

                
            }
            const html = Mustache.render( student__enroll__list__template, {fullName, mobileNumber, id, id1: id, status, className, background__color});
            $student__abstract__list.insertAdjacentHTML('beforeend', html);
            
        })
    })
    .catch(e=>console.log(e))
}
// ********************************************************* //
const displayList = (status='all') => {
    const tokenStr = localStorage.getItem('token');
    $student__abstract__list.textContent = '';
    
    axios({
        method: "post",
        url: "/admin/getList",
        data: {
            status
        },
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    .then(data=>{
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        $student__abstract__list.innerHTML = '';
        data.data.forEach((el, index)=>{
            const background__color = index % 2 === 0 ? 'even':'odd';
            const fullName = el.firstName + ' ' + el.lastName;
            const mobileNumber = el.mobileNumber;
            const id = el._id;
            const status = el.status === 2 ? 'بررسی نشده': el.status === 1 ? 'تایید شده':'رد شده';
            let className;
            switch(el.status){
                case 0:
                   className = 'reject';
                    break;
                case 1:
                    className = 'accept';

                    break;
                case 2:
                    className = 'waiting';

                
            }
            const html = Mustache.render( student__enroll__list__template, {fullName, mobileNumber, id, id1: id, delId: id, status, className, background__color});
            $student__abstract__list.insertAdjacentHTML('beforeend', html);
            
        })
    })
    .catch(e => console.log(e))
}
//***************DELETE STUDENT**************************************** */
const deleteStudent = id => {
    const tokenStr = localStorage.getItem('token');

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
            axios({
                method: "post",
                url: "/admin/delStudent",
                data: {
                    _id: id
                },
                headers: {"Authorization" : `Bearer ${tokenStr}`} 
            })
            .then(data => {
                if(data.data.login){
                    const token = localStorage.getItem('token');
                    if (token) localStorage.removeItem('token');
                    return window.location.replace("/admin/login");
                }
                displayList(data.data.status)
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

//****************GET NUMBER OF PReENROLLED WAITING STUDENTS FOR ACCEPTION ******************** */

const getNumSt = () => {
    const tokenStr = localStorage.getItem('token');

    axios({
        method: "get",
        url: "/admin/getNumber",
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    ///////////////////////////????????????????????????????????????????????
    .then(data => {
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        $students__waiting.textContent = data.data.length;
    })
    .catch(e => console.log(e))
}
//****************GET NUMBER OF STUDENTS payments FOR ACCEPTION ******************** */

const getPaymentNum = () => {
    const tokenStr = localStorage.getItem('token');

    axios({
        method: "get",
        url: "/admin/getPaymentNum",
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    ///////////////////////////????????????????????????????????????????????
    .then(data => {
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        $students__PaymentsWaiting.textContent = data.data.length;
    })
    .catch(e => console.log(e))
}

//**************GET NUMBER OF STUDENTS  WHO ARE WAITNIG FOR BOSS FINAL ACCEPTION  */
const getWaitingSt = () => {
    const tokenStr = localStorage.getItem('token');

    axios({
        method: "get",
        url: "/admin/getAcceptEnrollList",
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    ///////////////////////////????????????????????????????????????????????
    .then(data => {
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        $students__finalWaiting.textContent = data.data.length;
    })
    .catch(e => console.log(e))
}
//************************* SEARCH BOX ************************ */
$search.querySelector('a').addEventListener('click', async (e)=>{
    const tokenStr = localStorage.getItem('token');
  
    const lastName =  $input__search.value;
    
    if (!lastName) {
        
        return displayList('all');
    }
    $student__abstract__list.innerHTML = '';
    axios({
        method: 'post',
        url: '/admin/searchStudent',
        data: {
           lastName
        },
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    .then((data)=>{
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        if(data.data){
            data.data.forEach((el, index)=>{
                const background__color = index % 2 === 0 ? 'even':'odd';
                const fullName = el.firstName + ' ' + el.lastName;
                const mobileNumber = el.mobileNumber;
                const id = el._id;
                const status = el.status === 2 ? 'بررسی نشده': el.status === 1 ? 'تایید شده':'رد شده';
                let className;
                switch(el.status){
                    case 0:
                    className = 'reject';
                        break;
                    case 1:
                        className = 'accept';

                        break;
                    case 2:
                        className = 'waiting';
                }
                const html = Mustache.render( student__enroll__list__template, {fullName, mobileNumber, id, id1: id, delId: id, status, className, background__color});
                $student__abstract__list.insertAdjacentHTML('beforeend', html);
            })
        }
    })
    .catch(e => console.log(e))
});
//-----------------------changeBtn About Us item ----------------------
$aboutUs__form.querySelector('.aboutUs__update__btn').addEventListener('click', (e)=>{
    e.preventDefault();
    const tokenStr = localStorage.getItem('token');
    const _id = $aboutUs.querySelector('.aboutUs__update__btn').id;
    const title = $aboutUs__form.querySelector('input[name="title"]').value;
    const description = $aboutUs__form.querySelector('input[name="description"]').value;
    const image = $aboutUs__form.querySelector('input[name="image"]').files[0];
    
    let formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("_id", _id);
    axios.patch('/admin/changeAboutUs', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization' : `Bearer ${tokenStr}`
        }
    })
    .then((data)=>{
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        
        $aboutUs__form.reset();
        $aboutUs__form.querySelector('.aboutUs__update__btn').style.display = 'none';
        $aboutUs__form.querySelector('.aboutUs__reset__btn').style.display = 'none';
        $aboutUs__form.querySelector('.aboutUs-btn').style.display = 'block';
         //$aboutUs.style.display = "none"; //******** */
        // getEnrolledStudent()
        displayAboutUs()
        Swal.fire({
            icon: 'success',
            title: 'رکورد شما با موفقیت تغییر کرد.',
            confirmButtonText: 'تایید'
        })
    })
    .catch(e=> console.log(e))

})

//---------------------reset__btn listener ----------------------

$aboutUs__form.querySelector('.aboutUs__reset__btn').addEventListener('click', e => {
    $aboutUs__form.querySelector('input[name="title"]').value = '';
    $aboutUs__form.querySelector('input[name="description"]').value = '';
    $aboutUs__form.querySelector('.aboutUs__update__btn').style.display = 'none';
    $aboutUs__form.querySelector('.aboutUs__reset__btn').style.display = 'none';
    $aboutUs__form.querySelector('.aboutUs-btn').style.display = 'block';
})
//-----------------------changeBtn TeamMembers item ----------------------
$teamMembers__form.querySelector('.teamMember__update__btn').addEventListener('click', (e)=>{
    e.preventDefault();
    const tokenStr = localStorage.getItem('token');
    const _id = $teamMembers__form.querySelector('.teamMember__update__btn').id;
    const name = $teamMembers__form.querySelector('input[name="name"]').value;
    const resume = $teamMembers__form.querySelector('input[name="resume"]').value;
    const image = $teamMembers__form.querySelector('input[name="image"]').files[0];
    
    let formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    formData.append("resume", resume);
    formData.append("_id", _id);
    axios.patch('/admin/changeTeamMember', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization' : `Bearer ${tokenStr}`
        }
    })
    
    .then((data)=>{
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        
        $teamMembers__form.reset();
        $teamMembers__form.querySelector('.teamMember__update__btn').style.display = 'none';
        $teamMembers__form.querySelector('.teamMember__reset__btn').style.display = 'none';
        $teamMembers__form.querySelector('.submit-btn').style.display = 'block';
        
        getTeamMembers();
        Swal.fire({
            icon: 'success',
            title: 'رکورد شما با موفقیت تغییر کرد.',
            confirmButtonText: 'تایید'
        })
    })
    .catch(e=> console.log(e))

})

//---------------------reset__btn listener ----------------------

$teamMembers__form.querySelector('.teamMember__reset__btn').addEventListener('click', e => {
    $teamMembers__form.querySelector('input[name="name"]').value = '';
    $teamMembers__form.querySelector('input[name="resume"]').value = '';
    $teamMembers__form.querySelector('.teamMember__update__btn').style.display = 'none';
    $teamMembers__form.querySelector('.teamMember__reset__btn').style.display = 'none';
    $teamMembers__form.querySelector('.submit-btn').style.display = 'block';
})

// *************************DISPLAY ENROLLED WHO ARE WAITING FOR ACCEPTION******************************** //
const displayAcceptEnrollList = status => {
    const tokenStr = localStorage.getItem('token');
    $acceptEnroll__abstract__list.textContent = '';
    
    axios({
        method: "get",
        url: "/admin/getAcceptEnrollList",
        headers: {"Authorization" : `Bearer ${tokenStr}`} 
    })
    .then(data=>{
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        data.data.forEach((el, index)=>{
            const background__color = index % 2 === 0 ? 'even':'odd';
            const fullName = el.firstName + ' ' + el.lastName;
            const mobileNumber = el.mobileNumber;
            const id = el._id;
            
            const html = Mustache.render( enroll__list__template, {fullName, mobileNumber, id, background__color});
            $acceptEnroll__abstract__list.insertAdjacentHTML('beforeend', html);
            
        })
    })
    .catch(e => console.log(e))
}

//--------------------- accept enroll function ------------------------------
const acceptEnroll = id => {
    const tokenStr = localStorage.getItem('token');
    const url = `/admin/getAcceptEnrolled?id=${id}`;
    axios({
        method: 'get',
        url: url,
        headers: {"Authorization" : `Bearer ${tokenStr}`}
    
    })
    .then(data=>{
       
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        $student__acceptEnroll__section.style.display = "block";
        $student__acceptEnroll__form.querySelector('input[name="firstName"]').value = data.data.firstName;
        $student__acceptEnroll__form.querySelector('input[name="lastName"]').value = data.data.lastName;
        $student__acceptEnroll__form.querySelector('input[name="parentName"]').value = data.data.parentName;
        $student__acceptEnroll__form.querySelector('input[name="NationalID"]').value = data.data.nationalID;
        $student__acceptEnroll__form.querySelector('input[name="yearOfBirth"]').value = data.data.yearOfBirth;
        $student__acceptEnroll__form.querySelector('input[name="mobileNumber"]').value = data.data.mobileNumber;
        $student__acceptEnroll__form.querySelector('input[name="zipCode"]').value = data.data.zipCode;
        $student__acceptEnroll__form.querySelector('input[name="address"]').value = data.data.address;
        $student__acceptEnroll__form.querySelector('.accept__Enroll').value = data.data._id;
        
        $docs.querySelector('#img1').style.display = 'block';
        $docs.querySelector('#img2').style.display = 'block';
        $docs.querySelector('#img3').style.display = 'block';

        $docs.querySelector('#img1').src = `./img/docs/${data.data.nationalID}/${data.data.pictureURL}`;
        $docs.querySelector('#img2').src = `./img/docs/${data.data.nationalID}/${data.data.passportURL}`;
        $docs.querySelector('#img3').src = `./img/docs/${data.data.nationalID}/${data.data.nationalIDURL}`;
        
    })
    .catch(e=>console.log(e))
}

$final__accept.addEventListener('click', e => {
    
    const tokenStr = localStorage.getItem('token');
    const id = $final__accept.value;
    const url = `/admin/finalEnroll?id=${id}`;
    axios({
        method: "patch",
        url: url,
        headers: {"Authorization" : `Bearer ${tokenStr}`}
    })
    .then( data => {
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        Swal.fire({
            icon: 'success',
            title: 'تغییرات با موفقیت ثبت شد.',
            confirmButtonText: 'تایید'
        })
        $student__acceptEnroll__section.style.display = 'none';
        displayAcceptEnrollList(1);
        getWaitingSt();

    })
    .catch(e => console.log(e));
})
$docs.querySelector('#img1').addEventListener('click', e=>{
    const imageUrl = $docs.querySelector('#img1').src;
    biggerImage(imageUrl, 550, 400)
})
$docs.querySelector('#img2').addEventListener('click', e=>{
    const imageUrl = $docs.querySelector('#img2').src;
    biggerImage(imageUrl, 550, 400)
})
$docs.querySelector('#img3').addEventListener('click', e=>{
    const imageUrl = $docs.querySelector('#img3').src;
    biggerImage(imageUrl, 550, 400)
})
//----------------------- approve payments list function ------------------
const approvePaymentsList = ()=>{
    const tokenStr = localStorage.getItem('token');
    $waiting__approve__wrapper.querySelector('table').innerHTML = '';
    axios({
        method: "get",
        url: '/admin/getWaitingApprove',
        headers: {"Authorization" : `Bearer ${tokenStr}`}
    })
    .then(data=>{
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        
        let html = '<tr> <th>ردیف</th> <th>کد ملی</th> <th>تاریخ واریز</th> <th>مبلغ واریزی</th> <th>ویرایش</th> </tr>';
 
        data.data.forEach((item, index)=>{
         
        html +=`<tr> <td>${index+1}</td> <td>${item.studentID}</td> <td>${item.payDate.substring(0,10)}</td> <td>${setPriceFormatV2(item.bill) + ' ریال'}</td> <td><a href="#" class="btn__check submit-btn" onclick="updatePaymentStatus('${item._id}')"><i class="fas fa-edit fa-lg"></i></a></td> </tr>`
        })
        $waiting__approve__wrapper.querySelector('table').insertAdjacentHTML('beforeend', html);

    })
    .catch(e=> console.log(e))
}
//--------------------------- update Payment Status function ----------------------
const updatePaymentStatus = (id)=>{
    
    const tokenStr = localStorage.getItem('token');
    const url = `/admin/getPaymentInfo?id=${id}`;
    axios({
        method: 'get',
        url: url,
        headers: {"Authorization" : `Bearer ${tokenStr}`}
    
    })
    .then(data=>{
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        $accept__payment__form.style.display = "block";
        $waiting__approve__wrapper.style.display = "none";
        $accept__payment__form.querySelector('input[name="name"]').value = data.data.student.firstName;
        $accept__payment__form.querySelector('input[name="family"]').value = data.data.student.lastName;
        $accept__payment__form.querySelector('input[name="nationalID"]').value = data.data.student.nationalID;
        $accept__payment__form.querySelector('input[name="payDate"]').value = data.data.payment.payDate.substring(0,19);
        $accept__payment__form.querySelector('input[name="bill"]').value = setPriceFormatV2(data.data.payment.bill) + ' ریال';
        $accept__payment__form.querySelector('input[name="educationYear"]').value = data.data.payment.thisYear;
        $accept__payment__form.querySelector('img').src = `../img/docs/${data.data.student.nationalID}/payments/${data.data.payment.billUrl}`
        $accept__payment__form.querySelector('.changeStatusBtn').id = data.data.payment._id;
    })
    .catch(e=>console.log(e))
}
//-----------------------------------------------
$accept__payment__form.querySelector('img').addEventListener('click', e=>{
    const imageUrl = $accept__payment__form.querySelector('img').src;
    biggerImage(imageUrl, 550, 400)
})
//------------------------ payment form listener -------------------
$accept__payment__form.querySelector('.changeStatusBtn').addEventListener('click', (e)=>{
    e.preventDefault();
    const tokenStr = localStorage.getItem('token');
    const id = $accept__payment__form.querySelector('.changeStatusBtn').id;
    const url = `/admin/acceptPayment?id=${id}`;
    axios({
        method: 'get',
        url: url,
        headers: {"Authorization" : `Bearer ${tokenStr}`}
    
    })
    .then(data=>{
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        Swal.fire({
            icon: 'success',
            title: 'پرداخت با موفقیت تایید شد.',
            confirmButtonText: 'تایید'
          })
        $accept__payment__form.style.display = "none";
        $waiting__approve__wrapper.style.display = "block";
        approvePaymentsList();
        getPaymentNum();
    })
    .catch(e=> console.log(e))

})
$accept__payment__form.querySelector('.reset__btn').addEventListener('click', (e)=>{
    e.preventDefault();
    $accept__payment__form.style.display = "none";
    $waiting__approve__wrapper.style.display = "block";
})
//----------------------- draw chart -------------------------
const draw = (pay, remain, discount, id) => {
    const ctx = document.getElementById(id).getContext('2d');
    const chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'pie',
        // The data for our dataset
        data: {
            labels: ['تخفیف','پرداخت شده', 'باقی مانده حساب'],
            datasets: [{
                label: 'My First dataset',
                backgroundColor: ['#7B1FA2','green', 'orange' ],
                data: [discount, pay, remain ]
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
//----- draw chart for number of students who paid or not paid -------------------------
//----------------------------------------------------------------------------
const drawBar = (paid, remain, notPaid, id) => {
    const ctx = document.getElementById(id).getContext('2d');
    const chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'pie',
        // The data for our dataset
        data: {
            labels: [' تسویه شده', 'تسویه نشده', 'بدون پرداخت'],
            datasets: [{
                label: 'My First dataset',
                backgroundColor: ['green', 'orange', 'red'],
                data: [paid, remain, notPaid]
            }]
        },
        // Configuration options go here
        options: {
            title: {
                display: true,
                text: ' دانش آموزان به تفکیک پرداخت در سال جاری  '
            },
            legend: {

            }
        }
    });
}
//-------------------------- get education years ------------------------------
const getEducationYears = () => {

    const tokenStr = localStorage.getItem('token');
    axios({
        method: 'get',
        url: '/admin/getEducationYears',
        headers: {"Authorization" : `Bearer ${tokenStr}`}
    })
    .then(data => {
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        let html = '';
        data.data.forEach(el=>{
            if (el.isActive)
            html += `<option value="${el.year}" selected>${el.year}</option>`
            else
                html += `<option value="${el.year}">${el.year}</option>`
        })
        document.querySelector('.educationYear__selector').querySelector('select').innerHTML = html;
        
    })
    .catch(e => console.log(e))
}
//-------------------------- get total payments ------------------------------

const totalPayments = (year='thisyear') => {

    const tokenStr = localStorage.getItem('token');
    const thisYear = year;
    axios({
        method: 'post',
        url: '/admin/getTotalPayments',
        data: {
            thisYear
        },
        headers: {"Authorization" : `Bearer ${tokenStr}`}
    })
    .then(data => {
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        draw(data.data.sum, data.data.remain, data.data.discount, 'chart1')
        
    })
    .catch(e => console.log(e))
}
//---------------------- get payments status for chart ------------------------------

const paymentStatus = (year='thisyear') => {

    const tokenStr = localStorage.getItem('token');
    const thisYear = year;
    axios({
        method: 'post',
        url: '/admin/getPaymentStatus',
        data: {
            thisYear
        },
        headers: {"Authorization" : `Bearer ${tokenStr}`}
    })
    .then(data => {
        if(data.data.login){
            const token = localStorage.getItem('token');
            if (token) localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        }
        drawBar(data.data.paid, data.data.remain,data.data.notPaid, 'chart2')
    })
    .catch(e => console.log(e))
}