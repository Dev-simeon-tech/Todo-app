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
    updateTodo();
    todoInput.value ='';
})
function todoTemplate(value){
    return `
        <div class="flex align-center">
            <div class="check-btn" ></div>
            <p>${value}</p>

        </div>
        <img class="cancel-btn" src="images/icon-cross.svg" alt="">
    `;
}
const updateTodo = function(){
    const li = document.createElement('li')
    li.classList.add('todos')
    li.innerHTML = todoTemplate(todoInput.value.trim());
    li.dataset.category = 'active';
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
    e.target.toggleAttribute('data-active');
    const div = e.target.parentElement;

    if(div.parentElement.dataset.category === 'active'){
        div.parentElement.dataset.category = 'completed'
    }else{
        div.parentElement.dataset.category ='active'; 
    }
    updateTodosLeft();
}
function deleteTodos(e){
    if(e.target.className !== 'cancel-btn') return;
    const todo = e.target.parentElement;
    todo.remove();
    updateTodosLeft();

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
    })
})