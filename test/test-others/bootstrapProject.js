describe('__bootstrapProject.js__', function(){
    it('can load models', function(){
        var project = require('../../config/bootstrap.js')();
        expect(project.Models).to.exist;
        expect(project.Models.TestModel).to.exist;
        project.shutdown();
    });
});
