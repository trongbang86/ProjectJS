describe('TopicSerivce', function(){
	it('can save a new topic', function(done){
		expect(TestProject.Services).to.exist;
		expect(TestProject.Services.TopicService).to.exist;
		TestProject.Services.TopicService.save({description: 'abc'}, function(err, topic){
			expect(topic).to.exist;
			expect(err).not.to.exist;
		});
	});
});