const request = require('supertest')
const server = require('../app').server
const app = require('../app').app

describe('GET /', () => {
        test("it should respond with response status 200", async () => {
                const response = await request(server)
                .get("/get")
                .catch((e) => {
                    console.log(e.message)
                })
                expect(response.status).toBe(200)
                setTimeout(() => {console.log('test timed out!')} ,2000)
                
                console.log(response? 'This was a success!' + response: 'This was a failure')
                
        })   
    
})


// describe('GET /',() => {
//     test("It should respond with exit status 201 ",  () => {
//         request(server)
//         .post("/save/43")
//         .send({
//             "userId": "1",
//             "title": "test is cool"
//         })
//         .then((response) => {
//             console.log(response)
//             expect(response.statusCode).toBe(201)
//         })
//         .catch((err) =>{
//             console.log(`error is ${err}`)
//         })
//         .expect(201)
//     })
// })