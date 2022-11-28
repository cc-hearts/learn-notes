import Server from './http.js'
import RouterTest from './router-test.js'

const app = new Server()


app.use('/api', RouterTest)



app.listen(9000)