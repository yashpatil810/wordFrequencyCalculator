var request = require('request');           // TO FETCH THE FILE FROM REMOTE SERVER
var contractions = require('contractions'); // TO EXPAND CONTRACTIONS
var urlExists = require('url-exists');      // TO CHECK IF THE FILE EXISTS


var Controller ={
    getApi: function(req, res){
        if(req.body.limit.match(/^[0-9]+$/)){ // VALIDATION OF INPUT NUMBER
            urlExists('http://terriblytinytales.com/test.txt', function(err, exists) {  
                // CHECK IF THE FILE EXITS
                if(exists){
                    request.get('http://terriblytinytales.com/test.txt', function (error, response, body) {
                        if(error){
                            res.send({error: error})
                        } else if (!error && response.statusCode == 200) {
                            // REPLACE CURLY APOSTROPHES TO NORMAL ONE
                            body = body.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');

                            // EXPAND CONTRACTIONS IF TRUE
                            if(req.body.expandContractions){
                                body = contractions.expand(body)
                            }

                            // GET THE WORDS
                            var words = body.match(/['\w]*[^\d\W]+/gi);

                            // WORD FREQUENCY COUNTER
                            var frequencyCount = {}
                            words.forEach(w => {
                                w = w.toLowerCase();
                                if(!frequencyCount[w]){
                                    frequencyCount[w] = 0;
                                }
                                frequencyCount[w] += 1
                            });
                            
                            // SORT WORD COUNT ARRAY: DESCENDING
                            var sortedFC = [];
                            for(var w in frequencyCount){
                                sortedFC.push([w, frequencyCount[w]])
                            }
                            sortedFC.sort(function(a,b){
                                return b[1]-a[1]
                            })

                            // SEND RESPONSE TO FRONTEND
                            res.send({words: words, sortedFC: sortedFC.slice(0, req.body.limit)})
                        }
                    });
                } else {
                    res.send({error: 'FILE DOES NOT EXIST'})
                }
            });
        }else{
            res.send({error: 'NOT A NUMBER'})
        }   
    }
}

module.exports = Controller;