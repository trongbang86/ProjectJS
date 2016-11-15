describe('TestModel', function() {
    it('can save a new instance', function(done){
        expect(TestProject.Models.TestModel).to.exist;
        new TestProject.Models.TestModel({description: 'abc'})
            .save().then(function(tm){
                expect(tm).to.exist;
            }).catch(function(error){
                expect(error).not.to.exist;
            }).finally(done);
    });

});
