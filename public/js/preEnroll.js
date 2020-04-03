const $form__container = document.querySelector('.preEnroll')

$form__container.addEventListener('submit', (e)=>{
    e.preventDefault()
    

    let ID = $form__container.querySelector('input[name="nationalID"]').value;
    ID = digitToEnglish(ID)
    let mobile = $form__container.querySelector('input[name="mobile"]').value;
    mobile = digitToEnglish(mobile);
    data = {
   
        name : $form__container.querySelector('input[name="name"]').value,
        family : $form__container.querySelector('input[name="family"]').value,
        nationalId: ID,
        mobile : mobile,
        level: $form__container.querySelector('select[name="level"]').value,
        lastSchool : $form__container.querySelector('input[name="lastSchool"]').value,
        fatherJob : $form__container.querySelector('input[name="fatherJob"]').value,
        fatherLicense : $form__container.querySelector('select[name="fatherLicense"]').value,
        motherJob : $form__container.querySelector('input[name="motherJob"]').value,
        motherLicense : $form__container.querySelector('select[name="motherLicense"]').value,
        childNum : $form__container.querySelector('input[name="childNum"]').value,
        isSacrifice : $form__container.querySelector('input[name="isSacrifice"]').checked,
        lastYearMark : $form__container.querySelector('input[name="lastYearMark"]').value
    }
    show();
    axios({
        method: "post",
        url: "/preEnroll",
        data: {
            data
        }
    })
    .then(data => {
        hide();
        if (data.data === 'repeat')
            return Swal.fire({
                icon: 'error',
                title: 'شما قبلا پیش ثبت نام کرده اید',
                confirmButtonText: 'تایید'
              })
       
        Swal.fire({
            icon: 'success',
            title: 'درخواست شما با موفقیت ثبت شد. نتیجه به صورت پیامک به شما ارسال خواهد شد',
            confirmButtonText: 'تایید'
          })
        $form__container.reset();
    })
    .catch(e => console.log(e))
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