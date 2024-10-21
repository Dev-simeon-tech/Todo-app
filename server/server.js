const  express  = require('express')
const  {connectDb, getDb} =  require('./db')

const  app = express();
const PORT = 4000;
app.use(express.static('public'))

connectDb( async(err)=>{
    if(!err){ 
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

        database = getDb();
    }
})
