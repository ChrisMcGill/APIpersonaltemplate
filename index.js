// bring in express server and create application
let express = require('express');
let app = express();
let pieRepo = require('./repos/pieRepo');
let errorHelper = require('./helpers/errorHelpers');

// use express router object
let router = express.Router();

//configure middleware to support json data
app.use(express.json());

//create GET to return array
router.get('/', function (req, res, next){
    pieRepo.get(function (data) {
    res.status(200).json({
        "status": 200,
        "statusText": "ok",
        "message": "All done",
        "data": data
    });
    }, function (err) {
    next(err);
    });
 });

//create GET/search?id=int&name=str to search by id an/or name
router.get('/search', function (req, res, next){
    let searchObject = {
        "id": req.query.id,
        "name": req.query.name
    };

    pieRepo.search(searchObject, function (data){
        res.status(200).json({
            "status": 200,
            "statusText": "search ok",
            "data": data
        });
    }, function (err) {
        next(err);
    });
});

//create get/id for single
router.get('/:id', function (req, res, next){
    pieRepo.getById(req.params.id, function (data){
        if (data){
            res.status(200).json({
                "status": 200,
                "statusText": "ok",
                "message": "single pie",
                "data": data
            });
        }
        else { 
            res.status(404).json({
                "status": 404,
                "statusText": "not found",
                "message": "pie" + req.params.id + "not found",
                "error": {
                    "code": "not found",
                    "message": "can not find"
                }
            });
        }
    },
        function (err) {
        next(err);
    });
});

//create post
router.post('/', function (req, res, next){
    pieRepo.insert(req.body, function(data){
        res.status(201).json({
            "status": 201,
            "statusText": "created",
            "data": data
        });
    }, function(err){
        next(errr);
    });
});

//create put
router.put('/:id', function (req, res, next){
    pieRepo.getById(req.params.id, function (data){
        if (data){
            pieRepo.update(req.body, req.params.id, function (data) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "ok put",
                    "message": "pie" + req.params.id + "updated",
                    "data": data
                });
            });
        }
    });
});
// --- patch
router.patch('/:id', function (req, res, next){
    pieRepo.getById(req.params.id, function (data){
        if (data){
            pieRepo.update(req.body, req.params.id, function (data) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "ok put",
                    "message": "pie" + req.params.id + "patched",
                    "data": data
                });
            });
        }
    });
});

//create delete
router.delete('/:id', function (req, res, next){
    pieRepo.getById(req.params.id, function (data){
    if (data){
        pieRepo.delete(req.params.id, function (data){
        res.status(200).json({
                "status": 200,
                "statusText": "ok delete",
                "message": "pie" + req.params.id + "deleted",    
            });
        });
    } else {
        res.status(404).json({
            "status": 404,
            "statusText": "not found",
            "message": "pie" + req.params.id + "not found",
            "error": {
                "code": "not found",
                "message": "can not find"
            }
        });
    }
    }, function (err) {
        next(err);
    });
});

//configure router so all routres prefixed /api/v1
app.use('/api/', router);

//errorbuilder
app.use(errorHelper.logErrorsToConsole);
app.use(errorHelper.logErrorsToFile);
app.use(errorHelper.clientErrorHandler);
app.use(errorHelper.errorHandler);

//create a server to listen on port 5000
var server = app.listen(5000, function (){
    console.log('Node server is running on http://localhost:5000..');
});

