const express = require('express')
const fs = require('fs')

const PORT = 6677
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: '.' })
})
var methodOverride = require('method-override')
app.use(methodOverride('_method'))

app.post('/add_employee', (req, res) => {
    const data = JSON.parse(fs.readFileSync('employee.json'))
    var data1 = req.body
    const len = Object.keys(data).length
    data1["id"] = len + 1
    // data1.push({"id":data.lenght+1})
    data.push(data1)
    fs.writeFileSync('employee.json', JSON.stringify(data))
    console.log(typeof (req.body))
    //res.send('<h1>Data Added</h1>')
   	return res.redirect('/')
})
app.get('/employee_data', (req, res) => {
    const data = JSON.parse(fs.readFileSync('employee.json'))
    var data1 = fs.readFileSync('table.html')
    //res.send(data1.toString())
    data.map((item, index) => {
        data1 = data1 + (`<tr><td>${index + 1}</td><td>${item.employeeid}</td><td>${item.name}</td><td>${item.number}</td><td>${item.email}</td><td>${item.salary}</td><td><form method="GET" action="/updatedata/${item.id}/${item.employeeid}/${item.name}/${item.number}/${item.email}/${item.salary}">
        <button class="btn btn-warning" type="submit" >Update</button>
      </form><form method="POST" action="/deletedata/${item.id}?_method=DELETE">
        <button class="btn btn-danger" type="submit">Delete</button>
      </form></td>
</tr>`)
    })
    data1 = data1 + (`</tbody></table></div></body></html>`)
    res.send(data1)
})
app.delete('/deletedata/:id', (req, res) => {
    const id=req.params.id
    const data=JSON.parse(fs.readFileSync('employee.json'))
    var indexdata=0
    data.map((item,index)=>{
        if(item.id==id){
            indexdata=index
        }
    })
    data.splice(indexdata,1)
    fs.writeFileSync('employee.json',JSON.stringify(data))
    console.log(data)
    console.log(`index=${indexdata}`)
    res.send('<script>window.location.href="/employee_data";</script>');
})
app.put('/updatedata/:id', (req, res) => {
    const id=req.params.id
    var data=JSON.parse(fs.readFileSync('employee.json'))
    var data1=(req.body)
    data.map(item=>{
        if(item.id==id){
            item.employeeid=data1.employeeid
            item.name=data1.name
            item.number=data1.number
            item.email=data1.email
            item.salary=data1.salary
        }
    })
    fs.writeFileSync('employee.json',JSON.stringify(data))
    res.send(` <script>
    setTimeout(()=>{
        window.location.replace('/employee_data')
    },2000)
    </script>
<h1>Data Updated</h1>`)}
   )
app.get('/updatedata/:id/:employeeid/:name/:number/:email/:salary',(req,res)=>{
    var data =fs.readFileSync('Updata.html').toString()
    const id=req.params.id
    const employeeid=req.params.employeeid
    const name=req.params.name
    const number=req.params.number
    const email=req.params.email
    const salary=req.params.salary
    console.log(id)
    data=data.replace('${item.id}',id)
    data=data.replace('initialemployeeid',employeeid)
    data=data.replace('initialname',name)
    data=data.replace('initialnumber',number)
    data=data.replace('initialemail',email)
    data=data.replace('initialsalary',salary)
    console.log(data)
    res.send(data)
    
})
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });