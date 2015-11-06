describe('Topic', function(){
	it('can save a new instance', function(done){
		expect(TestProject.Models).to.exist;
		expect(TestProject.Models.Topic).to.exist;
		new TestProject.Models.Topic({description: 'abc'})
				.save().then(function(topic){
					expect(topic).to.exist;
				}).catch(function(error){
					expect(error).not.to.exist;
				}).finally(done);
	});
})