const $addCourse__form = document.querySelector('.course .courseForm');
//----------------- add course form listener --------------------
$addCourse__form.addEventListener('submit', e=>{
    e.preventDefault();
    const tokenStr = localStorage.getItem('token');
    const name = $addCourse__form.querySelector('input[name="name"]').value;
    const grade = $addCourse__form.querySelector('select').value;
    axios({
        method: 'post',
        url: '/admin/addCourse',
        data: {
            name,
            grade
        },
        headers: {'Authorization' : `Bearer ${tokenStr}`}
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
        $addCourse__form.reset();
    })
    .catch(e=> console.log(e))

})