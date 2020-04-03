const $news__wrapper = document.querySelector('.news');
//const $more__news = document.querySelector('.more__news');
const $aboutUs__wrapper = document.querySelector('.content1');
const $team__wrapper = document.querySelector('.team');
//const list__news__temp = document.querySelector('#list__news__template').innerHTML;
const aboutUs__temp = document.querySelector('#aboutUs__template').innerHTML;
const team__temp = document.querySelector('#team__template').innerHTML;
const news__temp = document.querySelector('#news__template').innerHTML;
//-----------------for news content ----------------------------------
const $news__container = document.querySelector('#row2');
const arrow__icon = 'arrow__icon';
//----------------------------------------------------------------
document.querySelector('.adminBtn').addEventListener('click', e=>{
    const tokenStr = localStorage.getItem('token');
    axios({
        method: 'get',
        url: '/admin',
        headers: {"Authorization" : `Bearer ${tokenStr}`}
    })
    .then(data=>{
        if (data.data.login){
            localStorage.removeItem('token');
            return window.location.replace("/admin/login");
        } 
        window.location.replace("/admin");
    })
    .catch(e=> console.log(e))
})
//----------------------------------------------------------------
document.querySelector('.studentBtn').addEventListener('click', e=>{
    const tokenStr = localStorage.getItem('studentToken');
    axios({
        method: 'get',
        url: '/student/home',
        headers: {"Authorization" : `Bearer ${tokenStr}`}
    })
    .then(data=>{
        if (data.data.login){
            localStorage.removeItem('studentToken');
            return window.location.replace("/student/login");
        } 
        window.location.replace("/student/home");
    })
    .catch(e=> console.log(e))
})
//----------------------------------------------------------------
document.querySelector('.teacherBtn').addEventListener('click', e=>{
    const tokenStr = localStorage.getItem('teacherToken');
    axios({
        method: 'get',
        url: '/teacher/home',
        headers: {"Authorization" : `Bearer ${tokenStr}`}
    })
    .then(data=>{
        if (data.data.login){
            localStorage.removeItem('teacherToken');
            return window.location.replace("/teacher/login");
        } 
        window.location.replace("/teacher/login");
    })
    .catch(e=> console.log(e))
})
//----------------------------------------------------------
const getNews = ()=>{
    const tokenStr = localStorage.getItem('token');

    axios({
        method: 'get',
        url: '/news/getNews',
        headers: {"Authorization" : `Bearer ${tokenStr}`}
    })
    .then(data=>{
        if (data.data.login) return window.location.replace("/admin/login");

        data.data.forEach(el=>{
            if (el.isPublish){
                const title = el.title;
                const abstract = el.shortDescription;
                const description = el.fullDescription;
                const id = el._id;
                const date = ' تاریخ درج خبر :  ' + el.createDate.substring(0,10) + '  ساعت  ' + el.createDate.substring(11,20);
                const url = 'img/news/' + el.image;
                
                const html = Mustache.render( news__temp, {title, description, url, abstract, id, id1: id, date});
                $news__wrapper.insertAdjacentHTML('beforeend', html);
                document.querySelector('.full__description').innerHTML = description;
            }  
        })
    })
        .catch(e=>console.log(e))
}
//-----------------------get aboutUS --------------------

const getAboutUs = ()=>{
    const tokenStr = localStorage.getItem('token');

    axios({
        method: 'get',
        url: '/admin/aboutUs',
        headers: {"Authorization" : `Bearer ${tokenStr}`}
    })
    .then(data=>{
        if (data.data.login) return window.location.replace("/admin/login");
        data.data.forEach(el=>{
            const title = el.title;
            const description = el.description;
            const url = 'img/aboutUs/' + el.image;
            const html = Mustache.render( aboutUs__temp, {title, description, url});
            $aboutUs__wrapper.insertAdjacentHTML('beforeend', html);  
        })
    })
        .catch(e=>console.log(e))
}
//-----------------------get team members --------------------

const getTeamMembers = ()=>{
    const tokenStr = localStorage.getItem('token');

    axios({
        method: 'get',
        url: '/get/teamMembers',
        headers: {"Authorization" : `Bearer ${tokenStr}`}
    })
    .then(data=>{
        if (data.data.login) return window.location.replace("/admin/login");
        data.data.forEach(el=>{
            const name = el.name;
            const resume = el.resume;
            const url = 'img/teamMembers/' + el.image;
            const html = Mustache.render( team__temp, {name, resume, url});
            $team__wrapper.insertAdjacentHTML('beforeend', html);  
        })
    })
        .catch(e=>console.log(e))
}
//------------------------load page-----------------------
window.addEventListener('load', ()=>{
    getNews();
    getAboutUs();
    getTeamMembers();
});


//---------------------------more news------------------------
$news__container.addEventListener('click', (e) => {
    const btn = e.target.closest('.arrow__icon');
    if (btn){
        const $container = document.getElementById(`${btn.getAttribute('id')}`);   
        
        if($container.querySelector('.img__news').style.display === 'block'){
            $container.querySelector('.img__news').style.display = 'none';
            $container.querySelector('.full__description').style.display = 'none';
            $container.querySelector('.arrow__icon').setAttribute('src', './img/down.png');
            $container.querySelector('.abstract').style.display = 'block';
        }
        else {
            $container.querySelector('.img__news').style.display = 'block';
            $container.querySelector('.full__description').style.display = 'block';
            $container.querySelector('.abstract').style.display = 'none';
            $container.querySelector('.arrow__icon').setAttribute('src', './img/up.png');
        }
    }

});


  //**********************************************************/
const isLogin = () => {
    const token = localStorage.getItem('token');
    try{

    
    axios({
        method: 'get',
        url: '/admin/checkLogin',
        headers: {"Authorization" : `Bearer ${token}`} 
    })
    .then(data => {
     if (!data.data.login) {
        
       
        window.location.replace("/admin")
     }
     if (data.data.login) window.location.replace("/admin/login")
    })}
    catch{(e => {
        
        window.location.replace("/admin/login")
    })}
}