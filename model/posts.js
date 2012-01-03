module.exports = function(mongoose, Schema){
    var postschema = new Schema({
        title    :  String
      , date     :  {type: Date, default: Date.now, index: true}
      , author   :  {type: String, index: true }
      , content  :  String
    });
    
    var posts = mongoose.model('posts', postschema);
    var postarr = [] ;
    posts.find({}, 
            function(err, data) { 
                    data.forEach(function(data){
                            //console.log(err, data, data.length); 
                            postarr.push(data) ;
                    }) ;
                    mongoose.disconnect();
            })
}