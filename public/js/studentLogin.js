$login__form = document.querySelector('.form1');

const isLogin = localStorage.getItem('studentToken');
if (isLogin)  window.location.replace("/student/home");

$login__form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    
    let username = $login__form.querySelector('input[name="username"]').value;
    let password = $login__form.querySelector('input[name="password"]').value;
    username = digitToEnglish(username);
    password = digitToEnglish(password);
    show();
    const token = await axios({
        method: 'post',
        url: '/student/login',
        data: {
            username,
            password
        }
    })
    hide();
    if(token.data.find) 
    {
        localStorage.setItem('studentToken', token.data.token)
        window.location.replace("/student/home");
        
    }
    else{
        const isLogin = localStorage.getItem('studentToken');
        if (isLogin) localStorage.removeItem('studentToken');
        Swal.fire({
            icon: 'error',
            title: 'خطا!',
            text: ' دانش آموزی با این مشخصات یافت نشد',
            confirmButtonText: 'تایید'
        })
    }
    
})

//------------------------ Digit to ENG convertor ---------------------------
const digitToEnglish = (value)=>{
    // const persianDigit = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    let res;
    let newValue='';
    console.log(value.length)
    for (let i=0; i<value.length; i++){
        res = value.charCodeAt(i) - '۰'.charCodeAt(0);
        console.log(res, newValue, value.substring(i,i+1), i)
        if (res>=0 && res<=9) 
            newValue += res
        else
            newValue += value.substring(i,i+1);
    }
    return newValue;
   }
//----------------- forget password function ------------------
const forgetPassword = async ()=>{
    const { value: formValues } = await Swal.fire({
        title: 'تغییر رمز عبور',
        showCancelButton: true,
        confirmButtonText: 'تایید',
        cancelButtonText: 'انصراف',
        html:
          '<input id="swal-input1" class="swal2-input" placeholder=" کد ملی" type="text">'+
          '<input id="swal-input2" class="swal2-input" placeholder=" شماره تلفن همراه" type="text">',
        focusConfirm: false,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return [
            document.getElementById('swal-input1').value,
            document.getElementById('swal-input2').value
          ]
        }
    })
      
      if (formValues) {
          show();
            axios({
                method: 'post',
                url: '/student/forgetPassword',
                data: {
                    formValues
                }
            })
            .then(data => {
                hide();
                if (data.data === 'changed'){
                    Swal.fire({
                        icon: 'success',
                        title: 'رمز شما با موفقیت تغییر کرد رمز عبور جدید سال تولد شما می باشد',
                        confirmButtonText: 'تایید'
                      })

                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'خطا!',
                        text: ' دانش آموزی با این مشخصات یافت نشد',
                        confirmButtonText: 'تایید'
                    })
                }

            })
            .catch(e=> console.log(e))
        } 
}
