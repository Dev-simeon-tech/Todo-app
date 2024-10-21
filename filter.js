const filterTodoList = (filter,todos)=>{
    for(let todo of todos){
        const todoCategory = todo.getAttribute('data-category');        
        if(filter === 'all' || filter === todoCategory){
            todo.removeAttribute('hidden')
        }else{
            todo.setAttribute('hidden','')
        }
    }
}