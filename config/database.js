if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://Ben:admin@ds245277.mlab.com:45277/vidjot-prod'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}