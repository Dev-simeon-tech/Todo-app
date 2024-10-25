const todoInput = document.querySelector('.todo-input');
const todoList = document.querySelector('.todo-list')
const form = document.querySelector('form')
const itemsLeft = document.querySelector('.items-left')
const todos = document.getElementsByClassName('todos')
const filterNav = document.querySelector('.filter-nav');
const clearCompletedBtn = document.querySelector('.clear-completed')

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(!todoInput.value) return;
    const todoId = generateRandomId();
    updateTodo(todoInput.value.trim(),'active',todoId);
    postListData(todoInput.value.trim(),'active',todoId)
    todoInput.value ='';
})
function generateRandomId() {
    return Math.random().toString(36).substr(2, 9); // remove `0.` prefix
}
function todoTemplate(value){
    return `
        <div class="flex align-center">
            <div class="check-btn" ></div>
            <p>${value}</p>

        </div>
        <img class="cancel-btn" src="images/icon-cross.svg" alt="">
    `;
}
const updateTodo = function(value,category,id){
    const li = document.createElement('li')
    li.classList.add('todos')
    li.innerHTML = todoTemplate(value);
    li.dataset.category = category;
    li.dataset.todoId = id ;
    li.setAttribute('draggable','true')
    todoList.appendChild(li)
    li.addEventListener('dragstart',onDragStart)
    li.addEventListener('dragend',onDragEnd)
    updateTodosLeft();

}
function updateTodosLeft(){
    const activeTodos = document.querySelectorAll('[data-category="active"]');
    itemsLeft.textContent = `${activeTodos.length} items left`
}

todoList.addEventListener('click',(e)=>{
    updateCheck(e);
    deleteTodos(e);
})

function updateCheck(e){
    if(e.target.className !== 'check-btn') return;
    const div = e.target.parentElement;

    if(div.parentElement.dataset.category === 'active'){
        div.parentElement.dataset.category = 'completed'
    }else{
        div.parentElement.dataset.category ='active'; 
    }
    updateTodosLeft();
    // posting updated todo
    const targetValue = e.target.nextElementSibling.textContent;
    const category = div.parentElement.dataset.category;
    const todoId = div.parentElement.dataset.todoId;
    postListCategory(targetValue,category,todoId)
}
function deleteTodos(e){
    if(e.target.className !== 'cancel-btn') return;
    const todo = e.target.parentElement;
    todo.remove();
    updateTodosLeft();
    const id = todo.dataset.todoId
    console.log(id)
    postDeletedtodos(id)

}
function updateActivefilterTab(target){
    const currentActive = filterNav.querySelector('.active')
    if(currentActive === target) return;
    currentActive.classList.remove('active');
    target.classList.add('active')
}

filterNav.addEventListener('click',(e)=>{
    if(!e.target.closest('button')) return;
    const filter = e.target.getAttribute('data-filter');

    if(document.startViewTransition){
        document.startViewTransition( ()=>{
            updateActivefilterTab(e.target);
            filterTodoList(filter,todos);
        })

    }else{
        updateActivefilterTab(e.target);
        filterTodoList(filter,todos);
    }
})

clearCompletedBtn.addEventListener('click',()=>{
    const completed = todoList.querySelectorAll("[data-category = 'completed']");
    Array.from(completed).forEach( el =>{
        el.remove();
        const id = el.dataset.todoId
        postDeletedtodos(id);
    })
})

async function postListData(value,category,id){
    try{
       await axios.post('/',{
            todo: {id,value,category}
       })
    }catch(e){
        console.log(e)
    }
}
async function postListCategory(value,category,id){
    try{
       await axios.post('/category-update',{
            todo: {id,value,category}
       })
    }catch(e){
        console.log(e)
    }
}
async function getListData(){
    try{
       const response = await axios.get('/list');
       console.log(response)
       const data = response.data
       for(let todo of data.todos){
           const {value, category ,id} = todo
            updateTodo(value,category,id)
       }
       
    }catch(e){
        console.error(e.message)
    }
}
getListData();

async function postDeletedtodos(id){
    try{
        await axios.post('/delete-todo',{ id })
    } catch(e){
        console.error(e.message)
    }

}