const  express  = require('express');
const cookieSession = require('cookie-session');
const path = require('node:path')
const  {connectDb, getDb} =  require('./db');
const { ObjectId } = require('mongodb');

const  app = express();
const PORT = 4000;
app.use(express.static('public'))
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(cookieSession({
    name: 'session',
    keys: ['dhdytfoceueddg'],
  
  }))
let database;
connectDb( async(err)=>{
    if(!err){ 
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

        database = getDb();
    }
})

app.get('/list', async(req,res)=>{
    if(!req.session.listId) return ;
    
    const listCollection = database.collection('todo-list');
    
    const existingList = await listCollection.findOne({ _id:new ObjectId(req.session.listId)})
    res.json({todos: existingList.todos})


})



app.post('/',async(req,res)=>{
    const {todo} = req.body
 
    const listCollection = database.collection('todo-list');
    try{
        const existingList = await listCollection.findOne({ _id:new ObjectId(req.session.listId)})

        if(existingList){
            console.log('found')
            await listCollection.updateOne({_id:new ObjectId(req.session.listId)},
                {$push: {todos: todo}})
            return res.json({success: true});
        }else{
    
            const listRes = await listCollection.insertOne({todos: [todo]})
            req.session.listId = listRes.insertedId.toString();
            return res.json({success: true});
        }
    }catch(e){
        console.log(e)
    }
})
app.post('/category-update',async(req, res)=>{
    const listCollection = database.collection('todo-list');
    const {todo} = req.body
    const existingList = await listCollection.findOne({ _id:new ObjectId(req.session.listId)})
   
    const listArr = existingList.todos
    const updatingTodo = listArr.find((item)=> todo.id === item.id)
    await listCollection.updateOne({_id:new ObjectId(req.session.listId)},
        {$pull: {todos: updatingTodo}})

    updatingTodo.category = todo.category;

    await listCollection.updateOne({_id:new ObjectId(req.session.listId)},
        {$push: {todos: updatingTodo}})

    res.json({success: true})
})

app.post('/delete-todo',async(req,res)=>{
    const listCollection = database.collection('todo-list');
    const {id} = req.body;
    console.log(id)
    const existingList = await listCollection.findOne({ _id:new ObjectId(req.session.listId)})
    const listArr = existingList.todos
   
    const deletingTodo = listArr.find((item)=> id === item.id);

    await listCollection.updateOne({_id:new ObjectId(req.session.listId)},
        {$pull: {todos: deletingTodo}})
    
    res.json({success: true})

})