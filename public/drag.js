    const todosList = document.querySelector('.todo-list')

    function onDragStart(e){
        e.target.classList.add('dragging');
    }

    function onDragEnd(e){
        e.target.classList.remove('dragging');
    }
    todosList.addEventListener('dragover',(e)=>{
        console.log('dragover')
        e.preventDefault();
        const afterElement = getDragAfterElement(todosList, e.clientY)
        const draggable = document.querySelector('.dragging');
        if(afterElement === null){
            todosList.appendChild(draggable)

        }else{
            todosList.insertBefore(draggable, afterElement)
        }
    })

    function getDragAfterElement(list,y){
    const draggableElements = [...list.querySelectorAll('[draggable]:not(.dragging)')]

        return draggableElements.reduce((closest,item)=>{
            const box = item.getBoundingClientRect();
            // console.log(box)
            const offset = y - box.top - box.height / 2;
            if(offset < 0 && offset > closest.offset){
                return {offset, element: item }
            }else{
                return closest
            }

            },{offset: Number.NEGATIVE_INFINITY}).element

    }