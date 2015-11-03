describe('Topic', function(){
	it('can save a new instance', function(done){
		expect(Models).to.exist;
		expect(Models.Topic).to.exist;
		new Models.Topic({description: 'abc'})
				.save().then(function(topic){
					expect(topic).to.exist;
				}).catch(function(error){
					expect(error).not.to.exist;
				}).finally(done);
	});
})