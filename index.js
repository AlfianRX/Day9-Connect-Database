// import express
const express = require('express');
const { Client } = require('pg');

// database connect
const db = require('./connection/db')

// use express
const app = express()

// handlebars view
app.set('view engine', 'hbs');

app.use('/public', express.static('public'))

//body parser
app.use(express.urlencoded({ extended: false })) 

// e.g aOo

const projects = [
    //  {
    //      title: "UI UX Aplikasi Campaign",
    //      dateStart:"2022-07-16",
    //      dateEnd:"2022-09-15",
    //      deadline:"2 Bulan",
    //      description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam, molestiae numquam! Deleniti maiores expedita eaque deserunt quaerat! Dicta, eligendi debitis?",
    //      techno: "laravel"
    //  }
]

const islogin = true


// endpoimt
app.get('/home', function (req, res) {
    
   let selectQuery = 'SELECT * FROM tb_projects ORDER BY id DESC'

    db.connect((err,client,done) => {
        if(err) throw err

        client.query(selectQuery, (err,result) => {
            done()
            if(err) throw err;

            console.log(result.rows);
            let dataProjects = result.rows

            res.render('index', {project:dataProjects})
        })
    })

})

app.get('/contact-me', function (req, res) {
    res.render('contact-me')
})

app.get('/project', function (req, res) {
    
    if(islogin){
        res.render('add-project')
    } else
    {
        res.redirect('/home')
    }
})

// fetch detail project
app.get('/project/:id', function (req, res) {
    let id = req.params.id
    res.render('detail-project', {data : projects[id]})
})

// button edit project 
app.get('/edit-project/:id', function (req, res) {
    let id = req.params.id

    res.render('edit-project', {data : projects[id]})
})

app.post('/edit-project', function (req,res){
    let id = req.params.id
    projects.map( function (data){
        return {
        ...data,
        title: data.title[id],
        description: data.description[id],

    }   
    })
    res.redirect('/home')
})

// button delete project 
app.get('/delete-project/:id', function (req, res) {
    let id = req.params.id

    projects.splice(id, 1);

    res.redirect('/home')
})

// post project

app.post('/project', function (req, res) {
    let {title} = req.body;
    let {dateStart} = req.body;
    let {dateEnd} = req.body;
    let {description} = req.body;
    let{techno} = req.body;

    let project = {
        title,
        dateStart,
        dateEnd,
        deadline: countDuration(new Date(dateStart), new Date(dateEnd)),
        description,
        techno,
    }

    projects.push(project)

    // console.log(projects);

    res.redirect('/home')
})

function countDuration(dateStart, dateEnd) {
    const result =
    dateEnd.getMonth()-
    dateStart.getMonth();
    Math.abs(result);
    return `${result} Bulan`
  }


// port
const port = 3000
app.listen(port, function () {
    console.log(`server running on port : ${port}`);
})