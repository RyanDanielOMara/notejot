if(process.env.NODE_ENV === 'production') {
    module.exports = { mongoURI: 'mongodb://ryan:ryan@ds213338.mlab.com:13338/vidjot-prod'}
} else {
    module.exports = { mongoURI: 'mongodb://localhost/vidjot-dev'}
}