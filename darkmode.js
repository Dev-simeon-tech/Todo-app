const darkModeToggle = document.querySelector('.mode-toggle')
let darkMode = localStorage.getItem('darkMode');

const enableDarkMode =  ()=>{
    document.body.classList.add('darkmode');
    localStorage.setItem('darkMode',"enabled")
}
const disableDarkMode= ()=>{
    document.body.classList.remove('darkmode')
    localStorage.setItem('darkMode', null) 
}
if (darkMode === "enabled"){
    enableDarkMode();
}
darkModeToggle.addEventListener('click',()=>{
    darkMode = localStorage.getItem("darkMode")
    if(darkMode !== 'enabled'){
        if(!document.startViewTransition){
            enableDarkMode();
        }
        document.startViewTransition( ()=>{
            enableDarkMode();
        })
    
    }
    else{
        if(!document.startViewTransition){
            disableDarkMode();
        }
        document.startViewTransition( ()=>{
            disableDarkMode();
        })
    }
})