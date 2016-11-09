module.exports = function(Project, bookshelf){
    return bookshelf.Model.extend({
            tableName: 'TestModel'
        });
}
