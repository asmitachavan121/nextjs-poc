/*
proper working code 
*/

const express = require('express')
const next = require('next')
var Couchbase = require("couchbase");
var BodyParser = require("body-parser");
var UUID = require("uuid");

const port = 3000

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const server = express()
// var N1qlQuery = Couchbase.N1qlQuery;
// var cluster = new Couchbase.Cluster("couchbase://localhost")
// cluster.authenticate('Administrator', 'password')
// var bucket = cluster.openBucket('travel-sample')
// server.use(BodyParser.json())

app.prepare().then(() => {
    // const server = express()
    var N1qlQuery = Couchbase.N1qlQuery;
    var cluster = new Couchbase.Cluster("couchbase://localhost")
    cluster.authenticate('Administrator', 'password')
    var bucket = cluster.openBucket('default')
    server.use(BodyParser.json());

    server.get("/get", function(request, response) {
        var query = N1qlQuery.fromString("SELECT `" + bucket._name + "`.* FROM `" + bucket._name + "`");
        // var query = N1qlQuery.fromString(`SELECT ${bucket._name} + . * FROM ${bucket._name}`);
        bucket.query(query, function(error, result) {
            if(error) {
                return response.status(500).send(error);
            }
            response.send(result);
        });
    });

    

    server.post("/save/:id", function(request, response) {

        const params = request.params.id
        console.log(params)
        bucket.insert(request.params.id, request.body, function(error, result) {
            if(error) {
                return response.status(500).send(error);
            }
            response.status(201).send(result);
        });
    });

    server.delete('/delete/:id', function(request, response) {
        console.log(`req.params.id = ${request.params.id}`)
        const _Id = request.params.id
        // console.log(_Id)
        // response.send(_Id)
        bucket.remove(_Id, function (error, result) {
            if(error) {
                if(error.code == 13) {
                    console.log('Key does not exist error!')
                    return response.status(404).end(error.message)
                }
                console.log(error)
                return response.status(500).send(error)
            }
            response.send(result)
        } )

    })

    server.patch('/replace/:id', function(request, response) {
        console.log(`req.params.id = ${request.params.id}`)
        const _Id = request.params.id
        // console.log(_Id)
        // response.send(_Id)
        bucket.replace(_Id, request.body, function (error, result) {
            if(error) {
                return response.status(500).send(error)
            }
            response.status(202).send(result)
        } )

    })

    server.get('/', (request, response) => {
        return handle(request,response)
    })


    server.listen(process.env.APPLICATION_PORT || 3000, function() {
    console.log(`Listening on ${port}...`);
    });

})

module.exports = server

